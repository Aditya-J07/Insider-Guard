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

print("[*] Force-unlocking SENSITIVE_DATA folder...")
# Use multiple methods to ensure read-only is removed
os.system(r'attrib -r "SENSITIVE_DATA\*.*" /s /d 2>nul')
os.system(r'attrib -r "SENSITIVE_DATA" /d 2>nul')
os.system(r'icacls "SENSITIVE_DATA" /grant "%USERNAME%":(OI)(CI)F /T /Q 2>nul')

print("[*] Emptying SENSITIVE_DATA folder...")
import shutil
try:
    # Nuclear option: delete the entire folder and recreate it
    shutil.rmtree("SENSITIVE_DATA", ignore_errors=True)
    os.makedirs("SENSITIVE_DATA", exist_ok=True)
    print("    -> Folder cleared successfully.")
except Exception as e:
    # Fallback: try file by file
    for filename in os.listdir("SENSITIVE_DATA"):
        file_path = os.path.join("SENSITIVE_DATA", filename)
        try:
            os.chmod(file_path, 0o777)
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e2:
            print(f"    -> [!] Could not delete {filename}: {e2}")

print("[*] Purging SQLite Database History...")
db_path = os.path.join("backend", "soc_simulator.db")
try:
    if os.path.exists(db_path):
        os.remove(db_path)
        print("    -> Database purged successfully.")
    else:
        print("    -> No database file found (already clean).")
except Exception as e:
    print(f"    -> [!] Could not delete db: {e}")

print("=======================================")
print("[*] Demo Environmental Reset Complete! You are unblocked.")
print("[*] You can safely modify files in SENSITIVE_DATA now.")
