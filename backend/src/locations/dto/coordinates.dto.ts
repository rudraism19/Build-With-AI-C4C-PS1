import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CoordinatesDto {
  @ApiProperty({
    example: 25.4358,
    description: 'Latitude coordinate between -90 and 90 degrees',
  })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Latitude must be a valid finite number' })
  @IsNotEmpty({ message: 'Latitude is required' })
  @Min(-90, { message: 'Latitude must be between -90 and 90 degrees' })
  @Max(90, { message: 'Latitude must be between -90 and 90 degrees' })
  latitude: number;

  @ApiProperty({
    example: 78.5421,
    description: 'Longitude coordinate between -180 and 180 degrees',
  })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Longitude must be a valid finite number' })
  @IsNotEmpty({ message: 'Longitude is required' })
  @Min(-180, { message: 'Longitude must be between -180 and 180 degrees' })
  @Max(180, { message: 'Longitude must be between -180 and 180 degrees' })
  longitude: number;
}
