@echo off
color 0A
echo ==========================================
echo [*] INITIATING: Restoring Folder Access
echo ==========================================
echo.
cd ..

:: Removes the read-only attribute from all files and subfolders inside SENSITIVE_DATA
attrib -r "SENSITIVE_DATA\*" /s /d

:: Removes the read-only attribute from the SENSITIVE_DATA folder itself
attrib -r "SENSITIVE_DATA" /d

echo.
echo [*] ACCESS RESTORED! 
echo [+] The SENSITIVE_DATA folder is no longer read-only.
echo [+] No files have been deleted.
echo.
pause
