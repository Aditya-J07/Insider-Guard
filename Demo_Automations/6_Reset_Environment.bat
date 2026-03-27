@echo off
color 0B
echo ==========================================
echo [*] INITIATING: Environment Reset
echo ==========================================
echo.
cd ..
py reset_demo.py
py reset_demo.py >nul 2>&1
echo.
echo [*] RESET COMPLETE! 
echo [+] The dashboard is clear and the SENSITIVE_DATA folder is empty.
echo [+] You are now ready for your next demonstration!
echo.
pause
