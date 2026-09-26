import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class PolicyIngestDto {
  @ApiProperty({ description: 'Official title of government policy or scheme', example: 'Jal Jeevan Mission Guidelines' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ description: 'Issuing department or ministry', example: 'Ministry of Jal Shakti' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Document type', default: 'SCHEME_GUIDELINE' })
  @IsOptional()
  @IsString()
  document_type?: string = 'SCHEME_GUIDELINE';

  @ApiPropertyOptional({ description: 'Brief description of the scheme' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Official source URL', example: 'https://jaljeevanmission.gov.in/guidelines' })
  @IsOptional()
  @IsString()
  source_url?: string;

  @ApiPropertyOptional({ description: 'Document publication date', example: '2023-04-01' })
  @IsOptional()
  @IsString()
  document_date?: string;

  @ApiProperty({ description: 'Full text content of the policy document for chunking and vector indexing' })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  content: string;
}
