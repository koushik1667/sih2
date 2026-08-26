# AgriTech AI - Quick Start Guide

## 🚀 Fastest Way to Run

### Option 1: One-Click Start (Windows)
```bash
cd C:\Users\Admin\agritech-ai
START.bat
```

### Option 2: Manual Start

**Step 1: Start MongoDB** (if not running)
```bash
# Ensure MongoDB is running on localhost:27017
```

**Step 2: Start Backend** (Terminal 1)
```bash
cd C:\Users\Admin\agritech-ai\backend
npm start
```
✅ Backend running on http://localhost:5000

**Step 3: Start ML Service** (Terminal 2)
```bash
cd C:\Users\Admin\agritech-ai\ml-service
venv\Scripts\activate
python app.py
```
✅ ML Service running on http://localhost:5001

**Step 4: Start Frontend** (Terminal 3)
```bash
cd C:\Users\Admin\agritech-ai\frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

**Step 5: Seed Database** (Terminal 4 - One time only)
```bash
cd C:\Users\Admin\agritech-ai\backend
node seedCrops.js
```
✅ Crop database seeded with 9 crops

---

## 🎯 Test the Application

### 1. Register a New Farmer
- Open http://localhost:5173
- Click "Register"
- Fill in:
  - Name: `Ramesh Kumar`
  - Phone: `9876543210`
  - Password: `password123`
  - State: `Karnataka`
  - District: `Bangalore Rural`
  - Village: `Devanahalli`
  - Language: `English` (or Kannada)
- Click "Register"

### 2. Add a Farm
- Dashboard → "View Farms" → "Add Farm"
- Fill in:
  - Land Size: `5` acres
  - Irrigation Type: `Drip`
  - Nitrogen (N): `150` kg/acre
  - Phosphorus (P): `15` kg/acre
  - Potassium (K): `100` kg/acre
  - pH Level: `6.5`
  - Organic Carbon: `1.5` %
- Click "Save Farm"

### 3. Analyze Soil Health
- Click "Analyze" on your farm card
- View:
  - ✅ Risk Score (Low/Medium/High/Critical)
  - 📊 Nutrient Depletion Chart (3 seasons projection)
  - 🌾 Crop Rotation Recommendations
  - 💰 Economic Loss Estimate
  - ⏱️ Soil Recovery Timeline

---

## 🔍 API Testing (Optional)

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Register (POST)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"phone\":\"1234567890\",\"password\":\"test\",\"district\":\"TestDist\",\"state\":\"TestState\",\"language\":\"en\"}"
```

### Test ML Service
```bash
# Health check
curl http://localhost:5001/health

# Nutrient prediction (POST)
curl -X POST http://localhost:5001/predict/nutrient-depletion \
  -H "Content-Type: application/json" \
  -d "{\"currentSoilHealth\":{\"N\":150,\"P\":15,\"K\":100},\"croppingHistory\":[{\"crop\":\"rice\",\"season\":\"Kharif2023\"}]}"
```

---

## 🌐 Multilingual Testing

Change language from the Register page or update user profile:
- **English** (en)
- **ಕನ್ನಡ** (kn) - Kannada
- **हिंदी** (hi) - Hindi  
- **தமிழ்** (ta) - Tamil
- **తెలుగు** (te) - Telugu

---

## 📊 Expected Results

### Soil Analysis Output Example:
```
Risk Score: Medium
Yield Decline Probability: 30%
Economic Loss: ₹15,000 per acre
Recovery Timeline: 9 months

Nutrient Depletion (3 seasons):
- Nitrogen: 150 → 124 → 98 → 72 kg/acre
- Phosphorus: 15 → 12 → 10 → 8 kg/acre
- Potassium: 100 → 85 → 70 → 55 kg/acre

Crop Rotation Recommendations:
1. Rabi Season: Chickpea - Legume crop will replenish nitrogen naturally
2. Kharif Season: Soybean - High nitrogen fixation
3. Zaid Season: Green Manure (Sunhemp) - Improves soil structure
```

---

## ⚠️ Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix**: Start MongoDB service
```bash
# Windows: Start MongoDB service from Services
# Or run: mongod --dbpath C:\data\db
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Fix**: Kill process using the port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Python venv Not Activated
```
Error: No module named 'flask'
```
**Fix**: Activate virtual environment
```bash
cd ml-service
venv\Scripts\activate
pip install -r requirements.txt
```

### React Dependencies Not Installed
```
Error: Cannot find module 'react-router-dom'
```
**Fix**: Install frontend dependencies
```bash
cd frontend
npm install
```

---

## 🎉 Success Checklist

- ✅ Backend running on port 5000
- ✅ ML service running on port 5001
- ✅ Frontend accessible at http://localhost:5173
- ✅ Can register a new user
- ✅ Can login successfully
- ✅ Can add a farm with soil data
- ✅ Can view soil analysis with charts
- ✅ Crop recommendations displayed
- ✅ Language switching works
- ✅ Charts render properly

---

## 📱 Demo Credentials (After Registration)

Create your own or use:
- Phone: `9876543210`
- Password: `farmer123`

---

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install-all

# Seed crop database
npm run seed

# Start individual services
npm run start-backend
npm run start-frontend
npm run start-ml
```

---

## 📞 Support

If you encounter issues:
1. Check all services are running
2. Verify MongoDB is accessible
3. Check browser console for frontend errors
4. Check terminal logs for backend/ML errors
5. Ensure all .env files are configured

---

**Ready to help Indian farmers combat mono-cropping! 🌾🇮🇳**
