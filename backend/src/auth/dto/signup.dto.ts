import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';

export class SignUpDto {
  @ApiProperty({ example: 'Rahul Sharma', description: 'Full name of user' })
  @IsString()
  @IsNotEmpty({ message: 'Name must not be empty' })
  @MinLength(2, { message: 'Name must have at least 2 characters' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({ example: 'rahul@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User password (minimum 6 characters)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password must not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(72, { message: 'Password cannot exceed 72 characters' })
  password: string;

  @ApiProperty({
    enum: [UserRole.CITIZEN],
    default: UserRole.CITIZEN,
    description: 'Role for public registration (strictly CITIZEN)',
  })
  @IsOptional()
  @IsIn([UserRole.CITIZEN], {
    message:
      'Public signup only permits the CITIZEN role. Policymakers cannot self-register.',
  })
  role?: UserRole = UserRole.CITIZEN;
}
