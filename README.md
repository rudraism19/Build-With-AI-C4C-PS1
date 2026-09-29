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

## 🌐 Production Deployment Guide

JanSetu AI is designed with a modern microservice architecture:
1. **Frontend SPA**: React 18 + Vite + Tailwind CSS
2. **API Gateway**: NestJS Node.js server
3. **AI Microservice**: FastAPI Python 3.12 (Google Gemini + Sarvam AI)
4. **Database & Auth**: Supabase PostgreSQL + PostGIS (Cloud hosted)

---

### 🚀 Option 1: Managed Cloud Deployment (Vercel + Render + Supabase)

#### 1. Database & Authentication Setup (Supabase)
Your Supabase instance is already live. For production domain redirects:
1. Go to **Supabase Dashboard** $\rightarrow$ **Authentication** $\rightarrow$ **URL Configuration**.
2. Set **Site URL** to your deployed frontend domain (e.g., `https://jansetu.vercel.app`).
3. Under **Redirect URLs**, add:
   - `https://<your-frontend-domain>/auth/callback`
   - `http://localhost:5173` (for local development)

#### 2. Deploy AI Microservice (Render Web Service)
1. Go to [Render.com](https://render.com) $\rightarrow$ **New Web Service**.
2. Connect repository `https://github.com/rudraism19/Build-With-AI-C4C-PS1`.
3. Configure settings:
   - **Root Directory**: `backend/ai-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
   - `ENVIRONMENT`: `production`
   - `GEMINI_API_KEY`: *(Your Google AI Studio API key)*
   - `SARVAM_API_KEY`: *(Your Sarvam AI key)*
   - `CORS_ORIGINS`: `*`
5. Note the deployed URL (e.g. `https://jansetu-ai-service.onrender.com`).

#### 3. Deploy API Gateway (Render Web Service)
1. In Render $\rightarrow$ **New Web Service**.
2. Connect the same repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/main.js`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (or leave default $PORT)
   - `SUPABASE_URL`: `https://lrrwhqoeopwiwjthlpdb.supabase.co`
   - `SUPABASE_ANON_KEY`: *(Your Supabase Anon Key)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Your Supabase Service Role Key)*
   - `AI_SERVICE_URL`: `https://jansetu-ai-service.onrender.com`
   - `CORS_ORIGIN`: `*` (or your frontend Vercel URL)
5. Note the deployed URL (e.g. `https://jansetu-backend.onrender.com`).

#### 4. Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) $\rightarrow$ **Add New Project**.
2. Import `Build-With-AI-C4C-PS1`.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_SUPABASE_URL`: `https://lrrwhqoeopwiwjthlpdb.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `VITE_API_BASE_URL`: `https://jansetu-backend.onrender.com/api/v1`
   - `VITE_AI_SERVICE_URL`: `https://jansetu-ai-service.onrender.com/api/v1`
5. Deploy! Vercel automatically applies SPA rewriting using `frontend/vercel.json`.

---

### ⚡ Option 2: 1-Click Render Blueprint (`render.yaml`)

This repository includes a `render.yaml` blueprint. To deploy everything on Render in one step:
1. Log in to **Render.com**.
2. Click **Blueprints** $\rightarrow$ **New Blueprint Instance**.
3. Select this repository.
4. Fill in secret variables (`GEMINI_API_KEY`, `SARVAM_API_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
5. Render automatically deploys all three services with proper internal networking!

---

### 🐳 Option 3: Docker & Docker Compose (Self-Hosted / VPS)

Deploy to any Linux server (AWS EC2, GCP Compute Engine, DigitalOcean, Hetzner):

1. **Clone the repository on your server**:
   ```bash
   git clone https://github.com/rudraism19/Build-With-AI-C4C-PS1.git
   cd Build-With-AI-C4C-PS1
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your production API keys
   nano .env
   ```

3. **Start all services with Docker Compose**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify service health**:
   ```bash
   docker compose ps
   curl http://localhost/api/v1/health
   ```
   - Port `80`: React Frontend (served via Nginx with reverse proxy to backend & AI service)
   - Port `3000`: NestJS API Gateway
   - Port `8000`: FastAPI AI Microservice

---

## 🛡️ License

Built with ❤️ for **Build With AI — Code for Change Hackathon**.
