import time
from urllib import response
import requests
import os
import getpass
import socket
import platform
import threading
import signal
import magic  # Ensure 'pip install python-magic-bin' (Windows) or 'python-magic' (Linux/Mac)
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# --- CONFIGURATION ---
MONITOR_PATH = "./SENSITIVE_DATA"
API_URL = "http://127.0.0.1:8000/receive-log"
HEARTBEAT_URL = "http://127.0.0.1:8000/heartbeat"

# --- AUTO-DETECTED DETAILS ---
CURRENT_USER = getpass.getuser()
HOSTNAME = socket.gethostname()
LOCAL_IP = socket.gethostbyname(HOSTNAME)
OS_SYSTEM = platform.system()

if not os.path.exists(MONITOR_PATH):
    os.makedirs(MONITOR_PATH)
    print(f"[*] Created monitoring folder: {MONITOR_PATH}")

def lockdown_sensitive_folder():
    print("[!!!] LOCKDOWN: Making SENSITIVE_DATA read-only")
    try:
        os.system(f'attrib +r "{MONITOR_PATH}\\*" /s /d')
    except Exception as e:
        print("Lockdown failed:", e)

def kill_suspicious_processes():
    suspicious = ["rclone", "ftp", "winscp"]
    for proc in suspicious:
        os.system(f"taskkill /F /IM {proc}.exe >nul 2>&1")



# --- DETECTION LOGIC ---
class InsiderHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            self.inspect_file(event.src_path, "File Created")

    def on_modified(self, event):
        if not event.is_directory:
            self.inspect_file(event.src_path, "File Modified")

    def on_deleted(self, event):
        if not event.is_directory:
            # NEW: Feeds the Mass Deletion (Ransomware) logic on the backend
            print(f"[!] ALERT: File Deletion Detected: {event.src_path}")
            self.send_log("CRITICAL: File Deleted (Potential Sabotage)", event.src_path, severity="High")

    def on_moved(self, event):
        if not event.is_directory:
            action = f"File Moved: {os.path.basename(event.src_path)} -> {os.path.basename(event.dest_path)}"
            self.inspect_file(event.dest_path, action)

    def inspect_file(self, file_path, action):
        """The 'Brain' of the agent: Detects Tampering, Encryption, and Decoy Traps."""
        severity = "Low"
        filename = os.path.basename(file_path).lower()
        
        try:
            # 1. HONEYTOKEN (DECOY) CHECK - Instant Block Trigger
            honeytokens = ["passwords", "credentials", "salary_list", "secret_key", "honeytoken"]
            if any(token in filename for token in honeytokens):
                action = "HONEYTOKEN_TRAP_TRIGGERED"
                severity = "Critical"
                # Fixed: Changed {log.username} to {CURRENT_USER}
                print(f"[!!!] TRAP TRIGGERED: {CURRENT_USER} touched decoy file {filename}")

            # 2. MAGIC BYTE CHECK (Encryption & Extension Tampering)
            mime = magic.from_file(file_path, mime=True)
            extension = os.path.splitext(file_path)[1].lower()
            
            # Detect GPG/PGP Encryption
            if "pgp" in mime or "encrypted" in mime or "gpg" in mime:
                action = "STAGING: Encrypted Data Detected (GPG/PGP)"
                severity = "Critical"
            
            # Detect Archives hidden as other extensions
            elif "zip" in mime or "archive" in mime:
                if extension not in ['.zip', '.rar', '.7z', '.tar', '.gz']:
                    action = "STAGING: Extension Mismatch (Hidden Archive)"
                    severity = "Critical"
            
            # 3. EXFILTRATION TOOL DETECTION
            if any(tool in file_path.lower() for tool in ["rclone", "ftp", ".conf"]):
                action = "STAGING: Exfiltration Tool Config Found"
                severity = "High"

        except Exception:
            pass # Handle files that are locked by other processes

        # 4. SENSITIVE KEYWORD CHECK
        if any(key in file_path.lower() for key in ["secret", "payroll", "finance", "database"]):
            if severity != "Critical": severity = "High"
        if severity == "Critical":
            kill_suspicious_processes()
        self.send_log(action, file_path, severity)

    def send_log(self, action, resource, severity="Low"):
        payload = {
            "username": CURRENT_USER,
            "hostname": HOSTNAME,
            "ip_address": LOCAL_IP,
            "os": OS_SYSTEM,
            "action": action,
            "resource": resource,
            "severity": severity
        }
        try:
            requests.post(API_URL, json=payload, timeout=2)
        except:
            pass
        response = requests.post(API_URL, json=payload, timeout=2)

        if response.json().get("status") == "BLOCKED":
            lockdown_sensitive_folder()

# --- BACKGROUND TASKS ---
def send_heartbeat():
    while True:
        try:
            requests.post(HEARTBEAT_URL, json={"hostname": HOSTNAME}, timeout=2)
        except:
            pass
        time.sleep(5)

def signal_handler(sig, frame):
    """Detects if the agent is being manually killed."""
    print("\n[!] Agent being terminated! Sending final alert...")
    try:
        requests.post(API_URL, json={
            "username": CURRENT_USER,
            "hostname": HOSTNAME,
            "action": "AGENT_TERMINATED_UNEXPECTEDLY",
            "resource": "SYSTEM_PROCESS",
            "ip_address": LOCAL_IP,
            "severity": "High"
        }, timeout=2)
    except:
        pass
    os._exit(0)

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    # 1. Bind Signals
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # 2. Start Heartbeat Thread
    heartbeat_thread = threading.Thread(target=send_heartbeat, daemon=True)
    heartbeat_thread.start()

    # 3. Start Observer
    event_handler = InsiderHandler()
    observer = Observer()
    observer.schedule(event_handler, MONITOR_PATH, recursive=True)
    
    print(f"[*] Agent started for user: {CURRENT_USER}")
    print(f"[*] Monitoring {MONITOR_PATH} for staging, tampering, and deletion...")
    
    observer.start()
    try:
        while True:
            time.sleep(1)
    except:
        observer.stop()
    observer.join()