from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid

router = APIRouter(prefix="/api/farms", tags=["Farm & Field Management"])

# Initial realistic pre-loaded demo farms
DEMO_FARMS = [
    {
        "id": "farm-punjab-01",
        "name": "Green Valley Golden Acres",
        "farmer_name": "Gurpreet Singh",
        "location": "Ludhiana, Punjab",
        "coordinates": {"lat": 30.9010, "lng": 75.8573},
        "land_size_acres": 12.5,
        "soil_type": "Alluvial Sandy Loam",
        "irrigation_type": "Tube Well & Canal",
        "current_crop": "Wheat",
        "active_season": "Rabi 2026",
        "soil_health": {
            "score": 84.5,
            "risk_level": "Low",
            "nitrogen": 220.0,
            "phosphorus": 45.0,
            "potassium": 190.0,
            "ph": 7.1,
            "organic_carbon": 0.95,
            "moisture": 42.0
        },
        "last_tested": "2026-02-10"
    },
    {
        "id": "farm-mh-02",
        "name": "Sahyadri Bio-Cane Plantation",
        "farmer_name": "Santosh Patil",
        "location": "Kolhapur, Maharashtra",
        "coordinates": {"lat": 16.7050, "lng": 74.2433},
        "land_size_acres": 8.0,
        "soil_type": "Deep Black Regur Soil",
        "irrigation_type": "River Drip System",
        "current_crop": "Sugarcane",
        "active_season": "Whole Year",
        "soil_health": {
            "score": 78.2,
            "risk_level": "Medium",
            "nitrogen": 190.0,
            "phosphorus": 36.0,
            "potassium": 210.0,
            "ph": 7.6,
            "organic_carbon": 0.82,
            "moisture": 55.0
        },
        "last_tested": "2026-01-24"
    },
    {
        "id": "farm-ap-03",
        "name": "Godavari Annapurna Fields",
        "farmer_name": "Ramesh Varma",
        "location": "East Godavari, Andhra Pradesh",
        "coordinates": {"lat": 16.9891, "lng": 82.2475},
        "land_size_acres": 5.5,
        "soil_type": "Deltaic Clay Alluvial",
        "irrigation_type": "Canal Inundation",
        "current_crop": "Rice",
        "active_season": "Kharif 2026",
        "soil_health": {
            "score": 68.0,
            "risk_level": "Medium",
            "nitrogen": 145.0,
            "phosphorus": 22.0,
            "potassium": 130.0,
            "ph": 6.4,
            "organic_carbon": 0.65,
            "moisture": 62.0
        },
        "last_tested": "2026-02-18"
    },
    {
        "id": "farm-ka-04",
        "name": "Mysuru Agro-Horti Farm",
        "farmer_name": "Gowda Manjunath",
        "location": "Mandya / Mysuru, Karnataka",
        "coordinates": {"lat": 12.5230, "lng": 76.8970},
        "land_size_acres": 4.2,
        "soil_type": "Red Sandy Loam",
        "irrigation_type": "Borewell Sprinkler",
        "current_crop": "Maize",
        "active_season": "Kharif",
        "soil_health": {
            "score": 81.2,
            "risk_level": "Low",
            "nitrogen": 185.0,
            "phosphorus": 40.0,
            "potassium": 165.0,
            "ph": 6.7,
            "organic_carbon": 0.88,
            "moisture": 38.0
        },
        "last_tested": "2026-02-05"
    }
]

# Mutable store for live session
_FARMS_DB = list(DEMO_FARMS)


class FarmCreateRequest(BaseModel):
    name: str = Field(..., example="Sita Ram Farms")
    farmer_name: str = Field(..., example="Kishore Kumar")
    location: str = Field(..., example="Indore, Madhya Pradesh")
    land_size_acres: float = Field(..., example=5.0)
    soil_type: str = Field("Medium Black", example="Medium Black")
    irrigation_type: str = Field("Borewell", example="Borewell")
    current_crop: str = Field("Soybean", example="Soybean")
    active_season: Optional[str] = "Kharif 2026"
    nitrogen: Optional[float] = 160.0
    phosphorus: Optional[float] = 28.0
    potassium: Optional[float] = 140.0
    ph: Optional[float] = 6.9
    organic_carbon: Optional[float] = 0.78
    moisture: Optional[float] = 35.0


@router.get("")
def list_farms():
    """Returns all registered farm profiles with soil health indicators."""
    return {"farms": _FARMS_DB, "total": len(_FARMS_DB)}


@router.get("/{farm_id}")
def get_farm(farm_id: str):
    """Retrieves a single farm profile by ID."""
    for f in _FARMS_DB:
        if f["id"] == farm_id:
            return f
    raise HTTPException(status_code=404, detail="Farm not found")


@router.post("")
def create_farm(req: FarmCreateRequest):
    """Creates a new farm profile with initial soil health parameters."""
    from ml.soil_predictor import calculate_soil_health_score
    
    score_res = calculate_soil_health_score(
        nitrogen=req.nitrogen or 160.0,
        phosphorus=req.phosphorus or 28.0,
        potassium=req.potassium or 140.0,
        ph=req.ph or 6.9,
        organic_carbon=req.organic_carbon or 0.78,
        moisture=req.moisture or 35.0
    )

    new_farm = {
        "id": f"farm-{uuid.uuid4().hex[:8]}",
        "name": req.name,
        "farmer_name": req.farmer_name,
        "location": req.location,
        "coordinates": {"lat": 22.7196, "lng": 75.8577},
        "land_size_acres": req.land_size_acres,
        "soil_type": req.soil_type,
        "irrigation_type": req.irrigation_type,
        "current_crop": req.current_crop,
        "active_season": req.active_season or "Kharif 2026",
        "soil_health": {
            "score": score_res["score"],
            "risk_level": score_res["risk_level"],
            "nitrogen": req.nitrogen or 160.0,
            "phosphorus": req.phosphorus or 28.0,
            "potassium": req.potassium or 140.0,
            "ph": req.ph or 6.9,
            "organic_carbon": req.organic_carbon or 0.78,
            "moisture": req.moisture or 35.0
        },
        "last_tested": "2026-08-25"
    }
    _FARMS_DB.insert(0, new_farm)
    return {"status": "success", "farm": new_farm}


@router.delete("/{farm_id}")
def delete_farm(farm_id: str):
    """Deletes a farm profile."""
    global _FARMS_DB
    initial_len = len(_FARMS_DB)
    _FARMS_DB = [f for f in _FARMS_DB if f["id"] != farm_id]
    if len(_FARMS_DB) == initial_len:
        raise HTTPException(status_code=404, detail="Farm not found")
    return {"status": "deleted", "id": farm_id}
