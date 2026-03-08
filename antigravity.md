# 🛸 Project Master Context: Insider Threat SOC Simulator

This document is the definitive technical guide for the **Insider Threat SOC Simulator**. It is designed to give any future AI agent or collaborator immediate, deep-level context on the system's architecture, security logic, and live demonstration strategy.

---

## 🎯 Project Overview & Problem Statement
Most cybersecurity solutions focus on **External Threats** (firewalls, antivirus). This project targets the **Insider Threat**—the disgruntled or malicious employee who already has keys to the building.

**The Solution:** An autonomous, behavior-based security system that monitors file-system events, analyzes them centrally using a risk-scoring engine, and physically responds to neutralize threats on the endpoint without human intervention.

---

## 🏗️ Technical Architecture (The 3 Pillars)

### 1. The Autonomous Endpoint Agent (`agent.py`)
*   **Role:** The silent sentry running on the employee's computer.
*   **Libraries:** `watchdog` (Kernel-level file events), `python-magic` (Binary file signature analysis).
*   **Logic:** It monitors the `SENSITIVE_DATA` folder. It detects creations, deletions, and modifications. Crucially, it performs a **Forensic Sweep** on every file to detect hidden archives or PGP encryption headers.
*   **Response:** If the backend sends a "BLOCKED" signal, the agent immediately executes `attrib +r` to lock the sensitive directory.

### 2. The SIEM Correlation Engine (`backend/main.py`)
*   **Role:** The "Brain" of the operation. Built with **FastAPI**.
*   **Persistence:** Uses an in-memory `MockCollection` (`database.py`) to ensure 100% portability without needing a local MongoDB.
*   **Risk Scoring Engine:** 
    *   `VELOCITY_THRESHOLD` (20): Detects rapid mass creation (data staging).
    *   `DELETE_THRESHOLD` (10): Detects mass deletion (sabotage/ransomware).
    *   **Geographic Intel:** Uses `ip-api.com` to penalize logins originating outside of India.
    *   **Honeytoken Logic:** Hardcoded tripwires for files like `passwords.txt`.

### 3. The Security Dashboard (`frontend/src/`)
*   **Role:** Real-time visibility for SOC analysts. Built with **React** and **Vite**.
*   **Design:** Custom-styled to mirror **Exabeam Advanced Analytics**, a multi-billion dollar enterprise security tool.
*   **Persistent View:** We modified the `/reset` logic so that while blocks are cleared for a new demo, the **historical logs stay visible** to maintain a professional "full" dashboard look.

---

## 🎮 The "Show, Don't Tell" Automation Suite
Located in `Demo_Automations/`, these `.bat` scripts allow for a seamless 3-minute hackathon presentation:

| Script Name | Practical Purpose |
| :--- | :--- |
| `START_PROJECT.bat` | One-click launch of Backend, Frontend, and Agent. |
| `0_RESET_DEMO.bat` | Clears bans/scores and wipes the folder (Runs 2x for reliability). |
| `1_Honeytoken_Trap.bat` | Drops a `passwords.txt` file (Instant Block). |
| `2_Create_Normal_Files.bat` | Creates 15 files (Normal baseline, no alert). |
| `3_Mass_Deletion.bat` | Deletes the 15 files (Triggers Sabotage velocity alert). |
| `4_Extension_Tampering.bat` | Creates a `.zip` renamed to `.txt` (Triggers Magic Byte alert). |
| `5_Exfiltration_Setup.bat` | Drops `rclone.conf` (Triggers Staging tool alert). |

---

## 📍 Essential Configurations for Troubleshooting
- **Backend URL:** `http://127.0.0.1:8000`
- **Frontend URL:** `http://localhost:5173`
- **Block Threshold:** 180 points (Total across all actions).
- **Agent Heartbeat:** Every 5 seconds. If missed for 15s, "SABOTAGE" alert is fired.

**Note to Future Assistants:** When updating the code, prioritize maintaining the **In-Memory database logic** (no external DBs) and the **Exabeam UI styling**, as these are the project's standout features for judges.
