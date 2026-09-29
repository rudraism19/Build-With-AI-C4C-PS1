import axios from 'axios';
import { AIAnalysisResult, Complaint, ComplaintCategory, ComplaintSeverity } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');
const AI_API_BASE_URL = (import.meta.env.VITE_AI_SERVICE_URL || '/ai-api/api/v1').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const aiApi = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jansetu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.access_token) {
      localStorage.setItem('jansetu_token', res.data.access_token);
      localStorage.setItem('jansetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async signup(name: string, email: string, password: string) {
    const res = await api.post('/auth/signup', { name, email, password });
    return res.data;
  },

  async syncOAuthUser(token: string, role?: string) {
    try {
      const res = await api.post(
        '/auth/sync',
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.warn('Backend sync OAuth user note:', err);
      return null;
    }
  },

  logout() {
    localStorage.removeItem('jansetu_token');
    localStorage.removeItem('jansetu_user');
  },

  getCurrentUser() {
    const saved = localStorage.getItem('jansetu_user');
    return saved ? JSON.parse(saved) : null;
  },
};


export const complaintService = {
  // Submit new complaint to NestJS backend
  async submitComplaint(data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    severity?: ComplaintSeverity;
    latitude: number;
    longitude: number;
    address?: string;
    ward?: string;
    voice_recording_url?: string;
  }): Promise<Complaint> {
    // Append ward and address context to description to keep DTO strictly validated
    let enrichedDescription = data.description;
    const locationTags: string[] = [];
    if (data.ward) locationTags.push(`Ward: ${data.ward}`);
    if (data.address) locationTags.push(`Address: ${data.address}`);
    if (locationTags.length > 0 && !enrichedDescription.includes('[Location:')) {
      enrichedDescription = `${enrichedDescription}\n[Location: ${locationTags.join(', ')}]`;
    }

    const payload = {
      title: data.title,
      description: enrichedDescription,
      category: data.category,
      severity: data.severity || 'MEDIUM',
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const res = await api.post('/complaints', payload);
    return res.data;
  },

  // Fetch complaints of current citizen
  async getMyComplaints(): Promise<Complaint[]> {
    try {
      const res = await api.get('/complaints');
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // Fetch all complaints across municipality (policymaker demand stream)
  async getAllComplaints(): Promise<Complaint[]> {
    try {
      const res = await api.get('/complaints');
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // Fetch complaint details by ID
  async getComplaint(id: string): Promise<Complaint> {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  },
};

export const aiService = {
  // Transcribe voice recording using Sarvam AI
  async transcribeAudio(audioBlob: Blob): Promise<{ text: string; language: string }> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'grievance_voice.wav');

    const res = await aiApi.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Analyze complaint text using Google Gemini
  async analyzeText(text: string): Promise<AIAnalysisResult> {
    try {
      const res = await aiApi.post('/complaints/analyze', { text });
      return res.data;
    } catch {
      // Deterministic fallback if offline
      return {
        category: text.toLowerCase().includes('water') ? 'WATER' : 'OTHER',
        severity: 'MEDIUM',
        summary: text.slice(0, 100),
        keywords: ['civic', 'grievance'],
        department: 'Municipal Corporation',
        confidence: 0.85,
      };
    }
  },

  // Synthesize Hindi/Indian audio using Sarvam Bulbul model
  async speakText(text: string, languageCode: string = 'hi-IN'): Promise<string | null> {
    try {
      const res = await aiApi.post('/voice/speak', {
        text,
        language_code: languageCode,
        speaker: 'aditya',
      });
      return res.data?.audio_base64 || null;
    } catch {
      return null;
    }
  },
};

export const policymakerService = {
  async getOverview() {
    const res = await api.get('/policymaker/overview');
    return res.data;
  },

  async getMapData() {
    const res = await api.get('/policymaker/map');
    return res.data;
  },

  async getHotspots(query?: any) {
    const res = await api.get('/policymaker/hotspots', { params: query });
    return res.data;
  },

  async getPriorities(query?: any) {
    const res = await api.get('/policymaker/priorities', { params: query });
    return res.data;
  },

  async getRecommendations(query?: any) {
    const res = await api.get('/policymaker/recommendations', { params: query });
    return res.data;
  },

  async getProjects(query?: any) {
    const res = await api.get('/policymaker/projects', { params: query });
    return res.data;
  },

  async getAnalytics(query?: any) {
    const res = await api.get('/policymaker/analytics', { params: query });
    return res.data;
  },
};

export const policyService = {
  // List all ingested policy documents
  async getPolicies() {
    const res = await api.get('/policies');
    return res.data;
  },

  // Get single policy document by UUID
  async getPolicyById(id: string) {
    const res = await api.get(`/policies/${id}`);
    return res.data;
  },

  // Semantic vector search across pgvector policy knowledge base via NestJS proxy
  async searchPolicies(query: string, top_k: number = 4) {
    const res = await api.post('/policies/search', {
      query,
      top_k,
    });
    return res.data;
  },
};

export const recommendationService = {
  // List development recommendations
  async getRecommendations(sector?: string, status?: string) {
    const res = await api.get('/recommendations', {
      params: { sector, status },
    });
    return res.data;
  },

  // Get specific recommendation by UUID
  async getRecommendationById(id: string) {
    const res = await api.get(`/recommendations/${id}`);
    return res.data;
  },

  // Synthesize evidence-backed development proposal via Gemini RAG pipeline
  async generateRecommendation(data: {
    area_id: string;
    sector: string;
    hotspot_id?: string;
    priority_score_id?: string;
  }) {
    const res = await api.post('/recommendations/generate', data);
    return res.data;
  },
};

export const dataService = {
  // List registered government data sources
  async getDataSources() {
    const res = await api.get('/data/sources');
    return res.data;
  },

  // Get system-wide data quality & validation stats
  async getDataQuality() {
    const res = await api.get('/data/quality');
    return res.data;
  },
};

export default api;
