import uuid
from datetime import datetime
import os

# Helper to format Database documents for the API
def log_helper(log) -> dict:
    return {
        "id": str(log.get("_id", uuid.uuid4())),
        "username": log.get("username"),
        "action": log.get("action"),
        "resource": log.get("resource"),
        "ip_address": log.get("ip_address"),
        "risk_score": log.get("risk_score"),
        "timestamp": log.get("timestamp")
    }

# --- SQLAlchemy Setup ---
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Load environment variables from .env file (if it exists)
load_dotenv()

# Fallback to local SQLite if no remote database URL is provided or connection fails
SUPABASE_URL = os.getenv("DATABASE_URL")
engine = None
SessionLocal = None

def get_engine(url):
    if "sqlite" in url:
        return create_engine(url, connect_args={"check_same_thread": False})
    return create_engine(url, pool_size=10, max_overflow=20)

if SUPABASE_URL:
    try:
        print(f"[*] Enterprise Mode: Testing connection to Supabase...")
        # Create a temporary engine to test the connection
        temp_engine = get_engine(SUPABASE_URL)
        with temp_engine.connect() as conn:
            pass # Connection successful
        engine = temp_engine
        print("[*] Connection Successful! Using Supabase PostgreSQL.")
    except Exception as e:
        print(f"[!] Enterprise Connection Failed: {e}")
        print("[*] Falling back to Local Mode (SQLite)...")
        SUPABASE_URL = None

if not SUPABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./soc_simulator.db"
    engine = get_engine(SQLALCHEMY_DATABASE_URL)
    print("[*] Local Mode Active: Using SQLite.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()

class LogEntry(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String)
    username = Column(String)
    hostname = Column(String)
    ip_address = Column(String)
    os = Column(String)
    action = Column(String)
    resource = Column(String)
    severity = Column(String)
    session_id = Column(String)
    country = Column(String)
    risk_score = Column(Integer)
    status = Column(String)

Base.metadata.create_all(bind=engine)