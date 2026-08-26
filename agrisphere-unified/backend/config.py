import os
from pathlib import Path

BACKEND_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = BACKEND_DIR.parent
DATA_DIR = BACKEND_DIR / "data"
SAMPLE_SATELLITE_DIR = DATA_DIR / "sample_satellite"

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
CORS_ORIGINS = ["*"]

# GeoSR config
DEFAULT_MODEL = "srcnn"
SCALE_FACTOR = 4
DEVICE = "cpu"  # auto or cpu / cuda
MC_SAMPLES = 5
DROPOUT_RATE = 0.2
