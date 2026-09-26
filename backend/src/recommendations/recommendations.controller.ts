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
import { RecommendationsService } from './recommendations.service';
import { GenerateRecommendationDto } from './dto/generate-recommendation.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('AI Development Recommendations')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

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
    summary: 'List evidence-grounded AI development recommendations',
  })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved successfully' })
  async getRecommendations(
    @Query('sector') sector?: string,
    @Query('status') status?: string,
  ) {
    return this.recommendationsService.getRecommendations(sector, status);
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
    summary: 'Get details, citations, and evidence for a specific recommendation',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Recommendation UUID' })
  @ApiResponse({ status: 200, description: 'Recommendation details retrieved' })
  async getRecommendationById(@Param('id', ParseUUIDPipe) id: string) {
    return this.recommendationsService.getRecommendationById(id);
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.POLICYMAKER, UserRole.SUPER_ADMIN, UserRole.DISTRICT_OFFICER, UserRole.STATE_ADMIN)
  @ApiOperation({
    summary: 'Trigger AI generation of an evidence-backed development recommendation',
  })
  @ApiResponse({ status: 200, description: 'Recommendation generated successfully' })
  async generateRecommendation(@Body() dto: GenerateRecommendationDto) {
    return this.recommendationsService.generateRecommendation(dto);
  }
}
