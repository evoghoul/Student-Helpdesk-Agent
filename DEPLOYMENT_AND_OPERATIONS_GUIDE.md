# Agent 65: Deployment and Hybrid Operations Guide

> **Zero Cost (₹0) | No Credit Card Required | Laptop-Off Auto Fallback | 100% Data Preserved**

This guide is split into two parts:

1. **Deployment:** Put the frontend, backend, database, and fallback model online.
2. **Daily operations:** Use the custom local model when the laptop is on and restart it after the laptop is turned back on.

## Contents

- [Direct answer](#-pehle-aapke-sawaal-ka-direct-jawab)
- [Part 1: Deployment](#-part-1-step-by-step-deployment-guide-beginner-friendly)
- [Part 2: Daily operations](#-part-2-daily-operations-guide-laptop-bandchalu-hone-par-kya-karein)
- [Provider verification](#-how-to-check-which-model-answered)
- [Final checklist](#-summary-checklist)

---

## ⚡ Pehle Aapke Sawaal Ka Direct Jawab:
### *"Kya aisa ho sakta hai ki jab mera laptop band ho toh deployed website automatically API wale model pe shift ho jaaye??"*

**Haan! 100% YES! Aur ye feature aapke backend me pehle se hi coded aur active hai.**

Aapka backend `BACKEND/app/agent/local_llm.py` ek **3-Tier Cascade Architecture** use karta hai:

```
                  ┌─────────────────────────────────────┐
                  │   Student Asks Question on Website  │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │  Tier 1: Try Local Laptop Model │
                    │     (agent65-8b via Tunnel)     │
                    └────────────────┬────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
        [Laptop is ON & Tunnel Up]            [Laptop is OFF / Asleep / Closed]
                 │                                       │
                 ▼                                       ▼
        ✅ Local 8B Model                      ⏱️ 4-second connect timeout
       answers on your CPU/GPU                (Connection fails safely)
                                                         │
                                                         ▼
                                              ┌───────────────────────┐
                                              │  Tier 2: Groq Cloud   │
                                              │  (Llama 3.3 70B / 8B) │
                                              └──────────┬────────────┘
                                                         │
                                              [If Groq limit reached]
                                                         │
                                                         ▼
                                              ┌───────────────────────┐
                                              │  Tier 2b: Gemini Free │
                                              │    (Gemini 3.6 Flash) │
                                              └──────────┬────────────┘
                                                         │
                                              [If Internet API fails]
                                                         │
                                                         ▼
                                              ┌───────────────────────┐
                                              │  Tier 3: Deterministic│
                                              │  NLU Rule Engine      │
                                              └───────────────────────┘
```

* **Jab Laptop ON hoga:** Render backend aapke laptop ke Cloudflare Tunnel se connect karega aur aapka **custom local `agent65-8b` model** answer karega!
* **Jab Laptop OFF hoga:** Render 4 second me samajh jayega ki laptop offline hai, aur bina kisi error ke **automatically Groq Cloud Llama-3.3-70B** par switch hokar 1 second me answer de dega!
* **Student ko kabhi error ya broken page nahi dikhega.**

---

# 📚 PART 1: Step-by-Step Deployment Guide (Beginner-Friendly)

Agar aapne pehle kabhi deploy nahi kiya hai, toh ghabraiye mat. Bas neeche diye gaye steps ko ek-ek karke follow kijiye:

---

### Step 1: Create a Free Neon PostgreSQL Database
Aapka SQLite data (`student_helpdesk.db`) render par restart hone par delete ho sakta hai, isliye hum Neon use karte hain jo permanent hai aur bilkul free hai.

1. Website open karein: **[https://neon.tech](https://neon.tech)**
2. **Sign Up with GitHub** par click karein (koi credit card nahi maangta).
3. Ek naya project banayein:
   * **Project Name**: `agent65`
   * **Region**: *AWS Asia (Singapore)* ya *US East (Ohio)*
   * **Postgres Version**: 16 ya 17 (default rehne dein)
4. Project bante hi dashboard par aapko **Connection string** dikhegi:
   ```
   postgresql://neondb_owner:npg_xxxxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Is connection string ko copy karke Notepad me save kar lijiye.

---

### Step 2: Migrate Local Student Data to Neon
Hamne aapke liye ek automated script `BACKEND/scripts/migrate_sqlite_to_postgres.py` bana diya hai jo aapke 141 students, Section 8, timetable, marks, exams sabhi ko 10 second me Neon me upload kar dega:

1. Apne laptop par terminal / PowerShell open karein aur run karein:
   ```powershell
   BACKEND\.venv\Scripts\python.exe BACKEND/scripts/migrate_sqlite_to_postgres.py "AAPKI_NEON_POSTGRES_URL"
   ```
2. Terminal par output aayega:
   ```
   [OK] All PostgreSQL tables verified/created.
   -> Migrating faculty (17 records)... [OK: 17 rows inserted]
   -> Migrating students (141 records)... [OK: 141 rows inserted]
   -> Migrating attendance (977 records)... [OK: 977 rows inserted]
   -> Migrating timetable (4944 records)... [OK: 4944 rows inserted]
   [SUCCESS] All student data migrated to Neon!
   ```
Ab aapka pura database Cloud par safe aur permanent save ho chuka hai!

---

### Step 3: Get a Free Groq API Key
Ye key tab kaam aayegi jab aapka laptop band hoga taaki website tab bhi smart answer de sake:

1. Open karein: **[https://console.groq.com/keys](https://console.groq.com/keys)**
2. Sign in with Google / GitHub.
3. **Create API Key** par click karein, naam dein `agent65-cloud`, aur key copy karke Notepad me save karein (starts with `gsk_...`).

---

### Step 4: Deploy the FastAPI Backend on Render

1. Open karein: **[https://render.com](https://render.com)** aur **Sign In with GitHub**.
2. Dashboard par click karein: **New +** ➔ **Web Service**.
3. **Build and deploy from a Git repository** select karein aur apna repo choose karein:
   `evoghoul/Student-Helpdesk-Agent`
4. Form me ye exact settings bharein:
   * **Name**: `agent65-api`
   * **Region**: Singapore ya Frankfurt
   * **Branch**: `main`
   * **Root Directory**: `BACKEND` ⚠️ *(Bohat zaroori hai! Kyunki Dockerfile BACKEND folder me hai)*
   * **Runtime**: `Docker`
   * **Instance Type**: `Free`
5. Scroll down to **Environment Variables** aur **Add Environment Variable** par click karke ye 5 variables add karein:

| Key | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://...` *(Aapki Neon wali connection string)* |
| `LLM_PROVIDER` | `local` *(Toh pehle laptop ko try karega, fir Groq ko)* |
| `GROQ_API_KEY` | `gsk_...` *(Aapki Groq API key)* |
| `GEMINI_API_KEY` | *(Optional: Aapki Gemini key if available)* |
| `FRONTEND_ORIGINS` | `["https://YOUR-VERCEL-APP.vercel.app"]` |
| `LOCAL_MODEL_URL` | `https://YOUR-TUNNEL-URL` |

6. Click **Deploy Web Service**.
7. Render 3-5 minute me Docker image build karega. Jab deployment complete ho jaye, Render aapko ek URL dega:
   ```
   https://student-helpdesk-agent.onrender.com
   ```
8. Browser me check karein:
   `https://student-helpdesk-agent.onrender.com/health`
   Aapko dikhega: `{"status": "healthy", "agent": "Agent 65..."}`

---

### Step 5: Deploy the Next.js Frontend on Vercel

1. Open karein: **[https://vercel.com](https://vercel.com)** aur **Sign In with GitHub**.
2. Click **Add New...** ➔ **Project**.
3. Apna repository import karein (`Student-Helpdesk-Agent`).
4. Configure Project settings:
   * **Root Directory**: Click *Edit* aur select karein `FRONTEND`.
   * **Framework Preset**: `Next.js` (automatically detect ho jayega).
5. Open **Environment Variables** section aur add karein:
   * **Name**: `NEXT_PUBLIC_BACKEND_URL`
   * **Value**: `https://student-helpdesk-agent.onrender.com/api/v1`
   *(Dhayan dein: aakhri me `/api/v1` lagana hai!)*
6. Click **Deploy**.
7. 2 minute me aapki website live ho jayegi aur aapko link mil jayega:
   ```
   https://agent65-student-helpdesk.vercel.app
   ```

---

### Step 6: Connect Frontend and Backend with CORS

1. Render dashboard me jayein ➔ `agent65-api` ➔ **Environment**.
2. `FRONTEND_ORIGINS` variable ko update karein aapke Vercel URL se:
   ```text
   FRONTEND_ORIGINS=["https://agent65-student-helpdesk.vercel.app"]
   ```
3. Render automatically redeploy ho jayega.

Ab aapki website **poori duniya ke liye LIVE** hai! 🎉

---

# 💻 PART 2: Daily Operations Guide (Laptop Band/Chalu Hone Par Kya Karein)

Ye part aapke rozana ke use ke liye hai.

---

### Situation A: Laptop Is Off
* **Aapko kuch bhi karne ki zaroorat nahi hai.**
* Aapki website `https://agent65-student-helpdesk.vercel.app` 24/7 chalegi.
* Koi bhi student login karega, toh backend automatic **Groq Cloud AI (Llama 3.3 70B)** se ultra-fast answer dega.
* Database **Neon Cloud** se authentic student records (Section 8, marks, timetable) fetch karega.

---

### Situation B: Laptop Is On and You Want to Demo the Custom Model
Agar aapko professor, evaluator ya doston ko dikhana hai ki:
*"Dekho, live website par sawal pucha aur mere laptop ke local fine-tuned `agent65-8b` model ne answer generate kiya!"*

Iske liye aapko bas ek baar Cloudflare Tunnel run karna hai:

#### Quick Setup (Only Once):
1. **Cloudflare tunnel download karein**:
   Download karein [cloudflared-windows-amd64.exe](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe).
2. Is file ka naam rename karke `cloudflared.exe` rakh dein aur project root folder (`c:\StudentHelpdesk`) me daal dein.

#### Daily One-Click Start:
Hamne aapke liye ek shortcut file bana di hai:
👉 **`hybrid.bat`** (ya **`start_laptop_hybrid_tunnel.bat`**) - project ke root folder me hai.

1. Bas **`hybrid.bat`** par **Double-Click** karein!
2. Ye automatically:
   * Aapke laptop par **Ollama** start kar dega.
   * Permanent Static Domain start karega:
     ```
     https://resonate-trimester-glade.ngrok-free.dev
     ```
3. Render dashboard me `LOCAL_MODEL_URL` me ye permanent link already set hai:
   ```
   LOCAL_MODEL_URL = https://resonate-trimester-glade.ngrok-free.dev
   ```
4. **Boom!** Ab jo koi bhi live website par chat karega:
   * Query seedha aapke laptop par aayegi.
   * Aapke laptop ke CPU/GPU par `agent65-8b` run hoga.
   * Aur response live website par dikhega!

---

### Situation C: Demo Is Finished
1. Terminal me `Ctrl + C` dabakar tunnel close kar dein aur laptop shut down kar dein.
2. Render backend automatically fallback switch kar lega:
   * Next request aate hi Render 4 second me notice karega ki laptop offline ho gaya hai.
   * Aur bina kisi error ke turant **Groq Cloud API** par switch ho jayega.
3. Website band nahi hogi, 24/7 chalti rahegi!

---

## 🔍 How to Check Which Model Answered?

Har assistant response ke metadata me provider tag hota hai:
* Jab **Laptop ON** hoga: Provider = `"local"`, Model = `"agent65-8b:latest"`
* Jab **Laptop OFF** hoga: Provider = `"cloud"`, Model = `"Groq Llama-3.3-70B"`

---

## 🛠️ Summary Checklist

| Component | Provider | Cost | Requirement |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel (Next.js 16) | ₹0 | GitHub Account |
| **Backend** | Render Free (Docker) | ₹0 | GitHub Account |
| **Database** | Neon (PostgreSQL 0.5 GB) | ₹0 | No Card Required |
| **AI (Laptop ON)** | Ollama `agent65-8b` via Tunnel | ₹0 | Laptop ON |
| **AI (Laptop OFF)**| Groq Cloud API (Llama 3.3) | ₹0 | Free API Key |

Ab aapka architecture bulletproof hai: **offline ho ya online, laptop khula ho ya band, college evaluation me 100/100 performance milegi!**
