export type UserRole = 'CITIZEN' | 'POLICYMAKER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  jurisdiction_area_id?: string;
}

export type ComplaintCategory =
  | 'WATER'
  | 'ROADS'
  | 'ELECTRICITY'
  | 'SANITATION'
  | 'HEALTH'
  | 'EDUCATION'
  | 'HOUSING'
  | 'OTHER';

export type ComplaintSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplaintStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'ANALYZING'
  | 'TRIAGED'
  | 'CLUSTERED'
  | 'DPR_PROPOSED'
  | 'RESOLVED';

export interface ComplaintLocation {
  latitude: number;
  longitude: number;
  address?: string;
  ward?: string;
  landmark?: string;
}

export interface Complaint {
  id: string;
  ticket_id?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  address?: string;
  ward?: string;
  voice_recording_url?: string;
  ai_status?: string;
  ai_category?: string;
  ai_severity?: string;
  ai_summary?: string;
  ai_confidence?: number;
  ai_entities?: Record<string, any>;
  ai_language?: string;
  hotspot_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  summary: string;
  keywords: string[];
  department: string;
  confidence: number;
  actionable_recommendation?: string;
}

export interface Hotspot {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
  complaint_count: number;
  primary_category: ComplaintCategory;
  severity_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  priority_score: number;
  status: string;
}
