@echo off
color 0A
echo ==========================================
echo [*] INITIATING: Normal Employee Work (Baseline)
echo ==========================================
echo.
echo 1. Creating 15 normal text files in SENSITIVE_DATA...
for /L %%i in (1,1,15) do (
    echo Normal work data > "..\SENSITIVE_DATA\work_document_%%i.txt"
)
echo.
echo [*] FILES CREATED!
echo [+] Look at the React Dashboard. 
echo [+] You will see standard 'File Created' logs.
echo [+] Notice your Risk Score did NOT go up because this is normal behavior.
echo.
pause
