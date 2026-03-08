@echo off
color 0C
echo ==========================================
echo [*] INITIATING: Extension Tampering (Deep Forensic Scan)
echo ==========================================
echo.
echo 1. Creating a secret archive (stolen_data.zip)...
echo secret_data > temp_secret.txt
powershell -command "Compress-Archive -Path temp_secret.txt -DestinationPath temp_secret.zip -Force"
echo.
echo 2. Renaming the .zip to .txt to trick security scanners...
move /Y temp_secret.zip "..\SENSITIVE_DATA\stolen_data.txt" >nul
del temp_secret.txt
echo.
echo [*] ATTACK COMPLETE!
echo [+] Even though the file says '.txt', check the Dashboard!
echo [+] The agent read the Magic Bytes and detected the hidden archive!
echo [+] This triggers an automatic CRITICAL alert.
echo.
pause
