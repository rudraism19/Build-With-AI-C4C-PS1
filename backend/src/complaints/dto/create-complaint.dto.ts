import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  ComplaintCategory,
  ComplaintSeverity,
} from '../../common/enums/complaint.enum';

export class CreateComplaintDto {
  @ApiProperty({
    example: 'Broken water pipeline in Sector 4',
    description: 'Title of the complaint/development request',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @ApiProperty({
    example:
      'The primary water supply line has been leaking heavily since yesterday morning, flooding the street.',
    description: 'Detailed description of the issue',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description must not be empty' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
  description: string;

  @ApiProperty({
    enum: ComplaintCategory,
    example: ComplaintCategory.WATER,
    description: 'Category of the complaint',
  })
  @IsEnum(ComplaintCategory, {
    message: `Category must be one of: ${Object.values(ComplaintCategory).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Category must not be empty' })
  category: ComplaintCategory;

  @ApiProperty({
    enum: ComplaintSeverity,
    example: ComplaintSeverity.HIGH,
    description: 'Severity of the complaint',
  })
  @IsEnum(ComplaintSeverity, {
    message: `Severity must be one of: ${Object.values(ComplaintSeverity).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Severity must not be empty' })
  severity: ComplaintSeverity;

  @ApiPropertyOptional({
    example: 25.4358,
    description: 'Geographic latitude coordinate (-90 to 90)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Latitude must be a valid number' })
  @Min(-90, { message: 'Latitude must be between -90 and 90 degrees' })
  @Max(90, { message: 'Latitude must be between -90 and 90 degrees' })
  latitude?: number;

  @ApiPropertyOptional({
    example: 78.5421,
    description: 'Geographic longitude coordinate (-180 to 180)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Longitude must be a valid number' })
  @Min(-180, { message: 'Longitude must be between -180 and 180 degrees' })
  @Max(180, { message: 'Longitude must be between -180 and 180 degrees' })
  longitude?: number;
}
