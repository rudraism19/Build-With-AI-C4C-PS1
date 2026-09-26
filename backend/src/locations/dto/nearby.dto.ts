import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class NearbyQueryDto {
  @ApiProperty({
    example: 25.4358,
    description: 'Center point latitude (-90 to 90)',
  })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Latitude must be a valid number' })
  @IsNotEmpty({ message: 'Latitude is required' })
  @Min(-90, { message: 'Latitude must be between -90 and 90 degrees' })
  @Max(90, { message: 'Latitude must be between -90 and 90 degrees' })
  latitude: number;

  @ApiProperty({
    example: 78.5421,
    description: 'Center point longitude (-180 to 180)',
  })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Longitude must be a valid number' })
  @IsNotEmpty({ message: 'Longitude is required' })
  @Min(-180, { message: 'Longitude must be between -180 and 180 degrees' })
  @Max(180, { message: 'Longitude must be between -180 and 180 degrees' })
  longitude: number;

  @ApiPropertyOptional({
    example: 5000,
    default: 5000,
    description: 'Search radius in meters (default: 5000m, min: 10m, max: 100000m)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Radius must be a valid number' })
  @Min(10, { message: 'Radius must be at least 10 meters' })
  @Max(100000, { message: 'Radius cannot exceed 100,000 meters (100km)' })
  radius?: number = 5000;

  @ApiPropertyOptional({
    example: 'WATER',
    description: 'Optional category filter for nearby complaints',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
