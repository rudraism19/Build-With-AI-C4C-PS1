export interface JurisdictionScope {
  isUnrestricted: boolean;
  districtId?: string | null;
  stateId?: string | null;
  department?: string | null;
  role: string;
}

export interface PolicymakerOverviewResponse {
  total_citizen_requests: number;
  validated_requests: number;
  active_hotspots: number;
  high_priority_areas: number;
  top_sectors: Array<{ sector: string; count: number; demand_score: number }>;
  affected_population: number;
  infrastructure_gaps: {
    average_gap_score: number;
    most_affected_sector: string;
  };
  investment_overview: {
    total_allocated: number;
    total_spent: number;
    utilization_rate: number;
  };
  recent_trends: {
    trajectory: string;
    growth_rate: number;
  };
  recommendations: Array<{
    id: string;
    title: string;
    sector: string;
    affected_population: number;
    status: string;
  }>;
  jurisdiction: {
    scope: string;
    role: string;
  };
}
