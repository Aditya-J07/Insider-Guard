---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Refactor Endpoints to use SQLite

## Objective
Update `backend/main.py` to write/read from the new SQLite database instead of utilizing the `MockCollection`.

## Context
- .gsd/SPEC.md
- backend/main.py
- backend/database.py

## Tasks

<task type="auto">
  <name>Wire Database Dependency</name>
  <files>backend/main.py</files>
  <action>
    - Import `SessionLocal` and `LogEntry` from `database.py`.
    - Create a FastAPI dependency `def get_db():` that yields a session and finally closes it.
  </action>
  <verify>grep "def get_db" backend/main.py</verify>
  <done>FastAPI db dependency logic is implemented.</done>
</task>

<task type="auto">
  <name>Refactor Route Logic</name>
  <files>backend/main.py, backend/database.py</files>
  <action>
    - In `@app.post("/receive-log")`, accept `db: Session = Depends(get_db)`. Remove the call to `db.logs.insert`. Instead, create a new `LogEntry` object using the incoming Pydantic `LogPayload`. Set the `timestamp` generated in python. `db.add(new_log); db.commit()`.
    - In `@app.get("/view-logs")`, accept `db: Session = Depends(get_db)`. Query all `LogEntry` records (`db.query(LogEntry).all()`) and return them.
    - You can now delete `class MockCollection:` and `class MockDatabase:` from `database.py` entirely, as they are obsolete.
  </action>
  <verify>pytest or curl post to verify endpoint integrity</verify>
  <done>Both API routes read and write to the SQLite database. The mock db is removed.</done>
</task>

## Success Criteria
- [ ] `/receive-log` writes directly to SQLite.
- [ ] `/view-logs` reads directly from SQLite.
- [ ] `MockDatabase` code is removed entirely to clean up technical debt.
