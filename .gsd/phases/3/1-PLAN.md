---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Testing and Automation Alignment

## Objective
Ensure the React dashboard reads the new integer `id` correctly without console errors, and update the `.bat` reset scripts to handle the SQLite `.db` file instead of relying completely on restarting the terminal.

## Context
- .gsd/SPEC.md
- frontend/src/pages/UserProfile.jsx
- Demo_Automations/Reset_Demo.bat
- reset_demo.py

## Tasks

<task type="auto">
  <name>Frontend Key Prop Fix</name>
  <files>frontend/src/pages/UserProfile.jsx</files>
  <action>
    - The SQLite database uses a primary key integer `id`. The `MockCollection` used random UUIDs as string IDs.
    - Check the React `map()` function rendering the table rows. Make sure `key={log.id}` handles integer ids without warnings.
    - Verify that sorting or mapping logic isn't trying to parse a UUID explicitly.
  </action>
  <verify>Check console logs in the Vite dev server for React key errors.</verify>
  <done>Frontend renders seamlessly without React warnings about unique keys in iterators.</done>
</task>

<task type="auto">
  <name>Update Demo Automations</name>
  <files>Reset_Demo.bat, reset_demo.py</files>
  <action>
    - `Reset_Demo.bat` currently calls `reset_demo.py`. 
    - `reset_demo.py` deletes `.txt` files in `SENSITIVE_DATA`.
    - We need to add logic to `reset_demo.py` (or directly in the `.bat`) to also delete the `backend/soc_simulator.db` file so the hackathon demo can start completely fresh.
    - `import os` in `reset_demo.py` and `os.remove("backend/soc_simulator.db")` wrapped in a `try/except` block.
  </action>
  <verify>Run Demo_Automations/Reset_Demo.bat and verify SENSITIVE_DATA is cleared and the .db file is deleted.</verify>
  <done>Both the backend database and the file system are effectively purged when resetting the project demo.</done>
</task>

## Success Criteria
- [ ] UI lists logs correctly with the new ID format.
- [ ] Database is successfully purged via `Reset_Demo.bat`.
