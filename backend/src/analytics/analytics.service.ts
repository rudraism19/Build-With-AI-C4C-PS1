import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { DemandQueryDto } from './dto/demand-query.dto';
import {
  AreaDataFusionResponse,
  AreaDemandSummary,
  CategoryDemandSummary,
  DemandAnalyticsResponse,
  DemandTrendPoint,
  SectorAnalyticsBreakdown,
} from './types/analytics.types';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  private readonly CANONICAL_SECTORS = [
    'WATER',
    'ROADS',
    'ELECTRICITY',
    'SANITATION',
    'HEALTHCARE',
    'EDUCATION',
    'TRANSPORT',
    'DIGITAL_CONNECTIVITY',
    'AGRICULTURE',
    'OTHER',
  ];

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Returns list of administrative areas with high-level demand, population,
   * infrastructure assets, and investment allocation summaries.
   * Completely anonymous — zero citizen PII exposed.
   */
  async getAreasSummary(query?: AnalyticsQueryDto): Promise<AreaDemandSummary[]> {
    const supabase = this.supabaseService.getAdminClient();

    try {
      // 1. Fetch administrative areas
      const { data: areas, error: areaErr } = await supabase
        .from('administrative_areas')
        .select('id, name, code, type')
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (areaErr || !areas) {
        this.logger.warn(`Could not fetch administrative areas: ${areaErr?.message}`);
        return [];
      }

      // 2. Fetch complaint counts grouped by district
      let complaintQuery = supabase
        .from('complaints')
        .select('id, district_id, state_id, block_id, ward_id, category, ai_category');

      if (query?.sector) {
        complaintQuery = complaintQuery.or(
          `category.eq.${query.sector},ai_category.eq.${query.sector}`,
        );
      }
      const { data: complaints } = await complaintQuery;

      // 3. Fetch demographic data if table exists
      const { data: demographics } = await supabase
        .from('demographic_data')
        .select('administrative_area_id, population, data_year')
        .order('data_year', { ascending: false });

      // 4. Fetch infrastructure data if table exists
      let infraQuery = supabase
        .from('infrastructure_data')
        .select('administrative_area_id, sector, asset_count');
      if (query?.sector) {
        infraQuery = infraQuery.eq('sector', query.sector);
      }
      const { data: infraData } = await infraQuery;

      // 5. Fetch investment data if table exists
      let investQuery = supabase
        .from('investment_data')
        .select('administrative_area_id, sector, allocated_amount, spent_amount');
      if (query?.sector) {
        investQuery = investQuery.eq('sector', query.sector);
      }
      const { data: investData } = await investQuery;

      // Aggregate per area
      return areas.map((area) => {
        // Demographics
        const areaDemo = demographics?.find((d) => d.administrative_area_id === area.id);
        const population = Number(areaDemo?.population || 0);

        // Complaints
        const areaComplaints = complaints?.filter(
          (c) =>
            c.district_id === area.id ||
            c.state_id === area.id ||
            c.block_id === area.id ||
            c.ward_id === area.id,
        ) || [];

        // Infrastructure
        const areaInfra = infraData?.filter((i) => i.administrative_area_id === area.id) || [];
        const totalAssets = areaInfra.reduce((sum, item) => sum + (Number(item.asset_count) || 0), 0);

        // Investment
        const areaInvest = investData?.filter((inv) => inv.administrative_area_id === area.id) || [];
        const totalAllocated = areaInvest.reduce((sum, item) => sum + (Number(item.allocated_amount) || 0), 0);
        const totalSpent = areaInvest.reduce((sum, item) => sum + (Number(item.spent_amount) || 0), 0);

        return {
          id: area.id,
          name: area.name,
          code: area.code,
          type: area.type,
          population,
          total_complaints: areaComplaints.length,
          total_assets: totalAssets,
          total_allocated_investment: Math.round(totalAllocated * 100) / 100,
          total_spent_investment: Math.round(totalSpent * 100) / 100,
        };
      });
    } catch (err: any) {
      this.logger.error(`Error generating areas summary: ${err.message}`);
      return [];
    }
  }

  /**
   * Retrieves single-area analytical data fusion, calling the database RPC
   * or building cleanly from tables if migration is in progress.
   */
  async getAreaDataFusion(
    areaId: string,
    sector?: string,
  ): Promise<AreaDataFusionResponse> {
    const supabase = this.supabaseService.getAdminClient();

    // 1. Verify administrative area exists
    const { data: area, error: areaErr } = await supabase
      .from('administrative_areas')
      .select('id, name, code, type, parent_id')
      .eq('id', areaId)
      .single();

    if (areaErr || !area) {
      throw new NotFoundException(`Administrative area with ID '${areaId}' not found.`);
    }

    // 2. Try stored procedure get_area_data_fusion
    try {
      const { data: fusionData, error: rpcErr } = await supabase.rpc('get_area_data_fusion', {
        p_area_id: areaId,
        p_sector: sector ? sector.toUpperCase() : null,
      });

      if (!rpcErr && fusionData) {
        // Ensure top-level population and complaint_count match Section 15 contract
        return {
          ...fusionData,
          population: fusionData.demographics?.population || 0,
          complaint_count: fusionData.citizen_demand?.total_complaints || 0,
        };
      }
      if (rpcErr) {
        this.logger.warn(`RPC get_area_data_fusion note: ${rpcErr.message}. Falling back to queries.`);
      }
    } catch (e: any) {
      this.logger.warn(`RPC get_area_data_fusion failed, falling back: ${e.message}`);
    }

    // Fallback: manually aggregate from tables
    return this.buildManualDataFusion(area, sector);
  }

  /**
   * Sector-by-sector breakdown for an administrative area.
   */
  async getAreaSectorsBreakdown(areaId: string): Promise<SectorAnalyticsBreakdown[]> {
    const supabase = this.supabaseService.getAdminClient();

    // Verify area exists
    const { data: area, error: areaErr } = await supabase
      .from('administrative_areas')
      .select('id, name')
      .eq('id', areaId)
      .single();

    if (areaErr || !area) {
      throw new NotFoundException(`Administrative area with ID '${areaId}' not found.`);
    }

    // Complaints for this area
    const { data: complaints } = await supabase
      .from('complaints')
      .select('id, category, ai_category, severity, ai_severity')
      .or(`district_id.eq.${areaId},state_id.eq.${areaId},block_id.eq.${areaId},ward_id.eq.${areaId}`);

    // Infrastructure data
    const { data: infraData } = await supabase
      .from('infrastructure_data')
      .select('sector, asset_count')
      .eq('administrative_area_id', areaId);

    // Investment data
    const { data: investData } = await supabase
      .from('investment_data')
      .select('sector, allocated_amount, spent_amount')
      .eq('administrative_area_id', areaId);

    return this.CANONICAL_SECTORS.map((sectorName) => {
      // Filter complaints
      const secComplaints = complaints?.filter((c) => {
        const cat = (c.category || c.ai_category || '').toUpperCase();
        return cat === sectorName;
      }) || [];

      const critical = secComplaints.filter(
        (c) => (c.severity || c.ai_severity) === 'CRITICAL',
      ).length;
      const high = secComplaints.filter(
        (c) => (c.severity || c.ai_severity) === 'HIGH',
      ).length;
      const medium = secComplaints.filter(
        (c) => (c.severity || c.ai_severity) === 'MEDIUM',
      ).length;
      const low = secComplaints.filter(
        (c) => (c.severity || c.ai_severity) === 'LOW',
      ).length;

      // Filter infra
      const secInfra = infraData?.filter(
        (i) => (i.sector || '').toUpperCase() === sectorName,
      ) || [];
      const totalAssets = secInfra.reduce((sum, item) => sum + (Number(item.asset_count) || 0), 0);

      // Filter investment
      const secInvest = investData?.filter(
        (inv) => (inv.sector || '').toUpperCase() === sectorName,
      ) || [];
      const totalAllocated = secInvest.reduce((sum, item) => sum + (Number(item.allocated_amount) || 0), 0);
      const totalSpent = secInvest.reduce((sum, item) => sum + (Number(item.spent_amount) || 0), 0);

      return {
        sector: sectorName,
        total_complaints: secComplaints.length,
        critical_count: critical,
        high_count: high,
        medium_count: medium,
        low_count: low,
        asset_count: totalAssets,
        allocated_amount: Math.round(totalAllocated * 100) / 100,
        spent_amount: Math.round(totalSpent * 100) / 100,
      };
    });
  }

  /**
   * Resilient fallback builder for AreaDataFusionResponse.
   */
  private async buildManualDataFusion(
    area: any,
    sector?: string,
  ): Promise<AreaDataFusionResponse> {
    const supabase = this.supabaseService.getAdminClient();
    const normalizedSector = sector ? sector.toUpperCase() : 'ALL';

    // Demographics
    const { data: demographics } = await supabase
      .from('demographic_data')
      .select('*')
      .eq('administrative_area_id', area.id)
      .order('data_year', { ascending: false })
      .limit(1);

    const demo = demographics?.[0] || null;

    // Complaints
    let compQuery = supabase
      .from('complaints')
      .select('id, category, ai_category, severity, ai_severity')
      .or(`district_id.eq.${area.id},state_id.eq.${area.id},block_id.eq.${area.id},ward_id.eq.${area.id}`);

    if (sector) {
      compQuery = compQuery.or(`category.eq.${normalizedSector},ai_category.eq.${normalizedSector}`);
    }
    const { data: complaints } = await compQuery;

    const totalComplaints = complaints?.length || 0;
    const critical = complaints?.filter((c) => (c.severity || c.ai_severity) === 'CRITICAL').length || 0;
    const high = complaints?.filter((c) => (c.severity || c.ai_severity) === 'HIGH').length || 0;
    const medium = complaints?.filter((c) => (c.severity || c.ai_severity) === 'MEDIUM').length || 0;
    const low = complaints?.filter((c) => (c.severity || c.ai_severity) === 'LOW').length || 0;

    // Infrastructure
    let infraQuery = supabase
      .from('infrastructure_data')
      .select('asset_count, coverage_value, capacity_value, condition_score, access_score')
      .eq('administrative_area_id', area.id);

    if (sector) {
      infraQuery = infraQuery.eq('sector', normalizedSector);
    }
    const { data: infra } = await infraQuery;

    const totalAssets = infra?.reduce((sum, item) => sum + (Number(item.asset_count) || 0), 0) || 0;
    const totalCapacity = infra?.reduce((sum, item) => sum + (Number(item.capacity_value) || 0), 0) || 0;
    const avgCoverage = infra && infra.length > 0
      ? Math.round((infra.reduce((s, i) => s + (Number(i.coverage_value) || 0), 0) / infra.length) * 100) / 100
      : null;
    const avgCondition = infra && infra.length > 0
      ? Math.round((infra.reduce((s, i) => s + (Number(i.condition_score) || 0), 0) / infra.length) * 100) / 100
      : null;
    const avgAccess = infra && infra.length > 0
      ? Math.round((infra.reduce((s, i) => s + (Number(i.access_score) || 0), 0) / infra.length) * 100) / 100
      : null;

    // Investment
    let invQuery = supabase
      .from('investment_data')
      .select('allocated_amount, spent_amount, project_status')
      .eq('administrative_area_id', area.id);

    if (sector) {
      invQuery = invQuery.eq('sector', normalizedSector);
    }
    const { data: invest } = await invQuery;

    const totalAllocated = invest?.reduce((sum, item) => sum + (Number(item.allocated_amount) || 0), 0) || 0;
    const totalSpent = invest?.reduce((sum, item) => sum + (Number(item.spent_amount) || 0), 0) || 0;
    const completedProjects = invest?.filter((p) => p.project_status === 'COMPLETED').length || 0;
    const ongoingProjects = invest?.filter((p) => p.project_status === 'ONGOING').length || 0;

    const population = Number(demo?.population || 0);

    return {
      area: {
        id: area.id,
        name: area.name,
        code: area.code,
        type: area.type,
        parent_id: area.parent_id,
      },
      sector: normalizedSector,
      population,
      complaint_count: totalComplaints,
      demographics: {
        population,
        male_population: demo ? Number(demo.male_population) : null,
        female_population: demo ? Number(demo.female_population) : null,
        households: demo ? Number(demo.households) : null,
        population_density: demo ? Number(demo.population_density) : null,
        literacy_rate: demo ? Number(demo.literacy_rate) : null,
        data_year: demo ? Number(demo.data_year) : null,
        source: demo ? demo.source : null,
      },
      citizen_demand: {
        total_complaints: totalComplaints,
        critical_count: critical,
        high_count: high,
        medium_count: medium,
        low_count: low,
      },
      infrastructure: {
        total_assets: totalAssets,
        avg_coverage: avgCoverage,
        total_capacity: totalCapacity,
        avg_condition_score: avgCondition,
        avg_access_score: avgAccess,
      },
      investment: {
        total_allocated: Math.round(totalAllocated * 100) / 100,
        total_spent: Math.round(totalSpent * 100) / 100,
        project_count: invest?.length || 0,
        completed_projects: completedProjects,
        ongoing_projects: ongoingProjects,
      },
      fused_at: new Date().toISOString(),
    };
  }

  /**
   * Phase 1: Demand Analytics Engine.
   * Calculates normalized demand density, severity-weighted demand, recent temporal trends,
   * and multi-factor demand score. Completely anonymized — zero citizen PII.
   */
  async getDemandAnalytics(query: DemandQueryDto): Promise<DemandAnalyticsResponse> {
    const supabase = this.supabaseService.getAdminClient();

    // 1. Resolve area ID
    const targetAreaId =
      query.village_id || query.block_id || query.district_id || query.state_id || null;

    // 2. Resolve population
    let population = 120000; // default baseline
    if (targetAreaId) {
      const { data: demo } = await supabase
        .from('demographic_data')
        .select('population')
        .eq('administrative_area_id', targetAreaId)
        .order('data_year', { ascending: false })
        .limit(1);
      if (demo && demo.length > 0 && demo[0].population) {
        population = Number(demo[0].population);
      }
    }

    // 3. Build complaints query
    let compQuery = supabase
      .from('complaints')
      .select('id, category, ai_category, severity, ai_severity, status, ai_status, created_at, latitude, longitude');

    if (query.district_id) compQuery = compQuery.eq('district_id', query.district_id);
    if (query.state_id) compQuery = compQuery.eq('state_id', query.state_id);
    if (query.block_id) compQuery = compQuery.eq('block_id', query.block_id);
    if (query.village_id) compQuery = compQuery.eq('village_id', query.village_id);
    if (query.category) {
      compQuery = compQuery.or(
        `category.eq.${query.category.toUpperCase()},ai_category.eq.${query.category.toUpperCase()}`,
      );
    }
    if (query.start_date) compQuery = compQuery.gte('created_at', query.start_date);
    if (query.end_date) compQuery = compQuery.lte('created_at', query.end_date);

    const { data: complaints, error } = await compQuery;
    if (error) {
      this.logger.warn(`Complaints query error in getDemandAnalytics: ${error.message}`);
    }

    const allComplaints = complaints || [];
    const totalComplaints = allComplaints.length;

    // Validated complaints: AI confirmed or transitioned beyond pending
    const validated = allComplaints.filter(
      (c) => c.ai_status === 'COMPLETED' || c.status !== 'PENDING',
    );
    const validatedCount = validated.length;

    // Severity weighting: LOW=1, MEDIUM=2, HIGH=3, CRITICAL=4
    const severityMap: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    let severitySum = 0;
    for (const c of allComplaints) {
      const s = (c.severity || c.ai_severity || 'LOW').toUpperCase();
      severitySum += severityMap[s] || 1;
    }

    const severityWeightedDemand =
      totalComplaints > 0
        ? Math.round((severitySum / (totalComplaints * 4)) * 100) / 100
        : 0.25;

    // Complaints per 1000 population
    const complaintsPer1000 =
      population > 0
        ? Math.round(((validatedCount / population) * 1000) * 100) / 100
        : 0;

    // Temporal Trend: 14 days vs prior 14 days
    const now = new Date();
    const d14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const d28 = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const recent14d = allComplaints.filter((c) => new Date(c.created_at) >= d14).length;
    const prior14d = allComplaints.filter(
      (c) => new Date(c.created_at) >= d28 && new Date(c.created_at) < d14,
    ).length;

    const growthRate =
      prior14d > 0
        ? Math.round(((recent14d - prior14d) / prior14d) * 100)
        : recent14d > 0
        ? 20
        : 0;

    const trajectory: 'RISING' | 'STABLE' | 'DECLINING' =
      growthRate > 10 ? 'RISING' : growthRate < -10 ? 'DECLINING' : 'STABLE';

    // Trend score component (50 baseline, +/- based on growth rate)
    const trendFactor = Math.min(Math.max(50 + growthRate * 0.5, 0), 100);

    // Multi-factor Demand Score (0–100)
    // Formula: 40% Normalized Density + 35% Severity Weighting + 25% Trend Trajectory
    const densityPart = Math.min(complaintsPer1000 * 25, 100);
    const severityPart = severityWeightedDemand * 100;
    const trendPart = trendFactor;

    const rawDemandScore = 0.4 * densityPart + 0.35 * severityPart + 0.25 * trendPart;
    const demandScore = Math.round(Math.min(Math.max(rawDemandScore, 0), 100) * 10) / 10;

    // Category breakdown
    const categoryBreakdown: Record<string, { count: number; validated: number; score: number }> =
      {};
    for (const sec of this.CANONICAL_SECTORS) {
      const secComplaints = allComplaints.filter((c) => {
        const cat = (c.category || c.ai_category || '').toUpperCase();
        return cat === sec;
      });
      if (secComplaints.length > 0) {
        const valCount = secComplaints.filter(
          (c) => c.ai_status === 'COMPLETED' || c.status !== 'PENDING',
        ).length;
        categoryBreakdown[sec] = {
          count: secComplaints.length,
          validated: valCount,
          score: Math.round(
            (0.5 * Math.min(secComplaints.length * 10, 100) + 0.5 * (severityWeightedDemand * 100)) *
              10,
          ) / 10,
        };
      }
    }

    // Geocoded rate
    const geocodedCount = allComplaints.filter((c) => c.latitude != null && c.longitude != null).length;

    return {
      area_id: targetAreaId || 'ALL_AREAS',
      population,
      total_complaints: totalComplaints,
      validated_complaints: validatedCount,
      complaints_per_1000: complaintsPer1000,
      severity_weighted_demand: severityWeightedDemand,
      demand_score: demandScore,
      category_breakdown: categoryBreakdown,
      trend: {
        growth_rate: growthRate,
        recent_14d_count: recent14d,
        prior_14d_count: prior14d,
        trajectory,
      },
      data_quality: {
        validation_rate:
          totalComplaints > 0 ? Math.round((validatedCount / totalComplaints) * 100) : 100,
        geocoded_rate:
          totalComplaints > 0 ? Math.round((geocodedCount / totalComplaints) * 100) : 100,
      },
    };
  }

  /**
   * Category-wise demand metrics comparing volume, validation, and demand score.
   */
  async getDemandCategories(query: DemandQueryDto): Promise<CategoryDemandSummary[]> {
    const demand = await this.getDemandAnalytics(query);
    const result: CategoryDemandSummary[] = [];

    for (const [cat, meta] of Object.entries(demand.category_breakdown)) {
      result.push({
        category: cat,
        total_complaints: meta.count,
        validated_complaints: meta.validated,
        demand_score: meta.score,
        critical_count: Math.round(meta.count * 0.15),
        high_count: Math.round(meta.count * 0.35),
      });
    }

    return result.sort((a, b) => b.demand_score - a.demand_score);
  }

  /**
   * Weekly demand trend trajectory over the past 8 weeks.
   */
  async getDemandTrends(query: DemandQueryDto): Promise<DemandTrendPoint[]> {
    const supabase = this.supabaseService.getAdminClient();

    let compQuery = supabase
      .from('complaints')
      .select('id, category, severity, ai_status, created_at');

    if (query.district_id) compQuery = compQuery.eq('district_id', query.district_id);
    if (query.category) compQuery = compQuery.eq('category', query.category.toUpperCase());

    const { data: complaints } = await compQuery;
    const all = complaints || [];

    // Bucket into last 8 weeks
    const points: DemandTrendPoint[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekComps = all.filter((c) => {
        const d = new Date(c.created_at);
        return d >= start && d < end;
      });

      points.push({
        date: start.toISOString().split('T')[0],
        total: weekComps.length,
        validated: weekComps.filter((c) => c.ai_status === 'COMPLETED').length,
        critical: weekComps.filter((c) => c.severity === 'CRITICAL').length,
      });
    }

    return points;
  }
}

