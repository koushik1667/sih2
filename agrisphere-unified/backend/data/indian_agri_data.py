import math
from typing import Dict, Any, List, Optional

# ── 1. State-level Production, Farmer & Economics Data ────────────────────────
STATE_PROFILES = [
    {"state": "Uttar Pradesh", "production_mt": 58400000, "area_ha": 25800000, "avg_farmer_earning": 142000, "avg_land_size": 2.4, "total_farmers": 23400000, "productivity_index": 78.4, "primary_crops": ["Wheat", "Sugarcane", "Rice", "Potato"], "soil_type": "Alluvial", "avg_rainfall_mm": 980, "avg_temp_c": 25.2},
    {"state": "Punjab", "production_mt": 32100000, "area_ha": 7900000, "avg_farmer_earning": 298000, "avg_land_size": 8.6, "total_farmers": 1850000, "productivity_index": 94.2, "primary_crops": ["Wheat", "Rice", "Cotton", "Maize"], "soil_type": "Alluvial", "avg_rainfall_mm": 620, "avg_temp_c": 24.1},
    {"state": "Madhya Pradesh", "production_mt": 36800000, "area_ha": 15400000, "avg_farmer_earning": 156000, "avg_land_size": 4.8, "total_farmers": 8900000, "productivity_index": 74.6, "primary_crops": ["Soybean", "Wheat", "Chickpea", "Mustard"], "soil_type": "Black / Clay", "avg_rainfall_mm": 1050, "avg_temp_c": 26.3},
    {"state": "Maharashtra", "production_mt": 28900000, "area_ha": 14200000, "avg_farmer_earning": 168000, "avg_land_size": 3.6, "total_farmers": 13600000, "productivity_index": 71.8, "primary_crops": ["Sugarcane", "Cotton", "Soybean", "Pigeon Pea"], "soil_type": "Black (Regur)", "avg_rainfall_mm": 1150, "avg_temp_c": 27.1},
    {"state": "West Bengal", "production_mt": 24700000, "area_ha": 5800000, "avg_farmer_earning": 128000, "avg_land_size": 1.9, "total_farmers": 7200000, "productivity_index": 82.1, "primary_crops": ["Rice", "Jute", "Potato", "Maize"], "soil_type": "Alluvial / Coastal", "avg_rainfall_mm": 1680, "avg_temp_c": 26.8},
    {"state": "Andhra Pradesh", "production_mt": 21500000, "area_ha": 6200000, "avg_farmer_earning": 185000, "avg_land_size": 3.2, "total_farmers": 6400000, "productivity_index": 84.7, "primary_crops": ["Rice", "Cotton", "Groundnut", "Chilli"], "soil_type": "Red / Coastal Alluvial", "avg_rainfall_mm": 940, "avg_temp_c": 28.4},
    {"state": "Karnataka", "production_mt": 18200000, "area_ha": 11800000, "avg_farmer_earning": 172000, "avg_land_size": 3.8, "total_farmers": 7900000, "productivity_index": 76.5, "primary_crops": ["Maize", "Sugarcane", "Rice", "Cotton"], "soil_type": "Red / Black", "avg_rainfall_mm": 1120, "avg_temp_c": 26.0},
    {"state": "Gujarat", "production_mt": 19400000, "area_ha": 9800000, "avg_farmer_earning": 224000, "avg_land_size": 5.1, "total_farmers": 5400000, "productivity_index": 80.3, "primary_crops": ["Cotton", "Groundnut", "Wheat", "Castor"], "soil_type": "Black / Sandy Alluvial", "avg_rainfall_mm": 780, "avg_temp_c": 27.6},
    {"state": "Haryana", "production_mt": 18600000, "area_ha": 4600000, "avg_farmer_earning": 275000, "avg_land_size": 5.5, "total_farmers": 1600000, "productivity_index": 91.5, "primary_crops": ["Wheat", "Mustard", "Rice", "Cotton"], "soil_type": "Alluvial", "avg_rainfall_mm": 540, "avg_temp_c": 24.8},
    {"state": "Rajasthan", "production_mt": 22300000, "area_ha": 21200000, "avg_farmer_earning": 139000, "avg_land_size": 7.2, "total_farmers": 7100000, "productivity_index": 68.2, "primary_crops": ["Mustard", "Bajra", "Wheat", "Gram"], "soil_type": "Desert / Sandy Loam", "avg_rainfall_mm": 480, "avg_temp_c": 27.8},
    {"state": "Tamil Nadu", "production_mt": 14500000, "area_ha": 4900000, "avg_farmer_earning": 162000, "avg_land_size": 2.1, "total_farmers": 4200000, "productivity_index": 83.9, "primary_crops": ["Rice", "Sugarcane", "Groundnut", "Banana"], "soil_type": "Red / Clay Loam", "avg_rainfall_mm": 960, "avg_temp_c": 28.9},
    {"state": "Bihar", "production_mt": 16800000, "area_ha": 5200000, "avg_farmer_earning": 105000, "avg_land_size": 1.4, "total_farmers": 9800000, "productivity_index": 73.1, "primary_crops": ["Rice", "Wheat", "Maize", "Pulses"], "soil_type": "Alluvial", "avg_rainfall_mm": 1200, "avg_temp_c": 26.1},
    {"state": "Telangana", "production_mt": 15400000, "area_ha": 5300000, "avg_farmer_earning": 169000, "avg_land_size": 2.9, "total_farmers": 4900000, "productivity_index": 79.8, "primary_crops": ["Rice", "Cotton", "Maize", "Soybean"], "soil_type": "Red / Black", "avg_rainfall_mm": 910, "avg_temp_c": 28.2}
]

# ── 2. Top 10 Districts by Production ─────────────────────────────────────────
TOP_DISTRICTS = [
    {"district": "Ludhiana", "state": "Punjab", "production_mt": 3850000, "yield_t_ha": 5.4, "crop": "Wheat/Paddy"},
    {"district": "Kolhapur", "state": "Maharashtra", "production_mt": 3620000, "yield_t_ha": 92.0, "crop": "Sugarcane"},
    {"district": "Muzaffarnagar", "state": "Uttar Pradesh", "production_mt": 3410000, "yield_t_ha": 86.5, "crop": "Sugarcane"},
    {"district": "East Godavari", "state": "Andhra Pradesh", "production_mt": 3120000, "yield_t_ha": 4.8, "crop": "Paddy"},
    {"district": "Bardhaman", "state": "West Bengal", "production_mt": 2980000, "yield_t_ha": 4.6, "crop": "Rice"},
    {"district": "Karnal", "state": "Haryana", "production_mt": 2840000, "yield_t_ha": 5.2, "crop": "Wheat/Paddy"},
    {"district": "Sangli", "state": "Maharashtra", "production_mt": 2750000, "yield_t_ha": 84.0, "crop": "Sugarcane"},
    {"district": "Ujjain", "state": "Madhya Pradesh", "production_mt": 2610000, "yield_t_ha": 2.4, "crop": "Soybean/Wheat"},
    {"district": "Thanjavur", "state": "Tamil Nadu", "production_mt": 2490000, "yield_t_ha": 4.9, "crop": "Rice"},
    {"district": "Belagavi", "state": "Karnataka", "production_mt": 2380000, "yield_t_ha": 78.0, "crop": "Sugarcane/Maize"}
]

# ── 3. Multi-Year Production & Area Trends (2012 - 2024) ───────────────────────
YEARLY_TRENDS = [
    {"year": "2012-13", "total_production_mt": 257.1, "total_area_mha": 126.2, "avg_yield_t_ha": 2.04, "rainfall_anomaly_pct": -7.1, "temp_c": 24.8},
    {"year": "2013-14", "total_production_mt": 265.6, "total_area_mha": 127.8, "avg_yield_t_ha": 2.08, "rainfall_anomaly_pct": 5.6, "temp_c": 24.6},
    {"year": "2014-15", "total_production_mt": 252.0, "total_area_mha": 124.5, "avg_yield_t_ha": 2.02, "rainfall_anomaly_pct": -11.9, "temp_c": 25.1},
    {"year": "2015-16", "total_production_mt": 251.6, "total_area_mha": 123.2, "avg_yield_t_ha": 2.04, "rainfall_anomaly_pct": -14.3, "temp_c": 25.4},
    {"year": "2016-17", "total_production_mt": 275.1, "total_area_mha": 128.0, "avg_yield_t_ha": 2.15, "rainfall_anomaly_pct": -2.8, "temp_c": 24.9},
    {"year": "2017-18", "total_production_mt": 285.0, "total_area_mha": 127.5, "avg_yield_t_ha": 2.23, "rainfall_anomaly_pct": -5.1, "temp_c": 25.2},
    {"year": "2018-19", "total_production_mt": 285.2, "total_area_mha": 125.8, "avg_yield_t_ha": 2.27, "rainfall_anomaly_pct": -9.2, "temp_c": 25.3},
    {"year": "2019-20", "total_production_mt": 297.5, "total_area_mha": 128.4, "avg_yield_t_ha": 2.32, "rainfall_anomaly_pct": 10.4, "temp_c": 25.0},
    {"year": "2020-21", "total_production_mt": 310.7, "total_area_mha": 130.2, "avg_yield_t_ha": 2.39, "rainfall_anomaly_pct": 8.7, "temp_c": 24.9},
    {"year": "2021-22", "total_production_mt": 315.6, "total_area_mha": 129.8, "avg_yield_t_ha": 2.43, "rainfall_anomaly_pct": 0.4, "temp_c": 25.2},
    {"year": "2022-23", "total_production_mt": 329.7, "total_area_mha": 131.5, "avg_yield_t_ha": 2.51, "rainfall_anomaly_pct": 6.2, "temp_c": 25.5},
    {"year": "2023-24", "total_production_mt": 332.3, "total_area_mha": 132.1, "avg_yield_t_ha": 2.52, "rainfall_anomaly_pct": -5.6, "temp_c": 25.8}
]

# ── 4. Crop-wise Soil Health, NPK Demands & Radar Matrix ──────────────────────
SOIL_HEALTH_RADAR = [
    {"crop": "Rice / Paddy", "soil_health_score": 76.5, "fertility_index": 82.0, "stress_index": 28.5, "nitrogen": 180, "phosphorus": 35, "potassium": 160, "moisture_pct": 65, "humidity": 78, "soil_type": "Clay / Alluvial"},
    {"crop": "Wheat", "soil_health_score": 84.2, "fertility_index": 86.4, "stress_index": 18.2, "nitrogen": 210, "phosphorus": 48, "potassium": 190, "moisture_pct": 42, "humidity": 55, "soil_type": "Alluvial Loam"},
    {"crop": "Cotton", "soil_health_score": 68.4, "fertility_index": 71.2, "stress_index": 44.0, "nitrogen": 150, "phosphorus": 30, "potassium": 140, "moisture_pct": 32, "humidity": 62, "soil_type": "Black Cotton Soil"},
    {"crop": "Sugarcane", "soil_health_score": 79.1, "fertility_index": 88.0, "stress_index": 35.8, "nitrogen": 240, "phosphorus": 55, "potassium": 220, "moisture_pct": 58, "humidity": 72, "soil_type": "Heavy Alluvial"},
    {"crop": "Soybean", "soil_health_score": 72.8, "fertility_index": 75.0, "stress_index": 31.4, "nitrogen": 130, "phosphorus": 38, "potassium": 125, "moisture_pct": 38, "humidity": 68, "soil_type": "Medium Black"},
    {"crop": "Chickpea", "soil_health_score": 74.0, "fertility_index": 73.5, "stress_index": 22.0, "nitrogen": 95, "phosphorus": 32, "potassium": 110, "moisture_pct": 28, "humidity": 48, "soil_type": "Sandy Loam / Black"},
    {"crop": "Maize", "soil_health_score": 81.0, "fertility_index": 83.2, "stress_index": 25.0, "nitrogen": 190, "phosphorus": 42, "potassium": 170, "moisture_pct": 45, "humidity": 64, "soil_type": "Red / Sandy Loam"},
    {"crop": "Mustard", "soil_health_score": 77.2, "fertility_index": 76.8, "stress_index": 26.5, "nitrogen": 140, "phosphorus": 34, "potassium": 135, "moisture_pct": 30, "humidity": 52, "soil_type": "Sandy Loam"}
]

# ── 5. Climate Correlation Matrix & Extreme Weather Impact ─────────────────────
CLIMATE_IMPACT_SERIES = [
    {"year": 2018, "rainfall_mm": 1042, "avg_temp_c": 25.3, "crop_yield_t_ha": 2.27, "weather_risk_index": 38, "extreme_events": 14, "economic_impact_m_usd": 420, "efficiency_score_yoy": 101.4},
    {"year": 2019, "rainfall_mm": 1288, "avg_temp_c": 25.0, "crop_yield_t_ha": 2.32, "weather_risk_index": 52, "extreme_events": 26, "economic_impact_m_usd": 780, "efficiency_score_yoy": 102.2},
    {"year": 2020, "rainfall_mm": 1262, "avg_temp_c": 24.9, "crop_yield_t_ha": 2.39, "weather_risk_index": 44, "extreme_events": 21, "economic_impact_m_usd": 610, "efficiency_score_yoy": 103.0},
    {"year": 2021, "rainfall_mm": 1175, "avg_temp_c": 25.2, "crop_yield_t_ha": 2.43, "weather_risk_index": 48, "extreme_events": 24, "economic_impact_m_usd": 720, "efficiency_score_yoy": 101.7},
    {"year": 2022, "rainfall_mm": 1250, "avg_temp_c": 25.5, "crop_yield_t_ha": 2.51, "weather_risk_index": 58, "extreme_events": 31, "economic_impact_m_usd": 940, "efficiency_score_yoy": 103.3},
    {"year": 2023, "rainfall_mm": 1090, "avg_temp_c": 25.8, "crop_yield_t_ha": 2.52, "weather_risk_index": 64, "extreme_events": 35, "economic_impact_m_usd": 1120, "efficiency_score_yoy": 100.4},
    {"year": 2024, "rainfall_mm": 1195, "avg_temp_c": 25.6, "crop_yield_t_ha": 2.58, "weather_risk_index": 46, "extreme_events": 22, "economic_impact_m_usd": 680, "efficiency_score_yoy": 102.4}
]

# ── 6. Seasonality & Farmer Demographics Breakdown ─────────────────────────────
SEASONAL_BREAKDOWN = [
    {"season": "Kharif (Monsoon)", "production_pct": 52.4, "tonnage_mt": 174.1, "key_crops": "Rice, Cotton, Soybean, Maize, Sugarcane"},
    {"season": "Rabi (Winter)", "production_pct": 41.8, "tonnage_mt": 138.9, "key_crops": "Wheat, Mustard, Chickpea, Barley"},
    {"season": "Zaid / Summer", "production_pct": 5.8, "tonnage_mt": 19.3, "key_crops": "Moong, Watermelon, Vegetables, Fodder"}
]

FARMER_DEMOGRAPHICS = {
    "gender": [{"name": "Male Farmers", "value": 73.2, "productivity": 79.4}, {"name": "Female Farmers", "value": 26.8, "productivity": 81.2}],
    "irrigation": [
        {"type": "Tube Well / Borewell", "share_pct": 46.2, "productivity_index": 86.5},
        {"type": "Canal Irrigation", "share_pct": 28.4, "productivity_index": 82.1},
        {"type": "Rainfed / Monsoon Only", "share_pct": 19.8, "productivity_index": 62.4},
        {"type": "Drip & Micro-Irrigation", "share_pct": 5.6, "productivity_index": 93.8}
    ],
    "national_kpis": {
        "total_production_tonnes": 332300000,
        "total_cultivated_area_ha": 132100000,
        "national_avg_yield_t_ha": 2.52,
        "avg_farmer_annual_income_inr": 164500,
        "avg_farmer_land_size_acres": 3.8,
        "avg_farmer_age": 48.6,
        "avg_experience_years": 24.2,
        "avg_fertilizer_kg_acre": 128.5,
        "avg_pesticide_kg_acre": 0.42,
        "market_access_pct": 68.4,
        "target_productivity_index": 85.0,
        "current_productivity_index": 78.6,
        "weather_risk_index": 46.2
    }
}


def get_analytics_summary(
    state_filter: Optional[str] = None,
    season_filter: Optional[str] = None,
    crop_filter: Optional[str] = None
) -> Dict[str, Any]:
    """
    Computes filtered BI metrics for the National Agriculture Analytics Hub.
    """
    filtered_states = STATE_PROFILES
    if state_filter and isinstance(state_filter, str) and state_filter.lower() != "all":
        filtered_states = [s for s in STATE_PROFILES if state_filter.lower() in s["state"].lower()]

    if not filtered_states:
        filtered_states = STATE_PROFILES

    tot_prod = sum(s["production_mt"] for s in filtered_states)
    tot_area = sum(s["area_ha"] for s in filtered_states)
    tot_farmers = sum(s["total_farmers"] for s in filtered_states)
    avg_earning = int(sum(s["avg_farmer_earning"] * s["total_farmers"] for s in filtered_states) / max(tot_farmers, 1))
    avg_land = round(sum(s["avg_land_size"] * s["total_farmers"] for s in filtered_states) / max(tot_farmers, 1), 2)
    avg_prod_idx = round(sum(s["productivity_index"] * s["production_mt"] for s in filtered_states) / max(tot_prod, 1), 1)

    # Waterfall breakdown: Crop contribution to total tonnage
    waterfall_crops = [
        {"name": "Rice", "value": 135.5, "delta": "+135.5 MT", "category": "Foodgrain"},
        {"name": "Wheat", "value": 112.9, "delta": "+112.9 MT", "category": "Foodgrain"},
        {"name": "Coarse Cereals", "value": 54.2, "delta": "+54.2 MT", "category": "Foodgrain"},
        {"name": "Pulses", "value": 26.0, "delta": "+26.0 MT", "category": "Foodgrain"},
        {"name": "Oilseeds", "value": 41.5, "delta": "+41.5 MT", "category": "Commercial"},
        {"name": "Total Output", "value": 370.1, "isTotal": True}
    ]

    return {
        "kpis": {
            "total_production_mt": round(tot_prod / 1000000, 2),
            "total_area_mha": round(tot_area / 1000000, 2),
            "avg_yield_t_ha": round((tot_prod / max(tot_area, 1)), 2),
            "total_farmers": tot_farmers,
            "avg_farmer_earning_inr": avg_earning,
            "avg_land_size_acres": avg_land,
            "productivity_index": avg_prod_idx,
            "target_productivity": 85.0,
            "weather_risk_index": 46.2,
            "soil_health_national_score": 77.4
        },
        "states": filtered_states,
        "top_districts": TOP_DISTRICTS,
        "yearly_trends": YEARLY_TRENDS,
        "soil_radar": SOIL_HEALTH_RADAR,
        "climate_impact": CLIMATE_IMPACT_SERIES,
        "seasons": SEASONAL_BREAKDOWN,
        "farmer_demographics": FARMER_DEMOGRAPHICS,
        "waterfall": waterfall_crops
    }
