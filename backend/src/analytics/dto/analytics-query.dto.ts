import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AnalyticsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter analytics by development sector / category',
    example: 'WATER',
    enum: [
      'WATER',
      'ROADS',
      'ELECTRICITY',
      'SANITATION',
      'HEALTHCARE',
      'EDUCATION',
      'TRANSPORT',
      'DIGITAL_CONNECTIVITY',
      'AGRICULTURE',
      'OTHER',
    ],
  })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({
    description: 'Filter analytics by data year / financial year start',
    example: 2024,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;
}
