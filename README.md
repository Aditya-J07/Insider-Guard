# 🛸 Insider Threat SOC Simulator

## The Problem Statement

Traditional cybersecurity solutions, such as firewalls and antivirus software, focus heavily on **External Threats**. However, a significant and often devastating danger comes from within: **The Insider Threat**. 

A legitimate internal user—such as a disgruntled or malicious employee—already possesses the keys to the building and authorized access to sensitive organizational resources. This project focuses on detecting, investigating, and reporting these insider threat activities before data exfiltration or sabotage can occur.

## The Problem It Solves

This simulator provides an autonomous, behavior-based security system that bridges the gap between traditional perimeter defense and internal endpoint surveillance. 

### What can people use it for?
- **SOC Analyst Training & Demonstrations:** A fully functional, "Show, Dont Tell" environment for simulating insider attacks (e.g., data staging, exfiltration, sabotage) and demonstrating real-time SIEM (Security Information and Event Management) file event correlation.
- **Behavioral Analysis Research:** Experimenting with risk-scoring algorithms based on velocity thresholds, geographic intelligence, and internal forensic sweeps.
- **Endpoint Security Prototyping:** Testing autonomous response mechanisms, such as instantly locking down sensitive directories when malicious behavior is identified.

### How it makes existing tasks easier and safer:
- **Zero Human Intervention:** The autonomous endpoint agent automatically neutralizes threats on the endpoint (e.g., locking sensitive folders) the moment a critical risk score threshold is reached, reducing incident response time to zero.
- **Real-Time Visibility:** The React-based Security Dashboard provides immediate, enterprise-grade visibility into risk scores and threat logs, making it significantly easier for analysts to monitor networks without sifting through raw terminal logs.
- **Advanced Evasion Detection:** Instead of relying on obvious file extensions, the system performs **Forensic Sweeps** using binary file signatures to detect anomalies (like a hidden `.zip` archive maliciously renamed to `.txt`).
- **Instant Tripwires:** Supports **Honeytokens** (e.g., a dummy `passwords.txt`), acting as immediate traps that flag unauthorized access and safely stop attackers in their tracks.

## Objectives
- Detect abnormal user behavior (velocity of mass file creation / mass deletion).
- Monitor file access and privilege usage centrally.
- Detect evasion techniques and data staging mechanisms.

## System Architecture (The 3 Pillars)
1. **The Autonomous Endpoint Agent (`agent.py`):** The silent sentry running on endpoint machines. Monitors kernel-level file events and performs binary file signature analysis using `watchdog` and `python-magic`.
2. **The SIEM Correlation Engine (`backend/main.py`):** The FastAPI-based brain of the operation that utilizes an in-memory database and computes risk scores based on events.
3. **The Security Dashboard (`frontend/`):** A custom-styled React and Vite frontend designed to mirror professional enterprise security tools like Exabeam.

## Live Demo Automation
The project includes an automation suite located in `Demo_Automations/` for seamless hackathon presentations:
- run `START_PROJECT.bat` to launch the Backend, Frontend, and Agent simultaneously.
- Trigger specific attack scenarios like **Honeytoken Traps**, **Mass Deletion**, and **Extension Tampering** to demonstrate the simulator's real-time detection capabilities.

## Tech Stack
### Endpoint Agent
*   **Language:** Python
*   **Kernel Monitoring:** `watchdog` (File-system events)
*   **Signature Analysis:** `python-magic` (Binary file forensic sweeps)

### SIEM Correlation Engine (Backend)
*   **Framework:** FastAPI (Python)
*   **Database:** In-memory `MockCollection` (Persistent storage without requiring an external database like MongoDB, ensuring 100% portability)
*   **External Integration:** `ip-api.com` for geographic intelligence

### Security Dashboard (Frontend)
*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Custom Vanilla CSS tailored to mirror Exabeam Advanced Analytics and enterprise SIEM tools.

## Supported Platforms
The simulator features a distributed, cross-platform architecture:

### Security Dashboard (UI Viewers)
The analyst dashboard is a fully responsive web application, accessible globally from any modern browser on any operating system:
*   **Web Browsers:** Chrome, Safari, Firefox, Edge
*   **Desktop:** macOS, Windows, Linux
*   **Mobile & Tablet:** iOS (iPhone/iPad), Android

### Backend SIEM Engine
The Python FastAPI engine is entirely platform-agnostic. Being packaged securely in Python, it runs natively wherever Python 3 is installed:
*   **Platforms:** Windows, macOS, Linux, Docker containers, Cloud environments (AWS, Azure, GCP).

### Autonomous Endpoint Agent (Target Device)
The physical endpoint agent requires direct file-system access to monitor kernel-level changes.
*   **Primary Support:** **Windows** (The agent utilizes native Windows attributes like `attrib +r` to instantly neutralize threats and lock folders).
*   **Demo Automations:** Exclusively **Windows** (`.bat` files for zero-friction hackathon demos).
*   **Portability Scope:** The core logic using Python's `watchdog` can be ported to **macOS / Linux**, though current threat-neutralization mechanisms are optimized for Windows directories.