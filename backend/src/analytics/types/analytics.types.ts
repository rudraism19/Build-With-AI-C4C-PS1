export interface AreaMetadata {
  id: string;
  name: string;
  code: string;
  type: string;
  parent_id?: string | null;
}

export interface DemographicsDataSummary {
  population: number;
  male_population: number | null;
  female_population: number | null;
  households: number | null;
  population_density: number | null;
  literacy_rate: number | null;
  data_year: number | null;
  source: string | null;
}

export interface CitizenDemandSummary {
  total_complaints: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

export interface InfrastructureSummary {
  total_assets: number;
  avg_coverage: number | null;
  total_capacity: number | null;
  avg_condition_score: number | null;
  avg_access_score: number | null;
}

export interface InvestmentSummary {
  total_allocated: number;
  total_spent: number;
  project_count: number;
  completed_projects: number;
  ongoing_projects: number;
}

export interface AreaDataFusionResponse {
  area: AreaMetadata;
  sector: string;
  population?: number;
  complaint_count?: number;
  demographics: DemographicsDataSummary;
  citizen_demand: CitizenDemandSummary;
  infrastructure: InfrastructureSummary;
  investment: InvestmentSummary;
  fused_at: string;
}

export interface AreaDemandSummary {
  id: string;
  name: string;
  code: string;
  type: string;
  population: number;
  total_complaints: number;
  total_assets: number;
  total_allocated_investment: number;
  total_spent_investment: number;
}

export interface SectorAnalyticsBreakdown {
  sector: string;
  total_complaints: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  asset_count: number;
  allocated_amount: number;
  spent_amount: number;
}

export interface DemandAnalyticsResponse {
  area_id: string;
  population: number;
  total_complaints: number;
  validated_complaints: number;
  complaints_per_1000: number;
  severity_weighted_demand: number;
  demand_score: number;
  category_breakdown: Record<string, { count: number; validated: number; score: number }>;
  trend: {
    growth_rate: number;
    recent_14d_count: number;
    prior_14d_count: number;
    trajectory: 'RISING' | 'STABLE' | 'DECLINING';
  };
  data_quality: {
    validation_rate: number;
    geocoded_rate: number;
  };
}

export interface CategoryDemandSummary {
  category: string;
  total_complaints: number;
  validated_complaints: number;
  demand_score: number;
  critical_count: number;
  high_count: number;
}

export interface DemandTrendPoint {
  date: string;
  total: number;
  validated: number;
  critical: number;
}
