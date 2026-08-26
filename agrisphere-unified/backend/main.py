import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).parent.resolve()
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from routers.geosr import router as geosr_router
from routers.soil import router as soil_router
from routers.farms import router as farms_router
from routers.analytics import router as analytics_router
from routers.chat import router as chat_router
from routers.weather import router as weather_router
from routers.translate import router as translate_router

app = FastAPI(
    title="AgriSphere AI Unified Backend",
    description=(
        "Unified Intelligent Agriculture Platform combining GeoSR-AI Satellite Super-Resolution Mapping, "
        "Precision Soil Intelligence, National Crop Analytics (Power BI Engine), AI Agronomist RAG Services, and Argos Machine Translation."
    ),
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all feature routers
app.include_router(geosr_router)
app.include_router(soil_router)
app.include_router(farms_router)
app.include_router(analytics_router)
app.include_router(chat_router)
app.include_router(weather_router)
app.include_router(translate_router)

@app.get("/api/health", tags=["System"])
def health_check():
    """System health check and component status."""
    import torch
    return {
        "status": "healthy",
        "service": "AgriSphere AI Unified Platform",
        "version": "2.0.0",
        "pytorch_device": "cuda" if torch.cuda.is_available() else "cpu",
        "modules": {
            "geosr_satellite_srm": "active",
            "soil_depletion_engine": "active",
            "national_powerbi_analytics": "active",
            "ai_agronomist_rag": "active",
            "weather_radar": "active"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
