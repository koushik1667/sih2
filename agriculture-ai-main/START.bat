@echo off
echo ========================================
echo AgriTech AI - Quick Start
echo ========================================
echo.
echo This script will start all services
echo.
echo Prerequisites:
echo - MongoDB must be running on localhost:27017
echo - Ensure ports 5000, 5001, 5173 are available
echo.
pause

echo Starting Backend Server...
start "AgriTech Backend" cmd /k "cd backend && npm start"
timeout /t 3

echo Starting ML Service...
start "AgriTech ML Service" cmd /k "cd ml-service && venv\Scripts\activate && python app.py"
timeout /t 3

echo Starting Frontend...
start "AgriTech Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2

echo.
echo ========================================
echo All services started!
echo ========================================
echo Backend:  http://localhost:5000
echo ML Service: http://localhost:5001
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to seed the crop database...
pause

echo Seeding crop database...
cd backend
node seedCrops.js
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo Open your browser and go to:
echo http://localhost:5173
echo.
echo To stop all services, close all terminal windows
echo ========================================
pause
