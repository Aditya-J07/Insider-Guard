@echo off
color 0C
echo ==========================================
echo [*] INITIATING: Exfiltration Tool Setup
echo ==========================================
echo.
echo 1. Creating a configuration file for an upload tool (rclone.conf)...
echo [my_google_drive] > "..\SENSITIVE_DATA\rclone.conf"
echo token=xyz123 >> "..\SENSITIVE_DATA\rclone.conf"
echo.
echo [*] ATTACK COMPLETE!
echo [+] Look at the Dashboard for a High Severity "STAGING" alert.
echo [+] This proves the agent catches insiders *before* they upload data to the cloud.
echo [+] Notice the folder lockdown will also engage.
echo.
pause
