@echo off
echo ===================================================================
echo     Launching AgriSphere AI Unified Platform (SIH 2026)
echo ===================================================================
echo.

echo [1/2] Starting Python FastAPI Backend on http://localhost:8000 ...
start "AgriSphere Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting React + Vite Frontend on http://localhost:5173 ...
start "AgriSphere Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================================
echo   AgriSphere AI is running!
echo   - Web App UI:  http://localhost:5173
echo   - Backend API: http://localhost:8000/api/docs
echo ===================================================================
pause
