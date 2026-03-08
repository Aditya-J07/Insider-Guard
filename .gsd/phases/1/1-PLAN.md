---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Setup SQLite and SQLAlchemy

## Objective
Introduce SQLAlchemy into the backend, create the local `soc_simulator.db` database engine, and define the Log ORM model matching the current data schema.

## Context
- .gsd/SPEC.md
- backend/database.py
- backend/requirements.txt (to be updated)

## Tasks

<task type="auto">
  <name>Install SQLAlchemy</name>
  <files>backend/requirements.txt</files>
  <action>
    - Add `sqlalchemy` to `backend/requirements.txt`.
    - Install it via `pip install sqlalchemy` in the terminal to ensure it is available.
  </action>
  <verify>python -c "import sqlalchemy; print(sqlalchemy.__version__)"</verify>
  <done>SQLAlchemy is successfully installed and available in the Python environment.</done>
</task>

<task type="auto">
  <name>Define Database Engine and Models</name>
  <files>backend/database.py</files>
  <action>
    - Preserve the `MockCollection` structure temporarily so nothing breaks yet.
    - Setup SQLAlchemy:
      - `DATABASE_URL = "sqlite:///./soc_simulator.db"`
      - create `engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})`
      - Create `SessionLocal`
      - Create `Base = declarative_base()`
    - Create a `class LogEntry(Base):` with the following columns matching the existing Pydantic schema: `id (Integer, primary_key)`, `timestamp (String)`, `username (String)`, `hostname (String)`, `ip_address (String)`, `os (String)`, `action (String)`, `resource (String)`, `severity (String)`.
    - Call `Base.metadata.create_all(bind=engine)` to physically create the `.db` file on startup.
  </action>
  <verify>python -c "from backend.database import Base; print('DB setup successful')"</verify>
  <done>Running `python backend/database.py` creates a `soc_simulator.db` file in the backend directory without errors.</done>
</task>

## Success Criteria
- [ ] Requirements updated and installed.
- [ ] SQLAlchemy engine initialized.
- [ ] `LogEntry` model created.
- [ ] Database file generated on import.
