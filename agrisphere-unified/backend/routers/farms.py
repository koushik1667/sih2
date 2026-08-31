import sqlite3
import json
import uuid
import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from config import DATA_DIR

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

DB_PATH = DATA_DIR / "farms.db"

def get_db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def _insert_farm_row(cursor, farm_dict: Dict[str, Any]):
    cursor.execute("""
        INSERT OR REPLACE INTO farms (
            id, name, farmer_name, location, coordinates_json,
            land_size_acres, soil_type, irrigation_type, current_crop,
            active_season, soil_health_json, last_tested
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        farm_dict["id"],
        farm_dict["name"],
        farm_dict["farmer_name"],
        farm_dict["location"],
        json.dumps(farm_dict.get("coordinates", {"lat": 22.7196, "lng": 75.8577})),
        float(farm_dict["land_size_acres"]),
        farm_dict["soil_type"],
        farm_dict["irrigation_type"],
        farm_dict["current_crop"],
        farm_dict.get("active_season", "Kharif 2026"),
        json.dumps(farm_dict["soil_health"]),
        farm_dict.get("last_tested", datetime.date.today().isoformat())
    ))

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS farms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            farmer_name TEXT NOT NULL,
            location TEXT NOT NULL,
            coordinates_json TEXT NOT NULL,
            land_size_acres REAL NOT NULL,
            soil_type TEXT NOT NULL,
            irrigation_type TEXT NOT NULL,
            current_crop TEXT NOT NULL,
            active_season TEXT NOT NULL,
            soil_health_json TEXT NOT NULL,
            last_tested TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Check count, seed if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM farms")
    count = cursor.fetchone()["cnt"]
    
    if count == 0:
        initial_farms = DEMO_FARMS
        farms_file = DATA_DIR / "farms.json"
        if farms_file.exists():
            try:
                with open(farms_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list) and len(data) > 0:
                        initial_farms = data
            except Exception:
                pass
        
        for farm in initial_farms:
            _insert_farm_row(cursor, farm)
        conn.commit()

    conn.close()

# Initialize DB table on module load
init_db()

def _row_to_farm_dict(row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "name": row["name"],
        "farmer_name": row["farmer_name"],
        "location": row["location"],
        "coordinates": json.loads(row["coordinates_json"]),
        "land_size_acres": float(row["land_size_acres"]),
        "soil_type": row["soil_type"],
        "irrigation_type": row["irrigation_type"],
        "current_crop": row["current_crop"],
        "active_season": row["active_season"],
        "soil_health": json.loads(row["soil_health_json"]),
        "last_tested": row["last_tested"]
    }


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


class FarmUpdateRequest(BaseModel):
    name: Optional[str] = None
    farmer_name: Optional[str] = None
    location: Optional[str] = None
    land_size_acres: Optional[float] = None
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    current_crop: Optional[str] = None
    active_season: Optional[str] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    ph: Optional[float] = None
    organic_carbon: Optional[float] = None
    moisture: Optional[float] = None


@router.get("")
def list_farms():
    """Returns all registered farm profiles from SQLite database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farms ORDER BY rowid DESC")
    rows = cursor.fetchall()
    farms = [_row_to_farm_dict(r) for r in rows]
    conn.close()
    return {"farms": farms, "total": len(farms)}


@router.get("/{farm_id}")
def get_farm(farm_id: str):
    """Retrieves a single farm profile by ID from SQLite database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farms WHERE id = ?", (farm_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Farm not found")
    return _row_to_farm_dict(row)


@router.post("")
def create_farm(req: FarmCreateRequest):
    """Creates a new farm profile and saves it to SQLite database."""
    from ml.soil_predictor import calculate_soil_health_score
    
    score_res = calculate_soil_health_score(
        nitrogen=req.nitrogen or 160.0,
        phosphorus=req.phosphorus or 28.0,
        potassium=req.potassium or 140.0,
        ph=req.ph or 6.9,
        organic_carbon=req.organic_carbon or 0.78,
        moisture=req.moisture or 35.0
    )

    today_str = datetime.date.today().isoformat()
    farm_id = f"farm-{uuid.uuid4().hex[:8]}"

    new_farm = {
        "id": farm_id,
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
        "last_tested": today_str
    }

    conn = get_db_connection()
    cursor = conn.cursor()
    _insert_farm_row(cursor, new_farm)
    conn.commit()
    conn.close()

    return {"status": "success", "farm": new_farm}


@router.put("/{farm_id}")
@router.patch("/{farm_id}")
def update_farm(farm_id: str, req: FarmUpdateRequest):
    """Updates an existing farm profile in SQLite database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farms WHERE id = ?", (farm_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Farm not found")

    existing = _row_to_farm_dict(row)
    
    if req.name is not None: existing["name"] = req.name
    if req.farmer_name is not None: existing["farmer_name"] = req.farmer_name
    if req.location is not None: existing["location"] = req.location
    if req.land_size_acres is not None: existing["land_size_acres"] = req.land_size_acres
    if req.soil_type is not None: existing["soil_type"] = req.soil_type
    if req.irrigation_type is not None: existing["irrigation_type"] = req.irrigation_type
    if req.current_crop is not None: existing["current_crop"] = req.current_crop
    if req.active_season is not None: existing["active_season"] = req.active_season

    sh = existing["soil_health"]
    new_n = req.nitrogen if req.nitrogen is not None else sh.get("nitrogen", 160.0)
    new_p = req.phosphorus if req.phosphorus is not None else sh.get("phosphorus", 28.0)
    new_k = req.potassium if req.potassium is not None else sh.get("potassium", 140.0)
    new_ph = req.ph if req.ph is not None else sh.get("ph", 6.9)
    new_oc = req.organic_carbon if req.organic_carbon is not None else sh.get("organic_carbon", 0.78)
    new_m = req.moisture if req.moisture is not None else sh.get("moisture", 35.0)

    from ml.soil_predictor import calculate_soil_health_score
    score_res = calculate_soil_health_score(
        nitrogen=new_n,
        phosphorus=new_p,
        potassium=new_k,
        ph=new_ph,
        organic_carbon=new_oc,
        moisture=new_m
    )

    existing["soil_health"] = {
        "score": score_res["score"],
        "risk_level": score_res["risk_level"],
        "nitrogen": new_n,
        "phosphorus": new_p,
        "potassium": new_k,
        "ph": new_ph,
        "organic_carbon": new_oc,
        "moisture": new_m
    }
    existing["last_tested"] = datetime.date.today().isoformat()

    _insert_farm_row(cursor, existing)
    conn.commit()
    conn.close()

    return {"status": "success", "farm": existing}


@router.delete("/{farm_id}")
def delete_farm(farm_id: str):
    """Deletes a farm profile from SQLite database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM farms WHERE id = ?", (farm_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Farm not found")
        
    cursor.execute("DELETE FROM farms WHERE id = ?", (farm_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted", "id": farm_id}
