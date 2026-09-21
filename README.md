# 🚀 Mayank Kanth — AI Portfolio & Engineering Copilot

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Groq](https://img.shields.io/badge/Groq-Cloud-F55036?style=flat)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An interactive, AI-driven portfolio web application showcasing the production achievements, microservices engineering, and autonomous agent architectures of **Mayank Kanth**.

Featuring a **real-time streaming AI Copilot** powered by Groq (`openai/gpt-oss-20b`) and an **instant Job Description Fit Matcher** that evaluates candidate fit in seconds with structured scorecards.

---

## 🌟 Key Highlights

* **🧠 Grounded AI Copilot (Zero Hallucination)**: Strictly bounded by Mayank's verified experience, production metrics, and architecture patterns. Features prompt-injection defense and polite refusal on unverified information.
* **⚡ Ultra-Low Latency Streaming**: Delivers instant token streaming over Server-Sent Events (SSE) via FastAPI and Groq Cloud (`openai/gpt-oss-20b`).
* **🎙️ Voice Input (STT) & Speech Output (TTS)**: Built-in Speech-to-Text microphone input and interactive Text-to-Speech response playback.
* **🌐 Multilingual Support (English & Hindi)**: Seamless 1-click language switch with fluent Devanagari Hindi or natural Hinglish AI answers.
* **💼 1-Click Job Description Matcher**: Evaluates candidate fit against arbitrary or preset job postings, returning match scores, skill alignments, growth areas, and tailored elevator pitches.
* **🎯 Executive "Why Hire?" Briefing**: 30-second executive summary pitch, verified production metrics, and core architectural pillars.
* **💡 Technical & Architectural Interview Prep**: Realistic question browser based on Mayank's engineering projects with model answer guidelines and 1-click Copilot test triggers.
* **🎨 Dual-Personality Design System**: Intentional theme shift between **Warm Editorial** in light mode and **Sharp Technical Terminal** in dark mode with zero layout shift.
* **📱 100% Mobile-Responsive**: Custom slide-in navigation drawer, responsive video player, and full-viewport bottom sheets for mobile recruiters.
* **📊 Production Track Record**:
  * **~28%** API Latency Reduction (Distributed Spring Boot microservices at Cognizant)
  * **~40%** SQL Query Optimization (Complex query tuning & composite indexes)
  * **~35%** MTTR Decrease (Distributed tracing with Splunk & Postman)
  * **99.9%** Production Uptime (Zero-downtime hotfixes & automated CI/CD)
  * **150+** LeetCode Problems Solved (Arrays, stacks, queues, linked lists, trees, DP)
  * **8.47** B.Tech CGPA in Computer Science & Engineering
* **🤖 Flagship Project Showcase (PetPuja)**: Autonomous dining agent separating probabilistic LLM reasoning from deterministic backend execution, with LangGraph Human-in-the-Loop (`interrupt()`), `MemorySaver` checkpointer, and self-healing multi-model fallback cascades.

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |            Client Browser             |
                                  |  - React 18 + Modern Glassmorphism    |
                                  |  - 1-Click Preset & Custom JD Inputs  |
                                  |  - Real-time ReadableStream SSE Reader|
                                  +-------------------+-------------------+
                                                      |
                                     Fetch / SSE      | HTTP POST (JSON)
                                                      v
                                  +---------------------------------------+
                                  |            FastAPI Backend            |
                                  |  - Sliding-Window Memory (10 turns)   |
                                  |  - Rate Limiter (slowapi per IP)      |
                                  |  - Hardened System Prompt Injection   |
                                  |  - Pydantic v2 Profile Schema Guard   |
                                  +-------------------+-------------------+
                                                      |
                                     Groq SDK         | JSON Mode / Streaming
                                                      v
                                  +---------------------------------------+
                                  |              Groq Cloud               |
                                  |        (openai/gpt-oss-20b)           |
                                  +---------------------------------------+
```

---

## 📁 Repository Structure

```text
aiportfolio/
├── backend/
│   ├── data/
│   │   └── profile.json         # Grounded candidate knowledge base
│   ├── agent.py                 # Groq inference client & streaming generators
│   ├── matcher.py               # Job description evaluation engine & sample JDs
│   ├── prompt.py                # Hardened anti-hallucination & jailbreak defense prompt
│   ├── schema.py                # Pydantic v2 candidate data models
│   └── main.py                  # FastAPI endpoints (/api/chat, /api/match-jd, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation, status indicator & resume download
│   │   │   ├── Hero.jsx         # Hero title, CTAs, and verified metrics grid
│   │   │   ├── ProjectsSection  # PetPuja, AI Mail Classifier & VEXURA cards
│   │   │   ├── ExperienceSection# Cognizant & Quy Tech career timeline
│   │   │   ├── SkillsSection.jsx# Competencies & tech stack tags
│   │   │   ├── ChatModal.jsx    # Real-time SSE streaming copilot
│   │   │   └── JDMatcherModal   # Structured job fit scorecard modal
│   │   ├── App.jsx              # Main application container
│   │   ├── App.css              # Bespoke modern dark theme styles
│   │   └── index.css            # Design tokens, typography & animations
│   ├── public/
│   │   └── Mayank_Resume__.pdf  # Direct verified resume download
│   ├── vercel.json              # Vercel deployment rewrite rules
│   └── vite.config.js           # Vite dev server & backend API proxy
├── test_phase1.py               # Automated unit & security test suite for AI Persona
├── test_phase2.py               # Automated integration tests for FastAPI & JD Matcher
├── render.yaml                  # 1-Click Render backend deployment blueprint
├── requirements.txt             # Production locked dependencies
├── pyproject.toml               # Python project configuration (uv managed)
└── README.md                    # Project documentation
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+ & npm
- A free [Groq API Key](https://console.groq.com/)

### 1. Backend Setup

```powershell
# Navigate to project directory
cd aiportfolio

# Create .env file
# Add:
# GROQ_API_KEY=your_groq_api_key_here
# GROQ_MODEL=openai/gpt-oss-20b

# Run automated tests
uv run python test_phase1.py
uv run python test_phase2.py

# Start backend server
uv run python main.py
# Backend runs at: http://localhost:8001 (API docs: http://localhost:8001/docs)
```

### 2. Frontend Setup

```powershell
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# Frontend runs at: http://localhost:5173
```

---

## 🌐 Deployment Guide

### Deploying the Backend (Render / Koyeb)
1. Push this repository to GitHub.
2. Link your repository in [Render](https://render.com/).
3. Render will automatically detect `render.yaml`:
   * Build command: `pip install -r requirements.txt`
   * Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set the environment variable in Render Dashboard:
   * `GROQ_API_KEY`: *[Your Secret Key]*

### Deploying the Frontend (Vercel)
1. In [Vercel](https://vercel.com/), import the repository and set the Root Directory to `frontend`.
2. Framework Preset: **Vite**.
3. In Project Settings -> Environment Variables, configure:
   * `VITE_API_BASE_URL`: URL of your deployed Render backend.
4. Click **Deploy**.

---

## 👨‍💻 Candidate Profile Summary

* **Candidate**: Mayank Kanth
* **Title**: Backend & Generative AI Engineer
* **Email**: [mayankkanth17@gmail.com](mailto:mayankkanth17@gmail.com)
* **LinkedIn**: [linkedin.com/in/mayank-kanth-jan03](https://www.linkedin.com/in/mayank-kanth-jan03/)
* **GitHub**: [github.com/KANTHmayank](https://github.com/KANTHmayank)
* **LeetCode**: [leetcode.com/u/_mayank_kanth_](https://leetcode.com/u/_mayank_kanth_/)

---

## 📜 License

Distributed under the MIT License.
