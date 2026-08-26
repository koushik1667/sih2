# 🌾 AgriSphere AI — Unified Agricultural Intelligence & Remote Sensing Platform

**AgriSphere AI** unites three major systems into a single enterprise-grade web application with a fresh, state-of-the-art UI/UX:

1. **🛰️ GeoSR-AI Remote Sensing Studio**: Deep learning satellite imagery super-resolution mapping (SRCNN, EDSR, SwinIR) for Sentinel-2 / Landsat scenes, interactive Before/After split comparison slider, NDVI crop health indices, False-color CIR NIR layers, and MC Dropout uncertainty maps.
2. **🌱 Precision Soil & NPK Depletion Simulator**: ICAR-calibrated soil health card scoring, 3-season NPK nutrient drawdown curves, yield loss risk grading, and AI-recommended restorative crop rotation sequences.
3. **📊 Bharat Agri-Analytics (Power BI Re-Engineered)**: Interactive business intelligence dashboard suite covering national crop production, top 10 districts and states, multi-year trends (2012–2024), farmer earnings and landholding benchmarks, monsoon rainfall vs yield regressions, and crop-wise soil health radar matrices with real-time slicers.
4. **🤖 Krishi Mitra (AI Agronomist)**: RAG conversational assistant offering scientific advisories in 5 Indian languages (English, Hindi, Kannada, Tamil, Telugu).
5. **🌦️ Agro-Weather Radar**: Live microclimate forecasting, 7-day outlook, chemical spraying window indicators, and extreme weather hazard alerts.

---

## 🚀 Quickstart Guide

### Option 1: One-Click Startup (Windows)
Double-click `run_app.bat` in this folder.

### Option 2: Manual Terminal Startup

#### 1. Start Python FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend API Documentation:* `http://localhost:8000/api/docs`

#### 2. Start React + Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
*Web Application:* `http://localhost:5173`

---

## 🏗️ Architecture

```
agrisphere-unified/
├── backend/
│   ├── main.py                     # FastAPI server with CORS & routes
│   ├── config.py                   # Platform constants & ML configuration
│   ├── routers/
│   │   ├── geosr.py                # Satellite Super-Resolution endpoints
│   │   ├── soil.py                 # Soil Health Scoring & NPK Depletion
│   │   ├── farms.py                # Farm profiles & soil cards CRUD
│   │   ├── analytics.py            # Power BI National Agriculture BI Engine
│   │   ├── chat.py                 # Krishi Mitra RAG AI Agronomist
│   │   └── weather.py              # Agro-Weather & Hazard alerts
│   ├── ml/
│   │   ├── models.py               # PyTorch SRCNN, EDSR, SwinIR models
│   │   ├── inference.py            # SRM Inference, NDVI & Quality Metrics
│   │   ├── soil_predictor.py       # ML Soil Health & Depletion Simulator
│   │   └── rag_engine.py           # Agronomy knowledge retrieval
│   └── data/
│       ├── indian_agri_data.py     # Cleaned Indian Agriculture dataset
│       ├── crops_data.py           # Multilingual crop database
│       └── sample_satellite/       # Preset satellite test scenes
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Master application layout
│   │   ├── context/
│   │   │   ├── AppContext.jsx      # Global state & farm selector
│   │   │   └── LanguageContext.jsx # 5 Indian languages dictionary
│   │   ├── components/
│   │   │   ├── Navigation.jsx      # Header, telemetry, language picker
│   │   │   ├── ImageSlider.jsx     # Before/After interactive comparison
│   │   │   └── MetricCard.jsx      # Glassmorphic KPI cards
│   │   └── pages/
│   │       ├── CommandCenter.jsx   # Executive overview
│   │       ├── SatelliteSRM.jsx    # GeoSR-AI Studio
│   │       ├── SoilPrecision.jsx   # Soil & 3-Season Depletion
│   │       ├── NationalAnalytics.jsx# Power BI Analytics Hub
│   │       ├── AIAgronomist.jsx    # Krishi Mitra RAG Chat
│   │       ├── FarmManagement.jsx  # Farm CRUD & fields
│   │       └── WeatherRadar.jsx    # Micro-climate & spraying alerts
└── run_app.bat                     # 1-click startup script
```
