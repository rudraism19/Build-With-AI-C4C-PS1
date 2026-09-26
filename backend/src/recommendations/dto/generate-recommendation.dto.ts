import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GenerateRecommendationDto {
  @ApiPropertyOptional({ description: 'Hotspot UUID to target for intervention' })
  @IsOptional()
  @IsUUID()
  hotspot_id?: string;

  @ApiPropertyOptional({ description: 'Priority score UUID' })
  @IsOptional()
  @IsUUID()
  priority_score_id?: string;

  @ApiProperty({ description: 'Administrative area UUID (District/Block/Ward)', example: 'a0000000-0000-0000-0000-000000000002' })
  @IsUUID()
  @IsNotEmpty()
  area_id: string;

  @ApiProperty({ description: 'Civic sector / category', example: 'WATER' })
  @IsString()
  @IsNotEmpty()
  sector: string;
}
