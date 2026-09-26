import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import {
  AreaDataFusionResponse,
  AreaDemandSummary,
  SectorAnalyticsBreakdown,
} from './types/analytics.types';

@ApiTags('Analytics & Data Fusion')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('areas')
  @Roles(UserRole.POLICYMAKER, UserRole.CITIZEN)
  @ApiOperation({
    summary: 'List administrative areas with demand & development overview',
    description:
      'Returns all administrative areas with aggregated citizen complaints, population, infrastructure asset count, and public investment allocations. Fully anonymized with zero citizen PII.',
  })
  @ApiResponse({
    status: 200,
    description: 'Administrative areas overview retrieved successfully',
  })
  async getAreasSummary(
    @Query() query: AnalyticsQueryDto,
  ): Promise<AreaDemandSummary[]> {
    return this.analyticsService.getAreasSummary(query);
  }

  @Get('areas/:areaId')
  @Roles(UserRole.POLICYMAKER, UserRole.CITIZEN)
  @ApiOperation({
    summary: 'Get aggregated analytics for a specific administrative area',
    description:
      'Returns area demographic profile, total citizen complaints by severity, infrastructure assets, and public investment totals.',
  })
  @ApiParam({
    name: 'areaId',
    type: 'string',
    format: 'uuid',
    description: 'Administrative Area UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Area analytics retrieved successfully',
  })
  async getAreaAnalytics(
    @Param('areaId', ParseUUIDPipe) areaId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<AreaDataFusionResponse> {
    return this.analyticsService.getAreaDataFusion(areaId, query.sector);
  }

  @Get('areas/:areaId/sectors')
  @Roles(UserRole.POLICYMAKER, UserRole.CITIZEN)
  @ApiOperation({
    summary: 'Get sector-wise breakdown for an administrative area',
    description:
      'Returns development breakdown across all major civic sectors (WATER, ROADS, ELECTRICITY, HEALTHCARE, etc.) comparing citizen demand, infrastructure assets, and budget allocation/spending.',
  })
  @ApiParam({
    name: 'areaId',
    type: 'string',
    format: 'uuid',
    description: 'Administrative Area UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Sector breakdown retrieved successfully',
  })
  async getAreaSectorsBreakdown(
    @Param('areaId', ParseUUIDPipe) areaId: string,
  ): Promise<SectorAnalyticsBreakdown[]> {
    return this.analyticsService.getAreaSectorsBreakdown(areaId);
  }

  @Get('areas/:areaId/fusion')
  @Roles(UserRole.POLICYMAKER, UserRole.CITIZEN, UserRole.DISTRICT_OFFICER, UserRole.STATE_ADMIN, UserRole.DEPARTMENT_OFFICER, UserRole.ANALYST, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get complete Data Fusion contract for an administrative area',
    description:
      'Merges Demographics + Citizen Demand + Infrastructure Capacity + Public Investment into a normalized analytical model ready for policymaker decision-support.',
  })
  @ApiParam({
    name: 'areaId',
    type: 'string',
    format: 'uuid',
    description: 'Administrative Area UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Normalized Data Fusion contract retrieved successfully',
  })
  async getAreaDataFusion(
    @Param('areaId', ParseUUIDPipe) areaId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<AreaDataFusionResponse> {
    return this.analyticsService.getAreaDataFusion(areaId, query.sector);
  }

  @Get('demand')
  @Roles(UserRole.POLICYMAKER, UserRole.CITIZEN, UserRole.DISTRICT_OFFICER, UserRole.STATE_ADMIN, UserRole.DEPARTMENT_OFFICER, UserRole.ANALYST, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get multi-factor Demand Analytics for an administrative hierarchy or sector',
    description:
      'Calculates normalized demand density, complaints per 1000 population, severity-weighted demand, recent temporal trends, and composite demand score (0-100).',
  })
  @ApiResponse({
    status: 200,
    description: 'Demand analytics metrics computed successfully',
  })
  async getDemandAnalytics(@Query() query: import('./dto/demand-query.dto').DemandQueryDto) {
    return this.analyticsService.getDemandAnalytics(query);
  }

  @Get('demand/categories')
  @Roles(UserRole.POLICYMAKER, UserRole.CITIZEN, UserRole.DISTRICT_OFFICER, UserRole.STATE_ADMIN, UserRole.DEPARTMENT_OFFICER, UserRole.ANALYST, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get category-wise demand ranking and severity breakdown',
    description: 'Returns demand ranking by civic sector (WATER, ROADS, etc.) with critical grievance shares.',
  })
  @ApiResponse({
    status: 200,
    description: 'Category demand breakdown retrieved successfully',
  })
  async getDemandCategories(@Query() query: import('./dto/demand-query.dto').DemandQueryDto) {
    return this.analyticsService.getDemandCategories(query);
  }

  @Get('demand/trends')
  @Roles(UserRole.POLICYMAKER, UserRole.CITIZEN, UserRole.DISTRICT_OFFICER, UserRole.STATE_ADMIN, UserRole.DEPARTMENT_OFFICER, UserRole.ANALYST, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get weekly temporal demand trajectories over past 8 weeks',
    description: 'Returns weekly demand trajectory points to identify emerging civic service issues.',
  })
  @ApiResponse({
    status: 200,
    description: 'Demand trend points retrieved successfully',
  })
  async getDemandTrends(@Query() query: import('./dto/demand-query.dto').DemandQueryDto) {
    return this.analyticsService.getDemandTrends(query);
  }
}
