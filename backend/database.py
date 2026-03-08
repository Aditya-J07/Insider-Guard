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

# --- SQLAlchemy SQLite Setup ---
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./soc_simulator.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
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