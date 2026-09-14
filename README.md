# Agent 65: AI Student Helpdesk (VFSTR Vadlamudi)

An autonomous, multi-agent AI student helpdesk built for **Vignan's Foundation for Science, Technology and Research (VFSTR :: Vadlamudi)**. Grounded in official institutional bylaws, academic records, attendance percentages, timetable slots, exam schedules, and the **2026-27 Semester-I B.Tech Academic Calendar**.

---

## Key Features

- **22+1 Official Languages of India**: Full support for all 22 languages recognized under the 8th Schedule of the Constitution of India plus English, with real-time clickable dropdown and instant search filter.
- **Official VFSTR Academic Calendar (2026-27)**: Grounded in the official B.Tech 2nd (R25), 3rd (R22C24) & 4th (R22) Year academic calendar (Dated: 6/1/2026).
- **Interactive Voice Input**: Speech-to-text microphone with live visual waveform audio meter.
- **Dual Cognitive Model Selector**: Switch between **Low (3B Fast)** and **High (8B Deep Reasoning)** locally via Ollama.
- **Row-Level Security (RLS)**: Enforces student isolation via cryptographically signed JWT bearer tokens.
- **Offline / Zero-Cloud Architecture**: Runs 100% locally with zero external paid API keys.

---

## 🤖 AI Model & Ollama Setup (How the AI Works)

### Will it Work if the Other Person Doesn't Have Ollama Installed?
**YES! Absolutely.**

- **Automatic Dynamic Fallback**: When the backend receives a query, it dynamically checks if local Ollama daemon is active (`http://localhost:11434`).
- **If Ollama is NOT installed or NOT running**:
  - The backend **will NOT crash or error out**.
  - It automatically and gracefully falls back to **safe, deterministic, database-grounded reasoning**.
  - The student still receives exact, verified answers from the database (live attendance percentages, consecutive classes needed for 75% cutoff, timetable slots, room numbers, exam schedules, outstanding fees, circulars, and the academic calendar).
- **If Ollama IS installed and running**:
  - The application automatically connects to the local cognitive model (`agent65` / `llama3.2` / `llama3.1`).
  - Responses are generated with conversational depth, empathy, context awareness, and in any selected Indian script!

---

### How to Install & Run Ollama (For Full Generative AI Experience)

To experience the full conversational intelligence:

#### Step 1: Install Ollama
Download and install Ollama from [https://ollama.com/download](https://ollama.com/download) (available for Windows, macOS, and Linux).

#### Step 2: Pull the Models
Open any terminal and run:
```bash
# Model for Low (3B Fast) mode:
ollama pull llama3.2:3b

# Model for High (8B Deep Reasoning) mode:
ollama pull llama3.1:8b
```

#### Step 3: (Optional) Register Custom Agent 65 System Prompt
From the root of this project:
```bash
ollama create agent65 -f models/Modelfile.llama31
```

#### Step 4: Verify Ollama is Active
```bash
ollama list
```
*That is all! Once Ollama is running in the background, the FastAPI backend immediately detects it and routes queries through the local LLM.*

---

## Prerequisites

Ensure you have installed on your machine:
1. **Node.js** (v18.0.0 or higher) & **npm** (v9+)
2. **Python** (v3.10 or higher)
3. *(Optional)* **Ollama** (for local LLM inference — see guide above)

---

## Quick Start Guide

Clone the repository:
```bash
git clone <your-repository-url>
cd StudentHelpdesk
```

### 1. Start the Backend API (FastAPI)

Open Terminal 1:
```bash
cd BACKEND

# 1. Create a Python virtual environment
python -m venv .venv

# 2. Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (Command Prompt):
.venv\Scripts\activate.bat
# Linux / macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the Uvicorn server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend runs on: `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).*

---

### 2. Start the Frontend (Next.js)

Open Terminal 2:
```bash
cd FRONTEND

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```
*Frontend runs on: `http://localhost:3000`.*

---

## Demo Student Login Credentials

You can log in with any pre-seeded Section 7 student profile:

| Field | Primary Demo Credential | Alternative Credential |
| :--- | :--- | :--- |
| **Roll Number / Username** | `251FA04E13` | `24CSE001` |
| **Password** | `251FA04E13` (or `student123`) | `student123` |
| **Student Name** | Aman Kumar | Asha Reddy |
| **Branch & Section** | B.Tech CSE (Section 7) | B.Tech CSE (Section A) |

---

## Architecture & Functionality

The platform is designed around a decoupled, hybrid-cloud architecture:

1. **Frontend (Next.js / Vercel)**:
   - Built with Next.js, React, and Tailwind CSS.
   - Communicates with the backend REST API via `api-client.ts`.
   - Manages state using React Context (StudentContext, AgentChatContext, LanguageContext).
   - Deployed on **Vercel** or **Render** (`https://student-helpdesk-agent.onrender.com`).

2. **Backend API (FastAPI / Ngrok / Render)**:
   - A lightweight FastAPI server providing endpoints for Auth (`/api/v1/auth`), Conversations (`/api/v1/conversations`), and Health (`/api/v1/health`).
   - Uses **SQLite** for robust, relational data storage, secured via **Row-Level Security (RLS)** ensuring students only access their own data.
   - Deployed on **Render** or locally exposed via **Ngrok/Cloudflare Tunnels**.

3. **Cognitive NLU Engine & AI Cascade**:
   - The **Orchestrator** (`orchestrator.py`) manages the message flow.
   - The **NLU Engine** (`nlu_engine.py`) classifies intents (e.g., Attendance, Exams, Fees) and structures deterministic responses or queries the database.
   - **Local LLM Client** (`local_llm.py`): Attempts to use local **Ollama** first (Tier 1). If Ollama times out or the prompt is complex/multilingual, it gracefully falls back to Cloud APIs like **Gemini / Groq** (Tier 2). If all generative models fail, it falls back to a safe Database-grounded deterministic response (Tier 3).

---

## Project Structure

```
StudentHelpdesk/
├── BACKEND/                     # FastAPI backend
│   ├── app/
│   │   ├── agent/               # Cognitive NLU engine, Orchestrator, & Local LLM client
│   │   ├── api/                 # Auth, Conversations, Service Requests routes
│   │   ├── database.py          # In-memory & SQLite data repository with RLS
│   │   ├── models/schemas.py    # Pydantic request/response models
│   │   └── security.py          # Password verification & JWT authentication
│   └── requirements.txt         # Python dependencies
├── FRONTEND/                    # Next.js (React + Tailwind CSS) frontend
│   └── src/
│       ├── components/          # Header, Sidebar, AI Chat Panel, Calendar, Exams, Timetable
│       ├── context/             # StudentContext, AgentChatContext, LanguageContext
│       ├── lib/                 # api-client.ts, translations, auth logic
│       └── data/                # Static institutional data, Calendar, Exams
├── database/
│   └── student_helpdesk.db      # Pre-seeded SQLite database (70 students, marks, fees, timetable)
├── models/
│   └── Modelfile.llama31        # Ollama custom system prompt modelfile
├── .gitignore                   # Excludes node_modules, .venv, .next, local DBs
└── README.md                    # This guide
```

---

## License & Attribution

Developed for **Vignan's Foundation for Science, Technology and Research (VFSTR :: Vadlamudi)**.
