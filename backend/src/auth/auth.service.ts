import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../common/enums/role.enum';
import { UserProfile } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Registers a new citizen user through Supabase Auth and creates profile
   */
  async signup(signUpDto: SignUpDto) {
    if (signUpDto.role && signUpDto.role !== UserRole.CITIZEN) {
      throw new BadRequestException(
        'Public registration is only permitted for the CITIZEN role',
      );
    }

    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.signUp({
      email: signUpDto.email,
      password: signUpDto.password,
      options: {
        data: {
          name: signUpDto.name,
          role: UserRole.CITIZEN,
        },
      },
    });

    if (error) {
      this.logger.warn(`Signup failed in Supabase Auth: ${error.message}`);
      throw new BadRequestException(error.message);
    }

    if (!data.user) {
      throw new InternalServerErrorException(
        'User registration failed in Supabase',
      );
    }

    // Check if user already exists in auth (Supabase returns fake user with empty identities for duplicate emails)
    if (data.user.identities && data.user.identities.length === 0) {
      throw new BadRequestException('A user with this email already exists');
    }

    // Create or retrieve user profile in public.users table
    let profile: UserProfile | null = await this.usersService.findByAuthUserId(
      data.user.id,
    );

    if (!profile) {
      profile = await this.usersService.createProfile({
        auth_user_id: data.user.id,
        name: signUpDto.name,
        email: signUpDto.email,
        role: UserRole.CITIZEN,
      });
    }

    return {
      message: 'Citizen registered successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session,
      profile,
    };
  }

  /**
   * Authenticates user via Supabase Auth and returns session and profile
   */
  async login(loginDto: LoginDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error || !data.user || !data.session) {
      this.logger.warn(`Login failed for ${loginDto.email}: ${error?.message}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    let profile = await this.usersService.findByAuthUserId(data.user.id);

    // Self-heal profile if user was created directly in Supabase Auth
    if (!profile) {
      profile = await this.usersService.createProfile({
        auth_user_id: data.user.id,
        name:
          (data.user.user_metadata?.name as string) ||
          data.user.email?.split('@')[0] ||
          'Citizen',
        email: data.user.email || loginDto.email,
        role:
          (data.user.user_metadata?.role as UserRole) || UserRole.CITIZEN,
      });
    }

    return {
      message: 'Authentication successful',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      token_type: data.session.token_type,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      profile,
    };
  }

  /**
   * Logs out the user session
   */
  async logout(token?: string) {
    try {
      const client = this.supabaseService.getClient();
      if (token) {
        await client.auth.signOut();
      }
    } catch (err) {
      this.logger.debug(`Logout note: ${err.message}`);
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  /**
   * Retrieves profile of authenticated user
   */
  async getMe(authUser: any) {
    let profile =
      (await this.usersService.findByAuthUserId(authUser.id)) ||
      authUser.profile;

    if (!profile) {
      profile = await this.usersService.createProfile({
        auth_user_id: authUser.id,
        name:
          (authUser.user_metadata?.full_name as string) ||
          (authUser.user_metadata?.name as string) ||
          authUser.email?.split('@')[0] ||
          'Citizen',
        email: authUser.email || '',
        role: (authUser.user_metadata?.role as UserRole) || UserRole.CITIZEN,
      });
    }

    return {
      user: {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
      },
      profile,
    };
  }

  /**
   * Synchronizes or ensures user profile for Supabase Google OAuth logins
   */
  async syncOAuthUser(authUser: any, desiredRole?: UserRole) {
    let profile = await this.usersService.findByAuthUserId(authUser.id);
    if (!profile) {
      const assignedRole =
        desiredRole ||
        (authUser.user_metadata?.role as UserRole) ||
        UserRole.CITIZEN;
      const name =
        (authUser.user_metadata?.full_name as string) ||
        (authUser.user_metadata?.name as string) ||
        authUser.email?.split('@')[0] ||
        'Citizen';
      profile = await this.usersService.createProfile({
        auth_user_id: authUser.id,
        name,
        email: authUser.email || '',
        role: assignedRole,
      });
    }
    return {
      success: true,
      user: {
        id: authUser.id,
        email: authUser.email,
      },
      profile,
    };
  }
}

