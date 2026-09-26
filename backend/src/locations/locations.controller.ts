import {
  Body,
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
import { LocationsService } from './locations.service';
import { CoordinatesDto } from './dto/coordinates.dto';
import { NearbyQueryDto } from './dto/nearby.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/role.enum';
import {
  ComplaintLocationResult,
  LocationResolutionResult,
  NearbyComplaintItem,
} from './types/location.types';

@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('complaints/:complaintId')
  @Roles(UserRole.CITIZEN, UserRole.POLICYMAKER)
  @ApiOperation({
    summary: 'Get geographic location of a complaint',
    description:
      'Retrieves the latitude and longitude coordinates for a specific complaint. Citizens can only access their own complaint location.',
  })
  @ApiParam({
    name: 'complaintId',
    type: 'string',
    format: 'uuid',
    description: 'Complaint UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Complaint coordinates retrieved',
    schema: {
      type: 'object',
      properties: {
        complaint_id: { type: 'string', example: 'd3b07384-d113-494b-9c8e-32f2ec4e5e4f' },
        latitude: { type: 'number', example: 25.4358, nullable: true },
        longitude: { type: 'number', example: 78.5421, nullable: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot access another citizen complaint location' })
  @ApiResponse({ status: 404, description: 'Complaint not found' })
  async getComplaintLocation(
    @CurrentUser() user: any,
    @Param('complaintId', new ParseUUIDPipe({ version: '4' })) complaintId: string,
  ): Promise<ComplaintLocationResult> {
    const profileId = user.profile?.id || user.id;
    const role = user.profile?.role || user.role;
    return this.locationsService.getComplaintLocation(complaintId, profileId, role);
  }

  @Get('nearby')
  @Roles(UserRole.CITIZEN, UserRole.POLICYMAKER)
  @ApiOperation({
    summary: 'Search nearby complaints within a geographic radius',
    description:
      'Performs a PostGIS ST_DWithin spatial query to find complaints within a radius (in meters) of given coordinates.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of nearby complaints ordered by distance',
  })
  @ApiResponse({ status: 400, description: 'Invalid coordinate or radius parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findNearby(
    @Query() query: NearbyQueryDto,
  ): Promise<NearbyComplaintItem[]> {
    return this.locationsService.findNearbyComplaints(query);
  }

  @Post('resolve')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CITIZEN, UserRole.POLICYMAKER)
  @ApiOperation({
    summary: 'Resolve administrative boundary hierarchy from coordinates',
    description:
      'Performs Point-in-Polygon spatial query (ST_Contains) against administrative_areas to identify state, district, block, village, or ward.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resolved administrative hierarchy (returns null if unmapped)',
    schema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', example: 25.4358 },
        longitude: { type: 'number', example: 78.5421 },
        state: { type: 'object', nullable: true },
        district: { type: 'object', nullable: true },
        block: { type: 'object', nullable: true },
        village: { type: 'object', nullable: true },
        ward: { type: 'object', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid coordinate format or out of bounds' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resolveLocation(
    @Body() dto: CoordinatesDto,
  ): Promise<LocationResolutionResult> {
    return this.locationsService.resolveLocation(dto.latitude, dto.longitude);
  }
}
