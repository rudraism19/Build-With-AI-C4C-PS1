import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { PoliciesService } from './policies.service';
import { PolicyIngestDto } from './dto/policy-ingest.dto';
import { PolicySearchDto } from './dto/policy-search.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Policy RAG')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post('ingest')
  @Roles(UserRole.POLICYMAKER, UserRole.SUPER_ADMIN, UserRole.STATE_ADMIN)
  @ApiOperation({
    summary: 'Ingest a government policy / scheme guidelines document for RAG indexing',
  })
  @ApiResponse({ status: 201, description: 'Policy document ingested and chunked' })
  async ingestPolicy(@Body() dto: PolicyIngestDto) {
    return this.policiesService.ingestPolicy(dto);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
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
    summary: 'Semantic vector search across policy knowledge base',
  })
  @ApiResponse({ status: 200, description: 'Semantic policy chunks retrieved' })
  async searchPolicies(@Body() dto: PolicySearchDto) {
    return this.policiesService.searchPolicies(dto);
  }

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
    summary: 'List available government policy documents',
  })
  @ApiResponse({ status: 200, description: 'Policy documents listed' })
  async getPolicies() {
    return this.policiesService.getPolicies();
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
    summary: 'Get details and vector chunks of a specific policy document',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Policy document UUID' })
  @ApiResponse({ status: 200, description: 'Policy details retrieved' })
  async getPolicyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.policiesService.getPolicyById(id);
  }
}
