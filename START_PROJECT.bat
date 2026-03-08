@echo off
color 0A
echo ==========================================
echo [*] STARTING INSIDER THREAT SOC SIMULATOR
echo ==========================================
echo.

echo [*] Starting FastAPI Backend (Port 8000)...
start "Backend Server" cmd /k "cd backend && uvicorn main:app --reload"

echo [*] Starting React Frontend (Port 5173)...
start "Frontend Dashboard" cmd /k "cd frontend && npm run dev"

echo [*] Starting Python Endpoint Agent...
start "Python Agent" cmd /k "python agent.py"

echo.
echo [*] All components are launching in separate windows!
echo [*] Wait a few seconds, then open http://localhost:5173 in your browser.
echo.
pause
