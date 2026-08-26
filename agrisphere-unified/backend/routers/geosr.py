import os
from pathlib import Path
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
from PIL import Image
from config import SAMPLE_SATELLITE_DIR
from ml.inference import run_super_resolution, pil_to_base64

router = APIRouter(prefix="/api/geosr", tags=["GeoSR-AI Remote Sensing"])

PRESET_METADATA = [
    {
        "id": "punjab_wheat_belt",
        "title": "Punjab Wheat & Paddy Basin",
        "state": "Punjab (Ludhiana District)",
        "sensor": "Sentinel-2 MSI (10m Resolution)",
        "bands": "RGB (B4, B3, B2)",
        "description": "High-density cereal cropland showing geometric field boundaries, tube-well canals, and early vegetative growth."
    },
    {
        "id": "maharashtra_sugarcane",
        "title": "Western Maharashtra Sugarcane Belt",
        "state": "Maharashtra (Kolhapur/Sangli)",
        "sensor": "Landsat-8 OLI (15m Pan-sharpened)",
        "bands": "RGB + NIR proxy",
        "description": "Dense high-biomass cash crop plots along river Krishna with intense green canopy and irrigation channels."
    },
    {
        "id": "godavari_rice_paddy",
        "title": "Godavari Delta Paddy Terraces",
        "state": "Andhra Pradesh (East Godavari)",
        "sensor": "Sentinel-2 MSI (10m Resolution)",
        "bands": "RGB (B4, B3, B2)",
        "description": "Waterlogged rice paddies exhibiting specular water reflectance, bund boundaries, and varied growth stages."
    },
    {
        "id": "mp_soybean_plateau",
        "title": "Malwa Plateau Soybean & Gram",
        "state": "Madhya Pradesh (Ujjain District)",
        "sensor": "Sentinel-2 MSI (10m Resolution)",
        "bands": "RGB (B4, B3, B2)",
        "description": "Black cotton soil plateau with rainfed soybean plots, contour field edges, and dryland agro-ecosystem."
    }
]


@router.get("/presets")
def get_presets():
    """Returns available pre-loaded satellite test scenes."""
    results = []
    for p in PRESET_METADATA:
        file_path = SAMPLE_SATELLITE_DIR / f"{p['id']}.png"
        thumbnail = ""
        if file_path.exists():
            img = Image.open(file_path)
            thumbnail = pil_to_base64(img)
        
        results.append({
            **p,
            "thumbnail": thumbnail,
            "filename": f"{p['id']}.png"
        })
    return {"presets": results}


@router.get("/models")
def get_models():
    """Lists available super-resolution deep learning models."""
    return {
        "models": [
            {
                "id": "edsr",
                "name": "EDSR (Enhanced Deep Residual Network)",
                "description": "State-of-the-art residual network with removed batch normalization for superior spectral preservation.",
                "best_for": "Crisp field boundaries, sharp farm parcel detection, vegetation texture",
                "speed": "Fast (~120ms)"
            },
            {
                "id": "swinir",
                "name": "SwinIR (Swin Transformer for Remote Sensing)",
                "description": "Self-attention transformer architecture capturing long-range spatial correlations across multi-spectral bands.",
                "best_for": "Large gigapixel scenes, complex terrain, subtle NDVI gradients",
                "speed": "Balanced (~180ms)"
            },
            {
                "id": "srcnn",
                "name": "SRCNN (Super-Resolution CNN Baseline)",
                "description": "Classic 3-layer convolutional network for lightweight low-latency remote sensing upscaling.",
                "best_for": "Ultra-low power edge devices and quick previewing",
                "speed": "Ultra-Fast (~40ms)"
            }
        ],
        "supported_scale_factors": [2, 3, 4],
        "default_scale_factor": 4
    }


@router.post("/predict")
async def predict_super_resolution(
    file: Optional[UploadFile] = File(None),
    preset_id: Optional[str] = Form(None),
    model: str = Form("edsr"),
    scale_factor: int = Form(4)
):
    """
    Super-resolves satellite imagery and generates NDVI, NIR, Uncertainty, and metrics.
    Accepts uploaded file OR a preset scene ID.
    """
    pil_img = None

    if preset_id:
        preset_file = SAMPLE_SATELLITE_DIR / f"{preset_id}.png"
        if preset_file.exists():
            pil_img = Image.open(preset_file)
        else:
            raise HTTPException(status_code=404, detail=f"Preset {preset_id} not found.")
    elif file:
        try:
            contents = await file.read()
            import io
            pil_img = Image.open(io.BytesIO(contents))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image upload: {e}")
    else:
        # Default fallback to first preset
        default_file = SAMPLE_SATELLITE_DIR / "punjab_wheat_belt.png"
        if default_file.exists():
            pil_img = Image.open(default_file)
        else:
            raise HTTPException(status_code=400, detail="Please provide an image or preset_id.")

    try:
        result = run_super_resolution(
            pil_img=pil_img,
            model_name=model,
            scale_factor=scale_factor
        )
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")
