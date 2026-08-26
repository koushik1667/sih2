# GeoSR-AI: Satellite Imagery Super-Resolution & Processing Framework (SIH 2026)

GeoSR-AI is an end-to-end framework for super-resolving low-resolution multi-spectral satellite imagery (e.g., Sentinel-2, Landsat) to high resolution using deep learning architectures (SRCNN, EDSR, SwinIR) alongside geospatial analytics and FastAPI backend services.

---

## 🌟 Key Features

- **Deep Learning Architectures**:
  - **SRCNN** (Super-Resolution Convolutional Neural Network) baseline
  - **EDSR** (Enhanced Deep Residual Networks for Single Image Super-Resolution)
  - **SwinIR** (Image Restoration using Swin Transformer)
- **Geospatial Processing**:
  - Full GeoTIFF metadata & coordinate reference system (CRS) preservation
  - Multi-band raster support (RGB, NIR, RedEdge, etc.)
  - Cloud masking and atmospheric correction support
- **Tiled Inference Pipeline**:
  - Memory-efficient overlapped patch-based sliding window inference for gigapixel satellite scenes
  - Seamless edge blending with Gaussian / linear weighting
  - Uncertainty estimation (Monte Carlo Dropout / Ensemble variance maps)
- **Evaluation & Benchmarking Suite**:
  - PSNR, SSIM, RMSE, Spectral Angle Mapper (SAM), ERGAS metrics
- **FastAPI Production Backend**:
  - RESTful endpoints for tile uploading, real-time super-resolution, job tracking, and GeoTIFF downloads

---

## 📁 Repository Structure

```
.
├── backend/                  # FastAPI web server and ML inference service
│   ├── config.py             # Server & inference configuration
│   ├── main.py               # API route definitions
│   ├── ml_service.py         # Model loading and inference runner
│   ├── requirements.txt      # Backend dependencies
│   └── utils.py              # Geospatial & image utilities
├── GeoSR-AI/                 # Core research and deep learning models
│   ├── datasets/             # PyTorch dataset loaders & transforms
│   ├── evaluation/           # Metric implementations (PSNR, SSIM, SAM, ERGAS)
│   ├── geospatial/           # Raster loaders, GeoTIFF readers/writers
│   ├── inference/            # Tiled inference and predictor pipelines
│   ├── losses/               # Perceptual, spectral, and reconstruction loss functions
│   ├── models/               # SRCNN, EDSR, SwinIR model definitions
│   ├── notebooks/            # Jupyter training and experimentation workflows
│   ├── preprocessing/        # Tiling, cloud masking, and normalizations
│   ├── scripts/              # Training, inference, and evaluation scripts
│   ├── tests/                # Unit test suites
│   ├── training/             # Trainer loops and validation hooks
│   └── uncertainty/          # Uncertainty estimation modules
├── ml_dl_models/             # Research & development notebooks
├── test_integration.py       # End-to-end integration test suite
└── .gitignore                # Git ignore rules
```

---

## 🚀 Quickstart

### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/dwivediadarsh496-commits/SIH-2026.git
cd SIH-2026

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 2. Start the Backend API

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at `http://localhost:8000/docs`.

### 3. Run Integration Tests

```bash
python test_integration.py
```

---

## 📊 Metrics Supported

- **PSNR**: Peak Signal-to-Noise Ratio
- **SSIM**: Structural Similarity Index Measure
- **SAM**: Spectral Angle Mapper (measures spectral distortion across multi-band imagery)
- **ERGAS**: Relative Dimensionless Global Error in Synthesis
- **RMSE**: Root Mean Square Error

---

## 📜 License

This project is developed for the Smart India Hackathon (SIH) 2026.
