export type AdminAreaType = 'STATE' | 'DISTRICT' | 'BLOCK' | 'VILLAGE' | 'WARD';

export interface AdministrativeAreaItem {
  id: string;
  name: string;
  code?: string;
  type: AdminAreaType;
  parent_id?: string;
}

export interface LocationResolutionResult {
  latitude: number;
  longitude: number;
  state: AdministrativeAreaItem | null;
  district: AdministrativeAreaItem | null;
  block: AdministrativeAreaItem | null;
  village: AdministrativeAreaItem | null;
  ward: AdministrativeAreaItem | null;
}

export interface NearbyComplaintItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
  created_at: string;
  ai_status?: string;
  ai_category?: string;
  ai_severity?: string;
  ai_summary?: string;
}

export interface ComplaintLocationResult {
  complaint_id: string;
  latitude: number | null;
  longitude: number | null;
}
