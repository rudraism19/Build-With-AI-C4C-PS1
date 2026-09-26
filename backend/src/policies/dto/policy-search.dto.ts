import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class PolicySearchDto {
  @ApiProperty({
    description: 'Semantic query describing a civic problem or scheme to search for',
    example: 'rural drinking water infrastructure pipeline guidelines',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  query: string;

  @ApiPropertyOptional({
    description: 'Maximum number of top relevant policy chunks to return',
    default: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  top_k?: number = 5;
}
