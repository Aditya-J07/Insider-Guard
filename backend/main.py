from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict, Optional, Set
import requests
import uuid
import asyncio
from database import log_helper, SessionLocal, LogEntry
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- DATA MODELS ---
class InsiderLog(BaseModel):
    username: str
    action: str
    resource: str
    ip_address: str
    hostname: str = "Unknown"
    severity: str = "Low"

# --- SYSTEM STATE ---
user_risk_scores: Dict[str, int] = {}
user_activity_window: Dict[str, dict] = {}
user_delete_window: Dict[str, dict] = {} 
agent_health: Dict[str, datetime] = {}
blocked_users: Set[str] = set()

# --- SETTINGS & CONFIG ---
VELOCITY_THRESHOLD = 20
DELETE_THRESHOLD = 10 
WINDOW_SECONDS = 60
BLOCK_THRESHOLD = 180 
SABOTAGE_TIMEOUT = 15 
ADMIN_USERS = ["admin", "root", "system_user", "mmddf"]

# --- LOGIC ENGINES ---

def get_geo_intel(ip):
    test_ip = ip if not ip.startswith("127.0.0.1") else "45.133.193.123"
    try:
        r = requests.get(f"http://ip-api.com/json/{test_ip}", timeout=2)
        data = r.json()
        return data if data['status'] == 'success' else {}
    except:
        return {}

def check_exfiltration_velocity(username):
    """Checks if a user is acting too fast (Bulk Creation/Modification)."""
    now = datetime.now()
    if username not in user_activity_window:
        user_activity_window[username] = {"count": 1, "last_reset": now}
        return False
    
    data = user_activity_window[username]
    if now - data["last_reset"] > timedelta(seconds=WINDOW_SECONDS):
        user_activity_window[username] = {"count": 1, "last_reset": now}
        return False
    else:
        data["count"] += 1
        return data["count"] >= VELOCITY_THRESHOLD

def check_deletion_velocity(username):
    """Detects rapid file deletions (Ransomware/Sabotage)."""
    now = datetime.now()
    if username not in user_delete_window:
        user_delete_window[username] = {"count": 1, "last_reset": now}
        return False
    
    data = user_delete_window[username]
    if now - data["last_reset"] > timedelta(seconds=WINDOW_SECONDS):
        user_delete_window[username] = {"count": 1, "last_reset": now}
        return False
    else:
        data["count"] += 1
        return data["count"] >= DELETE_THRESHOLD

# --- BACKGROUND TASKS ---

async def monitor_session_health():
    """Watchdog that detects when an agent goes offline (Sabotage)."""
    while True:
        now = datetime.now()
        for host, last_ping in list(agent_health.items()):
            # Removed obsolete session_collection SABOTAGE check for now as we transition to SQLite.
            # Future enhancement: Update SQLite to mark sessions as inactive instead.
            pass
        await asyncio.sleep(5)

# --- DB DEPENDENCY ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS ---
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(monitor_session_health())

@app.post("/receive-log")
async def receive_log(log: InsiderLog, db: Session = Depends(get_db)):
    # 1. IMMEDIATE BLOCK CHECK
    if log.username in blocked_users:
        return {"status": "BLOCKED", "message": "Security Lockdown Active"}

    # 2. HONEYTOKEN TRAP: Instant Block
    if log.action == "HONEYTOKEN_TRAP_TRIGGERED":
        blocked_users.add(log.username)
        print(f"\n[!!!] HONEYTOKEN TRIGGERED: {log.username} touched a decoy! BLOCKING...")
        
        trap_log = LogEntry(
            **log.dict(),
            risk_score=999,
            timestamp=datetime.now().isoformat(),
            status="BLOCKED"
        )
        db.add(trap_log)
        db.commit()
        return {"status": "BLOCKED", "reason": "Honeytoken Triggered"}

    # 3. Session Correlation (Simplified for SQLite iteration 1)
    session_id = str(uuid.uuid4())

    # 4. Intelligence & Behavioral Analysis
    geo = get_geo_intel(log.ip_address)
    is_bulk = check_exfiltration_velocity(log.username)
    is_mass_delete = check_deletion_velocity(log.username) if "Deleted" in log.action else False
    
    # Calculate Risk Points
    risk_added = 0
    if geo.get("country") != "India": risk_added += 50
    if any(key in log.resource.lower() for key in ["secret", "payroll", "finance"]): risk_added += 40
    if is_bulk: risk_added += 100
    if is_mass_delete: risk_added += 150 
    if "staging" in log.action.lower(): risk_added += 70
    if log.username.lower() in ADMIN_USERS: risk_added += 30
    if "SENSITIVE_DATA" in log.resource: risk_added += 10

    # 5. Risk Tally & Auto-Block
    user_risk_scores[log.username] = user_risk_scores.get(log.username, 0) + risk_added
    total_score = user_risk_scores[log.username]

    if total_score >= BLOCK_THRESHOLD:
        blocked_users.add(log.username)
        print(f"\n[!!!] SECURITY LOCKDOWN: {log.username} BLOCKED (Score: {total_score})")

    # 6. Save to Database
    new_log = LogEntry(
        **log.dict(),
        session_id=session_id,
        country=geo.get("country", "Unknown"),
        risk_score=total_score,
        timestamp=datetime.now().isoformat(),
        status="Notable" if total_score >= 80 else "Normal"
    )
    db.add(new_log)
    db.commit()
    
    return {"status": "Processed", "risk": total_score}

@app.post("/heartbeat")
async def heartbeat(data: dict):
    agent_health[data.get("hostname")] = datetime.now()
    return {"status": "Alive"}

@app.get("/agent-status")
def get_status():
    now = datetime.now()
    return {host: "ONLINE" if (now - last).total_seconds() < SABOTAGE_TIMEOUT else "OFFLINE" 
            for host, last in agent_health.items()}

@app.get("/view-logs")
async def view_logs(db: Session = Depends(get_db)):
    logs = db.query(LogEntry).order_by(LogEntry.timestamp.desc()).all()
    # Format the objects manually to match the frontend expectations
    return [{
        "id": log.id,
        "username": log.username,
        "action": log.action,
        "resource": log.resource,
        "ip_address": log.ip_address,
        "risk_score": log.risk_score,
        "timestamp": log.timestamp
    } for log in logs]

@app.post("/reset")
async def reset_demo():
    """Resets active block status and current risk scores but preserves historical logs for the dashboard."""
    blocked_users.clear()
    user_risk_scores.clear()
    user_activity_window.clear()
    user_delete_window.clear()
    # Note: SQLite DB is not explicitly dropped here, handled externally for demos.
    return {"status": "Reset Successful - Historical Logs Preserved"}