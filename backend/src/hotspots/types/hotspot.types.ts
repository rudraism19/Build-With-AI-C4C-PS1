export interface HotspotItem {
  id: string;
  name: string;
  category: string;
  complaint_count: number;
  validated_complaint_count: number;
  affected_population: number;
  demand_score: number;
  severity_score: number;
  confidence: number;
  administrative_area_id: string | null;
  detected_at: string;
  status: string;
  metadata: Record<string, any>;
  latitude?: number;
  longitude?: number;
}

export interface GeoJsonGeometry {
  type: string;
  coordinates: any;
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: GeoJsonGeometry;
  properties: {
    id: string;
    name: string;
    category: string;
    complaint_count: number;
    validated_complaint_count: number;
    affected_population: number;
    demand_score: number;
    severity_score: number;
    status: string;
  };
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
  metadata: {
    total_hotspots: number;
    generated_at: string;
  };
}
