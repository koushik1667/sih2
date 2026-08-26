from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from ml.soil_predictor import (
    calculate_soil_health_score,
    predict_nutrient_depletion,
    get_crop_rotation_recommendation
)

router = APIRouter(prefix="/api/soil", tags=["Precision Soil Intelligence"])

class SoilScoreRequest(BaseModel):
    nitrogen: float = Field(..., example=165.0, description="Nitrogen in kg/ha")
    phosphorus: float = Field(..., example=24.0, description="Phosphorus in kg/ha")
    potassium: float = Field(..., example=140.0, description="Potassium in kg/ha")
    ph: float = Field(..., example=6.8, description="Soil pH (0-14)")
    organic_carbon: float = Field(..., example=0.85, description="Organic Carbon %")
    moisture: Optional[float] = Field(35.0, description="Soil moisture %")
    ec: Optional[float] = Field(0.8, description="Electrical Conductivity dS/m")

class DepletionRequest(BaseModel):
    crop: str = Field("Wheat", example="Wheat")
    nitrogen: float = Field(165.0, example=165.0)
    phosphorus: float = Field(24.0, example=24.0)
    potassium: float = Field(140.0, example=140.0)
    organic_carbon: float = Field(0.85, example=0.85)
    seasons: int = Field(3, ge=1, le=5)

class RotationRequest(BaseModel):
    current_crop: str = Field("Rice", example="Rice")
    soil_score: float = Field(65.0, example=65.0)
    ph: float = Field(6.8, example=6.8)
    irrigation_type: Optional[str] = "Borewell"


@router.post("/score")
def soil_score_endpoint(req: SoilScoreRequest):
    """Calculates comprehensive Soil Health Index and component grades."""
    return calculate_soil_health_score(
        nitrogen=req.nitrogen,
        phosphorus=req.phosphorus,
        potassium=req.potassium,
        ph=req.ph,
        organic_carbon=req.organic_carbon,
        moisture=req.moisture or 35.0,
        ec=req.ec or 0.8
    )


@router.post("/depletion")
def soil_depletion_endpoint(req: DepletionRequest):
    """Forecasts 3-season NPK nutrient drawdown under monoculture vs crop rotation."""
    return predict_nutrient_depletion(
        current_crop=req.crop,
        nitrogen=req.nitrogen,
        phosphorus=req.phosphorus,
        potassium=req.potassium,
        organic_carbon=req.organic_carbon,
        seasons=req.seasons
    )


@router.post("/rotation")
def crop_rotation_endpoint(req: RotationRequest):
    """Generates optimal restorative crop rotation sequences and economic gain estimates."""
    return get_crop_rotation_recommendation(
        current_crop=req.current_crop,
        soil_score=req.soil_score,
        ph=req.ph,
        irrigation_type=req.irrigation_type or "Canal"
    )
