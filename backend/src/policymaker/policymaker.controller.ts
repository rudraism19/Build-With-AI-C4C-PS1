import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PolicymakerService } from './policymaker.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/role.enum';
import { HotspotQueryDto } from '../hotspots/dto/hotspot-query.dto';
import { PriorityQueryDto } from '../priorities/dto/priority-query.dto';
import { DemandQueryDto } from '../analytics/dto/demand-query.dto';

@ApiTags('Policymaker Dashboard')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('policymaker')
export class PolicymakerController {
  constructor(private readonly policymakerService: PolicymakerService) {}

  @Get('overview')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
    UserRole.CITIZEN,
  )
  @ApiOperation({
    summary: 'Executive dashboard KPI overview scoped to authenticated officer jurisdiction',
    description:
      'Aggregates citizen demand, active hotspots, priority interventions, budget utilization, and recommendations.',
  })
  @ApiResponse({ status: 200, description: 'Jurisdiction overview retrieved' })
  async getOverview(@CurrentUser() user: any) {
    return this.policymakerService.getOverview(user);
  }

  @Get('map')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
    UserRole.CITIZEN,
  )
  @ApiOperation({
    summary: 'Unified GIS map GeoJSON layer scoped to jurisdiction',
  })
  @ApiResponse({ status: 200, description: 'Jurisdiction GeoJSON map retrieved' })
  async getMap(@CurrentUser() user: any) {
    return this.policymakerService.getMap(user);
  }

  @Get('hotspots')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
    UserRole.CITIZEN,
  )
  @ApiOperation({
    summary: 'List active demand hotspots within jurisdiction',
  })
  @ApiResponse({ status: 200, description: 'Hotspots retrieved' })
  async getHotspots(@CurrentUser() user: any, @Query() query: HotspotQueryDto) {
    return this.policymakerService.getHotspots(user, query);
  }

  @Get('priorities')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
    UserRole.CITIZEN,
  )
  @ApiOperation({
    summary: 'List prioritized development interventions within jurisdiction',
  })
  @ApiResponse({ status: 200, description: 'Priorities retrieved' })
  async getPriorities(@CurrentUser() user: any, @Query() query: PriorityQueryDto) {
    return this.policymakerService.getPriorities(user, query);
  }

  @Get('recommendations')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
    UserRole.CITIZEN,
  )
  @ApiOperation({
    summary: 'List AI development recommendations within jurisdiction',
  })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved' })
  async getRecommendations(@CurrentUser() user: any, @Query() query: any) {
    return this.policymakerService.getRecommendations(user, query);
  }

  @Get('projects')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
    UserRole.CITIZEN,
  )
  @ApiOperation({
    summary: 'List public capital expenditure investment projects within jurisdiction',
  })
  @ApiResponse({ status: 200, description: 'Projects retrieved' })
  async getProjects(@CurrentUser() user: any, @Query() query: any) {
    return this.policymakerService.getProjects(user, query);
  }

  @Get('analytics')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
    UserRole.CITIZEN,
  )
  @ApiOperation({
    summary: 'Jurisdiction-scoped demand analytics deep dive',
  })
  @ApiResponse({ status: 200, description: 'Analytics retrieved' })
  async getAnalytics(@CurrentUser() user: any, @Query() query: DemandQueryDto) {
    return this.policymakerService.getAnalytics(user, query);
  }
}
