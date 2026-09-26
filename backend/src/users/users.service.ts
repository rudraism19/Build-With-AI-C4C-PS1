import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserProfile } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Creates a user profile in public.users table
   */
  async createProfile(data: {
    auth_user_id: string;
    name: string;
    email: string;
    role: UserRole;
  }): Promise<UserProfile> {
    const supabase = this.supabaseService.getAdminClient();

    const { data: profile, error } = await supabase
      .from('users')
      .insert({
        auth_user_id: data.auth_user_id,
        name: data.name,
        email: data.email,
        role: data.role,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Error creating user profile: ${error.message}`, error);
      throw new InternalServerErrorException(
        'Failed to create application user profile',
      );
    }

    return profile as UserProfile;
  }

  /**
   * Finds a user profile by Supabase Auth user ID
   */
  async findByAuthUserId(authUserId: string): Promise<UserProfile | null> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (error) {
      this.logger.error(
        `Error finding user profile by auth ID: ${error.message}`,
      );
      throw new InternalServerErrorException('Database query failed');
    }

    return data as UserProfile | null;
  }

  /**
   * Finds a user profile by internal UUID id
   */
  async findById(id: string): Promise<UserProfile | null> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.logger.error(`Error finding user profile by ID: ${error.message}`);
      throw new InternalServerErrorException('Database query failed');
    }

    return data as UserProfile | null;
  }

  /**
   * Updates user profile for the authenticated user only
   */
  async updateByAuthUserId(
    authUserId: string,
    updateDto: UpdateUserDto,
  ): Promise<UserProfile> {
    const existing = await this.findByAuthUserId(authUserId);
    if (!existing) {
      throw new NotFoundException('User profile not found');
    }

    const supabase = this.supabaseService.getAdminClient();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updateDto.name !== undefined) {
      updatePayload.name = updateDto.name;
    }

    const { data: updated, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('auth_user_id', authUserId)
      .select()
      .single();

    if (error) {
      this.logger.error(
        `Error updating user profile: ${error.message}`,
        error,
      );
      throw new InternalServerErrorException('Failed to update user profile');
    }

    return updated as UserProfile;
  }
}
