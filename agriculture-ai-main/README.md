# AgriTech AI - Crop Rotation & Soil Depletion Risk Predictor

Full-stack AI-driven soil intelligence and crop rotation advisory system for Indian farmers.

## Structure

- **frontend/**: React + Vite + Material-UI + i18next
- **backend/**: Node.js + Express + MongoDB + JWT Auth  
- **ml-service/**: Python Flask + scikit-learn ML predictions

## Quick Start

### Backend
```bash
cd backend
npm install
# Create .env from .env.example and configure MongoDB URI
npm start
```

### Frontend
```bash
cd frontend
npm install
# Create .env from .env.example
npm run dev
```

### ML Service
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python app.py
```

## Features

✅ JWT Authentication (register, login)
✅ Farm Management (CRUD operations)
✅ Soil Health Tracking (N, P, K, pH, organic carbon)
✅ ML-based Nutrient Depletion Prediction
✅ Crop Rotation Recommendations
✅ Economic Impact Analysis
✅ Risk Scoring (Low/Medium/High/Critical)
✅ Multilingual Support (English, Kannada, Hindi, Tamil, Telugu)
✅ Interactive Dashboard with Charts
✅ Mobile-Responsive UI

## API Endpoints

### Backend (Port 5000)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/farms
- POST /api/farms
- GET /api/crops

### ML Service (Port 5001)
- POST /predict/nutrient-depletion
- POST /recommend/rotation

## Tech Stack

- Frontend: React, Vite, Material-UI, Recharts, i18next, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- ML: Python, Flask, NumPy, Pandas, scikit-learn
- Database: MongoDB

## Next Steps

- Add OCR for Soil Health Cards (Tesseract.js)
- WhatsApp bot integration (Twilio)
- Advanced ML models with real training data
- Admin panel for crop database management
- PDF report generation
- Docker containerization
- Production deployment

## License

MIT
