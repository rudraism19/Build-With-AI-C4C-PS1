import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class DemandQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by State UUID',
    example: 'a0000000-0000-0000-0000-000000000001',
  })
  @IsOptional()
  @IsUUID()
  state_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by District UUID',
    example: 'a0000000-0000-0000-0000-000000000002',
  })
  @IsOptional()
  @IsUUID()
  district_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by Block UUID',
  })
  @IsOptional()
  @IsUUID()
  block_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by Village / Ward UUID',
  })
  @IsOptional()
  @IsUUID()
  village_id?: string;

  @ApiPropertyOptional({
    description: 'Civic category / sector',
    example: 'WATER',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'ISO Start Date for temporal filtering',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'ISO End Date for temporal filtering',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
