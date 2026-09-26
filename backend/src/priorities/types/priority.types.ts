export interface PriorityScoreFactors {
  demand: number;
  infrastructure_gap: number;
  population_impact: number;
  development_deficit: number;
  investment_gap: number;
}

export interface PriorityScoreItem {
  id: string;
  hotspot_id?: string;
  area_id?: string;
  category: string;
  priority_score: number;
  factors: PriorityScoreFactors;
  explanation: string[];
  rank_context?: Record<string, any>;
  calculation_version: string;
  created_at: string;
  hotspot_name?: string;
  area_name?: string;
}
