from typing import Dict, Any, List

CROPS_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "rice",
        "names": {"en": "Rice / Paddy", "hi": "धान / चावल", "kn": "ಭತ್ತ", "ta": "நெல்", "te": "వరి"},
        "category": "Cereal",
        "season": ["Kharif", "Rabi"],
        "ideal_ph_range": [5.5, 6.8],
        "ideal_temp_c": [22, 34],
        "rainfall_mm": [1000, 2000],
        "avg_yield_tons_ha": 3.8,
        "npk_demand": {"N": 120, "P": 60, "K": 60},
        "growth_days": 125,
        "primary_states": ["West Bengal", "Uttar Pradesh", "Punjab", "Andhra Pradesh", "Tamil Nadu"]
    },
    {
        "id": "wheat",
        "names": {"en": "Wheat", "hi": "गेहूं", "kn": "ಗೋಧಿ", "ta": "கோதுமை", "te": "గోధుమ"},
        "category": "Cereal",
        "season": ["Rabi"],
        "ideal_ph_range": [6.0, 7.5],
        "ideal_temp_c": [15, 25],
        "rainfall_mm": [350, 750],
        "avg_yield_tons_ha": 4.5,
        "npk_demand": {"N": 120, "P": 60, "K": 40},
        "growth_days": 135,
        "primary_states": ["Uttar Pradesh", "Punjab", "Madhya Pradesh", "Haryana", "Rajasthan"]
    },
    {
        "id": "cotton",
        "names": {"en": "Cotton", "hi": "कपास", "kn": "ಹತ್ತಿ", "ta": "பருத்தி", "te": "పత్తి"},
        "category": "Commercial / Fiber",
        "season": ["Kharif"],
        "ideal_ph_range": [6.5, 8.0],
        "ideal_temp_c": [21, 32],
        "rainfall_mm": [500, 1000],
        "avg_yield_tons_ha": 2.2,
        "npk_demand": {"N": 100, "P": 50, "K": 50},
        "growth_days": 160,
        "primary_states": ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Haryana"]
    },
    {
        "id": "sugarcane",
        "names": {"en": "Sugarcane", "hi": "गन्ना", "kn": "ಕಬ್ಬು", "ta": "கரும்பு", "te": "చెరకు"},
        "category": "Commercial",
        "season": ["Whole Year"],
        "ideal_ph_range": [6.5, 7.8],
        "ideal_temp_c": [20, 35],
        "rainfall_mm": [1200, 2200],
        "avg_yield_tons_ha": 82.0,
        "npk_demand": {"N": 250, "P": 100, "K": 150},
        "growth_days": 360,
        "primary_states": ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu"]
    },
    {
        "id": "soybean",
        "names": {"en": "Soybean", "hi": "सोयाबीन", "kn": "ಸೋಯಾಬೀನ್", "ta": "சோயாபீன்", "te": "సోయాబీన్"},
        "category": "Oilseed / Legume",
        "season": ["Kharif"],
        "ideal_ph_range": [6.0, 7.5],
        "ideal_temp_c": [20, 30],
        "rainfall_mm": [600, 900],
        "avg_yield_tons_ha": 1.8,
        "npk_demand": {"N": 30, "P": 60, "K": 40},
        "growth_days": 100,
        "primary_states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka"]
    },
    {
        "id": "chickpea",
        "names": {"en": "Chickpea (Gram)", "hi": "चना", "kn": "ಕಡಲೆ", "ta": "கொண்டைக்கடலை", "te": "శనగలు"},
        "category": "Pulse / Legume",
        "season": ["Rabi"],
        "ideal_ph_range": [6.0, 7.8],
        "ideal_temp_c": [12, 25],
        "rainfall_mm": [300, 600],
        "avg_yield_tons_ha": 1.4,
        "npk_demand": {"N": 20, "P": 40, "K": 20},
        "growth_days": 110,
        "primary_states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Uttar Pradesh"]
    },
    {
        "id": "maize",
        "names": {"en": "Maize (Corn)", "hi": "मक्का", "kn": "ಮೆಕ್ಕೆಜೋಳ", "ta": "மக்காச்சோளம்", "te": "మొక్కజొన్న"},
        "category": "Cereal",
        "season": ["Kharif", "Rabi"],
        "ideal_ph_range": [5.8, 7.2],
        "ideal_temp_c": [20, 32],
        "rainfall_mm": [500, 800],
        "avg_yield_tons_ha": 3.4,
        "npk_demand": {"N": 120, "P": 60, "K": 40},
        "growth_days": 105,
        "primary_states": ["Karnataka", "Madhya Pradesh", "Bihar", "Telangana", "Maharashtra"]
    },
    {
        "id": "mustard",
        "names": {"en": "Mustard", "hi": "सरसों", "kn": "ಸಾಸಿವೆ", "ta": "கடுகு", "te": "ఆవాలు"},
        "category": "Oilseed",
        "season": ["Rabi"],
        "ideal_ph_range": [6.0, 7.5],
        "ideal_temp_c": [10, 24],
        "rainfall_mm": [300, 500],
        "avg_yield_tons_ha": 1.6,
        "npk_demand": {"N": 80, "P": 40, "K": 30},
        "growth_days": 120,
        "primary_states": ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh"]
    }
]
