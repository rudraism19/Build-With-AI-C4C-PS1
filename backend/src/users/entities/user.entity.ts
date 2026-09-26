import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/role.enum';

export class UserProfile {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Application user profile ID' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Supabase Auth user ID' })
  auth_user_id: string;

  @ApiProperty({ example: 'Rahul Sharma', description: 'Full name of user' })
  name: string;

  @ApiProperty({ example: 'rahul@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CITIZEN, description: 'Role assigned to the user' })
  role: UserRole;

  @ApiProperty({ example: 'DISTRICT', description: 'Jurisdiction scope type (STATE, DISTRICT, DEPARTMENT, ALL)', required: false })
  jurisdiction_type?: string;

  @ApiProperty({ example: 'a0000000-0000-0000-0000-000000000002', description: 'Assigned jurisdiction area UUID', required: false })
  jurisdiction_id?: string;

  @ApiProperty({ example: 'WATER', description: 'Assigned civic department/sector', required: false })
  department?: string;

  @ApiProperty({ example: '2026-09-24T12:00:00Z', description: 'Profile creation timestamp' })
  created_at: string;

  @ApiProperty({ example: '2026-09-24T12:00:00Z', description: 'Profile last updated timestamp' })
  updated_at: string;
}
