import os
import requests

print("=======================================")
print("[*] Initiating Demo Reset...")
try:
    print("[*] Clearing Backend Banned Users and Risk Scores...")
    response = requests.post("http://127.0.0.1:8000/reset", timeout=2)
    print("    ->", response.json().get("status", "Done"))
except Exception as e:
    print("[!] Could not connect to backend to clear bans. Is it running?")

print("[*] Unlocking SENSITIVE_DATA folder...")
os.system(r'attrib -r "SENSITIVE_DATA\*.*" /s /d')
os.system(r'attrib -r "SENSITIVE_DATA" /d')

print("[*] Emptying SENSITIVE_DATA folder...")
import shutil
for filename in os.listdir("SENSITIVE_DATA"):
    file_path = os.path.join("SENSITIVE_DATA", filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        pass

print("=======================================")
print("[*] Demo Environmental Reset Complete! You are unblocked.")
print("[*] You can safely modify files in SENSITIVE_DATA now.")
