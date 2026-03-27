@echo off
color 0A
echo ==========================================
echo [*] STARTING INSIDER THREAT SOC SIMULATOR
echo ==========================================
echo [*] Note: The backend will connect to Supabase (Enterprise Mode) 
echo [*]       if 'backend/.env' is configured. Otherwise, it defaults 
echo [*]       to a local SQLite file.
echo.

echo [*] Starting FastAPI Backend (Port 8000)...
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload"

echo [*] Starting React Frontend (Port 5173)...
start "Frontend Dashboard" cmd /k "cd frontend && npm run dev"

echo [*] Starting Python Endpoint Agent...
start "Python Agent" cmd /k "py agent.py"

echo.
echo [*] All components are launching in separate windows!
echo [*] Wait a few seconds, then open http://localhost:5173 in your browser.
echo.
pause
