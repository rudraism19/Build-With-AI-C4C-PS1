import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class HotspotQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category (e.g. WATER, ROADS)', example: 'WATER' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by State UUID' })
  @IsOptional()
  @IsUUID()
  state_id?: string;

  @ApiPropertyOptional({ description: 'Filter by District UUID' })
  @IsOptional()
  @IsUUID()
  district_id?: string;

  @ApiPropertyOptional({ description: 'Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)' })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ description: 'Minimum demand score (0-100)', example: 60.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minimum_score?: number;

  @ApiPropertyOptional({ description: 'Status filter (ACTIVE, INVESTIGATING, RESOLVED)', example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
