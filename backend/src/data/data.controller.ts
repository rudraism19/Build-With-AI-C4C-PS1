import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataService } from './data.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Government Data Management')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('sources')
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
    summary: 'List registered public and government data sources',
  })
  @ApiResponse({ status: 200, description: 'Data sources listed' })
  async getDataSources() {
    return this.dataService.getDataSources();
  }

  @Get('quality')
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
    summary: 'Get system-wide data quality and validation statistics',
  })
  @ApiResponse({ status: 200, description: 'Data quality metrics retrieved' })
  async getDataQuality() {
    return this.dataService.getDataQuality();
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.POLICYMAKER, UserRole.SUPER_ADMIN, UserRole.STATE_ADMIN)
  @ApiOperation({
    summary: 'Import government dataset CSV (DEMOGRAPHIC, INFRASTRUCTURE, INVESTMENT)',
  })
  @ApiResponse({ status: 200, description: 'Import job created and records processed' })
  async importData(
    @Body() payload: { csv_content: string; dataset_type: string; file_name?: string },
  ) {
    return this.dataService.importData(payload);
  }
}
