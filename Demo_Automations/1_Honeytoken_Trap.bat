@echo off
color 0C
echo ==========================================
echo [*] INITIATING: Honeytoken Trap Attack
echo ==========================================
echo.
echo 1. Creating a decoy file named 'passwords.txt' inside SENSITIVE_DATA...
echo fake_admin_password_123 > "..\SENSITIVE_DATA\passwords.txt"
echo.
echo [*] ATTACK COMPLETE! 
echo [+] Look at the React Dashboard right now.
echo [+] Your Risk Score should be CRITICAL and you are BLOCKED.
echo [+] The 'SENSITIVE_DATA' folder is now locked (Read-Only).
echo.
pause
