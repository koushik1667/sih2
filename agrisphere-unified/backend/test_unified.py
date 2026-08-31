import sys
import unittest
from pathlib import Path

# Add backend directory to sys.path
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, str(Path(__file__).parent.resolve()))

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

class TestAgriSphereUnified(unittest.TestCase):
    
    def test_health(self):
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("geosr_satellite_srm", data["modules"])
        print("✓ Health Check Passed")

    def test_geosr_presets_and_inference(self):
        # 1. Presets
        res = client.get("/api/geosr/presets")
        self.assertEqual(res.status_code, 200)
        presets = res.json()["presets"]
        self.assertGreater(len(presets), 0)
        print(f"✓ Found {len(presets)} GeoSR Presets")

        # 2. Inference
        res = client.post("/api/geosr/predict", data={
            "preset_id": "punjab_wheat_belt",
            "model": "edsr",
            "scale_factor": 4
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()["data"]
        self.assertEqual(data["model"], "EDSR")
        self.assertIn("psnr", data["metrics"])
        self.assertIn("super_res", data["images"])
        self.assertIn("ndvi", data["images"])
        print(f"✓ GeoSR Inference Passed! PSNR: {data['metrics']['psnr']} dB, Output: {data['output_resolution']}")

    def test_soil_scoring_and_depletion(self):
        # 1. Soil Score
        res = client.post("/api/soil/score", json={
            "nitrogen": 180,
            "phosphorus": 35,
            "potassium": 160,
            "ph": 6.8,
            "organic_carbon": 0.85
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["score"], 60)
        print(f"✓ Soil Scoring Passed! Score: {data['score']}, Risk: {data['risk_level']}")

        # 2. 3-Season Depletion
        res = client.post("/api/soil/depletion", json={
            "crop": "Wheat",
            "nitrogen": 180,
            "phosphorus": 35,
            "potassium": 160,
            "organic_carbon": 0.85,
            "seasons": 3
        })
        self.assertEqual(res.status_code, 200)
        dep_data = res.json()
        self.assertEqual(len(dep_data["monoculture_drawdown"]), 4) # Baseline + 3 seasons
        print("✓ 3-Season Soil Depletion Simulation Passed!")

        # 3. Crop Rotation
        res = client.post("/api/soil/rotation", json={
            "current_crop": "Wheat",
            "soil_score": 75.0,
            "ph": 6.8
        })
        self.assertEqual(res.status_code, 200)
        rot_data = res.json()
        self.assertIn("recommended_rotation", rot_data)
        print(f"✓ Crop Rotation Recommender Passed! Next Crop: {rot_data['recommended_rotation']['next_crop']}")

    def test_powerbi_analytics(self):
        res = client.get("/api/analytics/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("kpis", data)
        self.assertIn("states", data)
        self.assertIn("soil_radar", data)
        print(f"✓ Power BI Analytics Engine Passed! National Output: {data['kpis']['total_production_mt']} MT")

    def test_ai_agronomist_chat(self):
        res = client.post("/api/chat", json={
            "query": "What should I spray for wheat yellow leaves?",
            "language": "en"
        })
        self.assertEqual(res.status_code, 200)
        chat_res = res.json()
        self.assertIn("Urea", chat_res["answer"])
        print(f"✓ AI Agronomist RAG Passed! Topic: {chat_res['topic']}")

    def test_farms_crud(self):
        # List farms
        res = client.get("/api/farms")
        self.assertEqual(res.status_code, 200)
        farms = res.json()["farms"]
        self.assertGreaterEqual(len(farms), 1)
        print(f"✓ Farms CRUD Passed! Total Registered: {len(farms)}")

if __name__ == "__main__":
    unittest.main()
