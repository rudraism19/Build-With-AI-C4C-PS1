# JanSetu AI (जनसेतु AI)
### Digital Public Infrastructure for Citizen Voice & Responsive Governance
**Build With AI — Code for Change (PS-1)**

---

## 📌 Executive Summary

**JanSetu AI** is a state-of-the-art Digital Public Infrastructure (DPI) platform designed to bridge the communication gap between citizens and municipal/district administrations. By leveraging multilingual speech recognition, natural language processing, spatial GIS analytics, and predictive AI, JanSetu AI empowers citizens to voice grievances in their native dialects while equipping administrators with predictive intelligence to preempt community escalations.

---

## ⚡ Live Services & Quick Reference

| Service | Port / URL | Description |
|---|---|---|
| **Frontend Portal** | `http://localhost:5173` | React 18 + Vite (Landing Page, Citizen & Officer Dashboards) |
| **API Gateway** | `http://localhost:3000` | NestJS REST API Gateway & Supabase Auth Guards |
| **AI Microservice** | `http://localhost:8000/docs` | FastAPI Swagger Docs, Gemini 2.0 & Speech Models |

---

## 🏛️ Platform Architecture & Key Portals

### 1. 🇮🇳 Citizen Portal
- **Multilingual Multimodal Filing**: File grievances via text, audio/voice recordings (Hindi, English, regional dialects), and photo uploads with automatic geocoding.
- **AI-Powered Triaging**: Automatic categorization, severity rating, sentiment analysis, and department assignment.
- **SLA & Status Tracker**: Real-time status transparency, tracking codes, and resolution workflows.
- **Dialect Voice Assistant**: Voice interaction supporting regional languages with speech-to-text and text-to-speech.

### 2. 🏛️ Policymaker & Administration Command Center
- **GIS Geospatial Heatmaps**: Real-time visualization of grievance clusters, ward-level density, and infrastructure pressure points across municipal zones.
- **Predictive AI Escalation Engine**: Early warnings for emerging public distress hotspots (water shortages, road damage, sanitation hazards).
- **Executive KPI Analytics**: Average resolution time, SLA compliance rates, citizen satisfaction scores, and officer accountability metrics.
- **Departmental Task Delegation**: Work orders, inter-departmental transfers, and resolution verification.

### 3. 🌐 Modern Landing Portal & Role-Based Access
- **Isolated Cadre Flow**: Landing Page $\rightarrow$ Role Authentication $\rightarrow$ Dedicated Cadre Dashboard.
- **Cadre Isolation**: Strict role segregation ensuring citizens and policymakers maintain separate, secure access spaces.
- **Supabase Google OAuth & Multi-Cadre Auth**: Production-ready Google OAuth 2.0 integrated via Supabase with automatic token validation, profile self-healing, plus 1-click evaluation profiles for Citizen (Ramesh Kumar) and District Magistrate Office.


---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Leaflet GIS |
| **API Gateway** | NestJS (Node.js / TypeScript), Express, REST APIs, WebSockets |
| **AI & NLP Microservice** | FastAPI (Python 3.12), Google Gemini 2.0 Flash / Pro, Sarvam AI, Whisper STT, gTTS |
| **Database & GIS** | PostgreSQL / SQLite, PostGIS geospatial queries, GeoJSON ward boundary models |
| **Authentication** | JWT, Role-Based Access Control (RBAC), Google OAuth 2.0 integration |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- Python (v3.10+ or v3.12+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/rudraism19/Build-With-AI-C4C-PS1.git
cd Build-With-AI-C4C-PS1
```

### 2. Run the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Access the web application at `http://localhost:5174` (or `http://localhost:5173`).

### 3. Run the API Gateway (NestJS)
```bash
cd backend
npm install
npm run build
npm run start
```
NestJS API Gateway runs at `http://localhost:3000`.

### 4. Run the AI Microservice (FastAPI + Python)
```bash
cd backend/ai-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```
FastAPI AI service runs at `http://localhost:8000`.

---

## 📂 Project Structure

```
jansetu-ai/
├── frontend/                  # React + TypeScript Vite frontend
│   ├── src/
│   │   ├── components/        # Dashboard, GIS map, grievance submission UI
│   │   ├── landing/           # Landing page components, Hero, Navigation, Google Auth
│   │   ├── context/           # AuthContext (Role isolation, Google OAuth)
│   │   └── types/             # TypeScript definitions
│   └── package.json
│
├── backend/                   # NestJS API Gateway & Database
│   ├── src/                   # Grievance controllers, services, auth modules
│   ├── database/              # SQL schemas, seed data & migrations
│   ├── ai-service/            # FastAPI AI service (Gemini + Voice processing)
│   │   ├── app/               # Routes, schemas, AI providers
│   │   └── requirements.txt
│   └── package.json
│
├── data/                      # Gwalior GIS boundaries & GeoJSON datasets
└── README.md
```

---

## 🛡️ License

Built with ❤️ for **Build With AI — Code for Change Hackathon**.
