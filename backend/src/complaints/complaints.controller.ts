import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Complaint } from './entities/complaint.entity';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Complaints')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles(
    UserRole.CITIZEN,
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Submit citizen complaint and trigger AI processing pipeline',
    description:
      'Creates a complaint record, forwards it asynchronously to the FastAPI AI service for multilingual analysis, severity extraction, summarization, and entity detection, then persists and returns the enriched complaint.',
  })
  @ApiResponse({
    status: 201,
    description: 'Complaint successfully created and processed by AI pipeline',
    type: Complaint,
  })
  @ApiResponse({ status: 400, description: 'Invalid request body or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient role' })
  async create(
    @CurrentUser() user: any,
    @Body() createComplaintDto: CreateComplaintDto,
  ): Promise<Complaint> {
    const profileId = user.profile?.id || user.id;
    return this.complaintsService.create(profileId, createComplaintDto);
  }

  @Get()
  @Roles(
    UserRole.CITIZEN,
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Retrieve complaints (scoped: citizen personal tickets, or municipal demand stream for policymakers)',
    description:
      'Returns complaints created by citizen if role is CITIZEN, or all jurisdiction complaints if officer/policymaker.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of complaints',
    type: [Complaint],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: any): Promise<Complaint[]> {
    const userRole = user.profile?.role || user.role;
    if (
      userRole === UserRole.POLICYMAKER ||
      userRole === UserRole.DISTRICT_OFFICER ||
      userRole === UserRole.STATE_ADMIN ||
      userRole === UserRole.DEPARTMENT_OFFICER ||
      userRole === UserRole.ANALYST ||
      userRole === UserRole.SUPER_ADMIN
    ) {
      return this.complaintsService.findAll();
    }
    const profileId = user.profile?.id || user.id;
    return this.complaintsService.findAllByUserId(profileId);
  }

  @Get(':id')
  @Roles(
    UserRole.CITIZEN,
    UserRole.POLICYMAKER,
    UserRole.DISTRICT_OFFICER,
    UserRole.STATE_ADMIN,
    UserRole.DEPARTMENT_OFFICER,
    UserRole.ANALYST,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Get a specific complaint by ID',
    description:
      'Retrieves the complaint. Accessible by owner citizen or by municipal officers.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID of the complaint',
  })
  @ApiResponse({
    status: 200,
    description: 'Complaint retrieved successfully',
    type: Complaint,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Cannot access another citizen complaint',
  })
  @ApiResponse({ status: 404, description: 'Complaint not found' })
  async findOne(
    @CurrentUser() user: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Complaint> {
    const userRole = user.profile?.role || user.role;
    if (
      userRole === UserRole.POLICYMAKER ||
      userRole === UserRole.DISTRICT_OFFICER ||
      userRole === UserRole.STATE_ADMIN ||
      userRole === UserRole.DEPARTMENT_OFFICER ||
      userRole === UserRole.ANALYST ||
      userRole === UserRole.SUPER_ADMIN
    ) {
      return this.complaintsService.findOne(id);
    }
    const profileId = user.profile?.id || user.id;
    return this.complaintsService.findOneWithOwnership(id, profileId);
  }
}
