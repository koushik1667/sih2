"""
Predictions Router (FastAPI)
────────────────────────────
Migrated from Flask + extended with a soil health scoring endpoint.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict

router = APIRouter(prefix="/predict", tags=["Predictions"])

# ── Schemas ────────────────────────────────────────
class SoilHealth(BaseModel):
    N: float
    P: float
    K: float
    pH: Optional[float] = None
    organicCarbon: Optional[float] = None
    moisture: Optional[float] = None

class CroppingEntry(BaseModel):
    season: str
    crop: str
    yield_: Optional[float] = None
    fertilizerUsed: Optional[Dict[str, float]] = None

class NutrientDepletionRequest(BaseModel):
    currentSoilHealth: SoilHealth
    croppingHistory: List[CroppingEntry] = []
    region: Optional[str] = None

class RotationRequest(BaseModel):
    currentSoilHealth: SoilHealth
    croppingHistory: List[CroppingEntry] = []
    region: Optional[str] = None

class SoilScoreRequest(BaseModel):
    N: float
    P: float
    K: float
    pH: Optional[float] = None
    organicCarbon: Optional[float] = None
    moisture: Optional[float] = None

# ── Crop nutrient data ─────────────────────────────
CROP_NUTRIENTS = {
    "rice":       {"N": 80,  "P": 40, "K": 40},
    "wheat":      {"N": 120, "P": 60, "K": 40},
    "sugarcane":  {"N": 300, "P": 100,"K": 200},
    "cotton":     {"N": 120, "P": 60, "K": 60},
    "maize":      {"N": 120, "P": 60, "K": 40},
    "soybean":    {"N": 30,  "P": 60, "K": 40, "N_replenish": 50},
    "chickpea":   {"N": 20,  "P": 40, "K": 20, "N_replenish": 40},
    "pigeon_pea": {"N": 25,  "P": 50, "K": 25, "N_replenish": 45},
    "mustard":    {"N": 100, "P": 50, "K": 40},
    "groundnut":  {"N": 25,  "P": 50, "K": 75, "N_replenish": 25},
}

def _normalize_crop(name: str) -> str:
    return name.lower().replace(" ", "_").replace("-", "_")


# ── Endpoints ──────────────────────────────────────

@router.post("/nutrient-depletion")
def predict_nutrient_depletion(req: NutrientDepletionRequest):
    """Calculate nutrient depletion projections based on cropping history."""
    soil = req.currentSoilHealth
    history = req.croppingHistory

    total_extraction = {"N": 0.0, "P": 0.0, "K": 0.0}
    total_replenishment = {"N": 0.0}

    for entry in history:
        crop = _normalize_crop(entry.crop)
        if crop in CROP_NUTRIENTS:
            n = CROP_NUTRIENTS[crop]
            total_extraction["N"] += n["N"]
            total_extraction["P"] += n["P"]
            total_extraction["K"] += n["K"]
            if "N_replenish" in n:
                total_replenishment["N"] += n["N_replenish"]

    count = max(len(history), 1)
    avg_n = (total_extraction["N"] - total_replenishment["N"]) / count
    avg_p = total_extraction["P"] / count
    avg_k = total_extraction["K"] / count

    # 3-season projection
    pN = [soil.N]
    pP = [soil.P]
    pK = [soil.K]
    for _ in range(3):
        pN.append(max(0.0, pN[-1] - avg_n * 0.6))
        pP.append(max(0.0, pP[-1] - avg_p * 0.5))
        pK.append(max(0.0, pK[-1] - avg_k * 0.5))

    # Risk scoring
    risk = 0
    final_n, final_p, final_k = pN[-1], pP[-1], pK[-1]
    if final_n < 200: risk += 1
    if final_n < 100: risk += 1
    if final_p < 15:  risk += 1
    if final_p < 8:   risk += 1
    if final_k < 100: risk += 1
    if final_k < 50:  risk += 1

    risk_map = {0: "Low", 1: "Low", 2: "Medium", 3: "High", 4: "High"}
    risk_level = "Critical" if risk >= 5 else risk_map.get(risk, "Medium")

    return {
        "riskScore": risk_level,
        "nutrientDepletion": {
            "N": {"current": soil.N, "projected": pN[1:]},
            "P": {"current": soil.P, "projected": pP[1:]},
            "K": {"current": soil.K, "projected": pK[1:]},
        },
        "yieldDeclineProbability": min(100, risk * 15),
        "economicLoss": risk * 5000,
        "soilRecoveryTimeline": max(6, risk * 3),
    }


@router.post("/rotation")
def recommend_rotation(req: RotationRequest):
    """Recommend crop rotation based on soil health and cropping history."""
    soil = req.currentSoilHealth
    recent = [_normalize_crop(e.crop) for e in req.croppingHistory[-3:]]
    recs = []

    if soil.N < 150:
        recs.append({
            "season": "Rabi",
            "crop": "Chickpea",
            "reason": "Legume will replenish nitrogen naturally (fixes 40 kg N/ha)",
        })
        if "soybean" not in recent:
            recs.append({
                "season": "Kharif",
                "crop": "Soybean",
                "reason": "High nitrogen fixation (50 kg N/ha) + improves organic matter",
            })

    if soil.N > 150 and "rice" not in recent:
        recs.append({
            "season": "Kharif",
            "crop": "Rice",
            "reason": "Good nutrient levels support paddy; diversifies income",
        })

    if "wheat" not in recent:
        recs.append({
            "season": "Rabi",
            "crop": "Wheat",
            "reason": "Complements summer crops; high MSP and market demand",
        })

    recs.append({
        "season": "Zaid",
        "crop": "Green Manure (Sunhemp)",
        "reason": "Adds 60–80 kg N/ha + 8–10 t green biomass to soil",
    })

    return {"recommendations": recs[:5]}


@router.post("/soil-score", summary="Compute AI soil health score 0-100")
def compute_soil_score(req: SoilScoreRequest):
    """Return a 0-100 soil health score and per-nutrient risk flags."""
    score = 100
    flags = []

    # pH
    if req.pH is not None:
        if req.pH < 5.5 or req.pH > 8.0:
            score -= 20; flags.append({"nutrient": "pH", "level": "critical", "value": req.pH})
        elif req.pH < 6.0 or req.pH > 7.5:
            score -= 10; flags.append({"nutrient": "pH", "level": "moderate", "value": req.pH})

    # N
    if req.N < 100:  score -= 15; flags.append({"nutrient": "N", "level": "critical", "value": req.N})
    elif req.N < 150: score -= 7; flags.append({"nutrient": "N", "level": "low", "value": req.N})

    # P
    if req.P < 10:  score -= 10; flags.append({"nutrient": "P", "level": "critical", "value": req.P})
    elif req.P < 20: score -= 5; flags.append({"nutrient": "P", "level": "low", "value": req.P})

    # K
    if req.K < 80:  score -= 10; flags.append({"nutrient": "K", "level": "critical", "value": req.K})
    elif req.K < 100: score -= 5; flags.append({"nutrient": "K", "level": "low", "value": req.K})

    # OC
    if req.organicCarbon is not None:
        if req.organicCarbon < 0.5:  score -= 10; flags.append({"nutrient": "OC", "level": "critical", "value": req.organicCarbon})
        elif req.organicCarbon < 0.75: score -= 5; flags.append({"nutrient": "OC", "level": "low", "value": req.organicCarbon})

    final = max(0, min(100, score))
    risk  = "Low" if final >= 75 else "Medium" if final >= 50 else "High" if final >= 25 else "Critical"

    recs = []
    for f in flags:
        if f["nutrient"] == "N":
            recs.append("Apply Urea (46-0-0) at 25-35 kg/acre as top-dressing")
        elif f["nutrient"] == "P":
            recs.append("Apply DAP (18-46-0) or SSP at 25 kg/acre at sowing")
        elif f["nutrient"] == "K":
            recs.append("Apply MOP (0-0-60) at 15-20 kg/acre pre-sowing")
        elif f["nutrient"] == "pH" and f["value"] < 6.0:
            recs.append("Apply agricultural lime at 500-1000 kg/acre to raise pH")
        elif f["nutrient"] == "OC":
            recs.append("Add 3-5 t/ha of farmyard manure or vermicompost")

    return {
        "healthScore":      final,
        "riskLevel":        risk,
        "flags":            flags,
        "recommendations":  list(dict.fromkeys(recs)),  # deduplicate
    }
