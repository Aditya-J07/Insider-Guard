# DEVLOG.md — Insider Threat SOC Simulator

> **Last Updated:** 2026-03-10

---

## 🔴 Bugs to Fix

### 1. Incidents Page — Not Working
- The `/incidents` page is broken or not displaying data correctly.
- **Status:** ❌ Not Fixed

### 2. Metrics Page — Not Working
- The `/metrics` page is broken or not displaying data correctly.
- **Status:** ❌ Not Fixed

### 3. Playbooks Page — Decide: Fix or Remove
- The `/playbooks` page was added as a placeholder.
- **Decision needed:** Either build it out properly or remove it entirely.
- **Status:** ❌ Pending Decision

### 4. SENSITIVE_DATA Folder — Read-Only Not Resetting
- After the agent triggers a lockdown (`attrib +r`), the reset script fails to reliably remove the read-only attribute.
- The folder stays stuck in read-only even after running `0_RESET_DEMO.bat`.
- **Status:** ❌ Not Fixed

---

## 🟡 Features to Add

### 5. Clear All Logs Button (Dashboard)
- There is currently no way to clear all logs from the dashboard UI.
- Need a button on the frontend that calls a backend endpoint to wipe the logs table.
- **Status:** ❌ Not Built

### 6. Supabase Connection — Make It Work
- The cloud database (Supabase) fails to connect due to a network DNS issue (`202.41.64.251` blocks the hostname).
- **Fix options:** Switch to mobile hotspot, change DNS to `8.8.8.8`, or test on a different network.
- **Status:** ❌ Blocked by Network

---

## 🔵 Research / Reference

### 7. Reference Teammate's Project
- Check the version of this project on a teammate's computer for reference.
- Compare implementations and pull in any improvements.
- **Status:** ❌ Pending

---

## ✅ Completed

- [x] Python + pip installed and added to PATH
- [x] All backend dependencies installed (`requirements.txt`)
- [x] `database.py` refactored for Supabase with SQLite fallback
- [x] `agent.py` crash fix (duplicate `requests.post` removed)
- [x] `START_PROJECT.bat` fixed (`python -m uvicorn`, `py` launcher)
- [x] `Playbooks.jsx` placeholder created
- [x] All `.bat` scripts updated to use `py` instead of `python`
- [x] `reset_demo.py` rewritten with nuclear folder reset approach
