import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class PriorityQueryDto {
  @ApiPropertyOptional({ description: 'Filter by civic sector (e.g. WATER, ROADS)', example: 'WATER' })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({ description: 'Filter by District UUID' })
  @IsOptional()
  @IsUUID()
  district?: string;

  @ApiPropertyOptional({ description: 'Filter by State UUID' })
  @IsOptional()
  @IsUUID()
  state?: string;

  @ApiPropertyOptional({ description: 'Minimum priority score (0-100)', example: 70.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minimum_score?: number;

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
