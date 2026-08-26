from fastapi import APIRouter
from typing import Optional
from data.indian_agri_data import get_analytics_summary, STATE_PROFILES, SOIL_HEALTH_RADAR, TOP_DISTRICTS, YEARLY_TRENDS
from data.crops_data import CROPS_DATABASE

router = APIRouter(prefix="/api/analytics", tags=["National Agriculture Power BI Analytics"])

@router.get("/summary")
def get_bi_summary(
    state: Optional[str] = None,
    season: Optional[str] = None,
    crop: Optional[str] = None
):
    """
    Returns unified Power BI interactive dataset with dynamic slicer aggregation.
    """
    return get_analytics_summary(
        state_filter=state if isinstance(state, str) else None,
        season_filter=season if isinstance(season, str) else None,
        crop_filter=crop if isinstance(crop, str) else None
    )


@router.get("/crops")
def get_crops_list():
    """Returns detailed multilingual crop reference database."""
    return {"crops": CROPS_DATABASE, "total": len(CROPS_DATABASE)}


@router.get("/states")
def get_states_list():
    """Returns Indian agricultural states and production benchmarks."""
    return {"states": STATE_PROFILES, "total": len(STATE_PROFILES)}


@router.get("/radar")
def get_soil_radar():
    """Returns Crop-wise Soil Health, Fertility, and NPK Radar matrix."""
    return {"radar": SOIL_HEALTH_RADAR}
