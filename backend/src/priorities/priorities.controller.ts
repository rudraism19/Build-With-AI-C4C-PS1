import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
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
import { PrioritiesService } from './priorities.service';
import { PriorityQueryDto } from './dto/priority-query.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Priority Engine')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('priorities')
export class PrioritiesController {
  constructor(private readonly prioritiesService: PrioritiesService) {}

  @Get()
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.CITIZEN,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'List calculated priority scores with factor breakdowns and explanations',
  })
  @ApiResponse({ status: 200, description: 'Priority scores retrieved successfully' })
  async getPriorities(@Query() query: PriorityQueryDto) {
    return this.prioritiesService.getPriorities(query);
  }

  @Get('top')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.CITIZEN,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Get top priority civic infrastructure interventions for executive review',
  })
  @ApiResponse({ status: 200, description: 'Top priorities retrieved' })
  async getTopPriorities(@Query('limit') limit?: number) {
    return this.prioritiesService.getTopPriorities(limit || 5);
  }

  @Get('map')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.CITIZEN,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Get GeoJSON map of prioritized development interventions',
  })
  @ApiResponse({ status: 200, description: 'Priorities GeoJSON retrieved' })
  async getPrioritiesMap(@Query() query: PriorityQueryDto) {
    return this.prioritiesService.getPrioritiesMap(query);
  }

  @Get(':id')
  @Roles(
    UserRole.POLICYMAKER,
    UserRole.CITIZEN,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Get detailed priority score with transparent multi-factor explanation',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Priority score UUID' })
  @ApiResponse({ status: 200, description: 'Priority details retrieved' })
  async getPriorityById(@Param('id', ParseUUIDPipe) id: string) {
    return this.prioritiesService.getPriorityById(id);
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.POLICYMAKER, UserRole.SUPER_ADMIN, UserRole.DISTRICT_OFFICER, UserRole.STATE_ADMIN)
  @ApiOperation({
    summary: 'Trigger recalculation and synchronization of priority scores',
  })
  @ApiResponse({ status: 200, description: 'Priorities recalculated successfully' })
  async calculatePriorities() {
    return this.prioritiesService.calculateAndSyncPriorities();
  }
}
