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
import { HotspotsService } from './hotspots.service';
import { HotspotQueryDto } from './dto/hotspot-query.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Hotspots')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('hotspots')
export class HotspotsController {
  constructor(private readonly hotspotsService: HotspotsService) {}

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
    summary: 'List geographic demand hotspots',
    description: 'Returns paginated spatial clusters of concentrated citizen grievances by civic sector.',
  })
  @ApiResponse({ status: 200, description: 'Hotspots retrieved successfully' })
  async getHotspots(@Query() query: HotspotQueryDto) {
    return this.hotspotsService.getHotspots(query);
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
    summary: 'Get GeoJSON map layer of active demand hotspots',
    description: 'Returns an anonymous GeoJSON FeatureCollection ready for map rendering. Zero citizen coordinates exposed.',
  })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection retrieved' })
  async getHotspotsMap(@Query() query: HotspotQueryDto) {
    return this.hotspotsService.getHotspotsMap(query);
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
    summary: 'Get details for a specific demand hotspot',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Hotspot UUID' })
  @ApiResponse({ status: 200, description: 'Hotspot details retrieved' })
  async getHotspotById(@Param('id', ParseUUIDPipe) id: string) {
    return this.hotspotsService.getHotspotById(id);
  }

  @Post('detect')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.POLICYMAKER, UserRole.SUPER_ADMIN, UserRole.DISTRICT_OFFICER, UserRole.STATE_ADMIN)
  @ApiOperation({
    summary: 'Trigger PostGIS spatial clustering / hotspot detection algorithm',
    description: 'Executes spatial aggregation on unclustered complaints and updates the hotspots registry.',
  })
  @ApiResponse({ status: 200, description: 'Hotspot detection job executed' })
  async detectHotspots() {
    return this.hotspotsService.detectHotspots();
  }
}
