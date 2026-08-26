import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, str(Path(__file__).parent.resolve()))

from main import app, health_check
from routers.geosr import get_presets
from routers.soil import calculate_soil_health_score, predict_nutrient_depletion, get_crop_rotation_recommendation
from routers.analytics import get_bi_summary, get_crops_list
from routers.chat import chat_with_agronomist, ChatRequest
from routers.farms import list_farms
from routers.weather import get_weather_forecast
from PIL import Image

def run_tests():
    print("=== Testing AgriSphere AI Backend ===")
    
    # 1. Health
    h = health_check()
    assert h["status"] == "healthy", "Health check failed"
    print("[PASS] Health Check Passed:", h["service"])

    # 2. GeoSR Presets
    presets = get_presets()
    assert len(presets["presets"]) == 4, "Expected 4 presets"
    print(f"[PASS] GeoSR Presets Loaded: {[p['title'] for p in presets['presets']]}")

    # 3. GeoSR-AI PyTorch Inference
    from ml.inference import run_super_resolution
    test_img = Image.new("RGB", (128, 128), color=(80, 140, 60))
    inf_res = run_super_resolution(test_img, model_name="edsr", scale_factor=4)
    assert inf_res["model"] == "EDSR"
    assert "psnr" in inf_res["metrics"]
    assert "super_res" in inf_res["images"]
    assert "ndvi" in inf_res["images"]
    assert "false_color_nir" in inf_res["images"]
    assert "uncertainty" in inf_res["images"]
    print(f"[PASS] GeoSR-AI EDSR Inference Passed! PSNR: {inf_res['metrics']['psnr']} dB, GSD: {inf_res['ground_sampling_distance']['output']}")

    # 4. Precision Soil & Depletion
    s_score = calculate_soil_health_score(180, 35, 160, 6.8, 0.85)
    assert s_score["score"] > 60
    print(f"[PASS] Soil Health Score: {s_score['score']}/100, Risk: {s_score['risk_level']}")

    deplet = predict_nutrient_depletion("Wheat", 180, 35, 160, 0.85, seasons=3)
    assert len(deplet["monoculture_drawdown"]) == 4
    print(f"[PASS] 3-Season NPK Depletion Simulation: {len(deplet['monoculture_drawdown'])} data points generated")

    rot = get_crop_rotation_recommendation("Wheat", 75.0, 6.8)
    print(f"[PASS] Crop Rotation Recommender: Next crop {rot['recommended_rotation']['next_crop']}, Gain: ₹{rot['recommended_rotation']['economic_benefit_inr_acre']}/acre")

    # 5. Power BI Analytics Engine
    bi = get_bi_summary()
    assert bi["kpis"]["total_production_mt"] > 200
    print(f"[PASS] Power BI Analytics Engine: Total Production {bi['kpis']['total_production_mt']} MT, States: {len(bi['states'])}, Yearly Records: {len(bi['yearly_trends'])}")

    # 6. RAG AI Agronomist
    chat_req = ChatRequest(query="Why are wheat leaves turning yellow and what should I spray?")
    chat_out = chat_with_agronomist(chat_req)
    assert "urea" in chat_out["answer"].lower() or "nitrogen" in chat_out["answer"].lower()
    print(f"[PASS] Krishi Mitra RAG Chat: Topic '{chat_out['topic']}' | Citation: '{chat_out['citation']}'")

    # 7. Farms & Weather
    farms = list_farms()
    assert len(farms["farms"]) >= 4
    weather = get_weather_forecast("Punjab")
    assert len(weather["forecast_7_days"]) == 7
    print(f"[PASS] Registered Farms: {len(farms['farms'])}, Weather 7-Day Forecast Loaded")

    print("\n🎉 ALL 7 TEST SUITES PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
