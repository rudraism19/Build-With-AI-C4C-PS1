import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../../supabase/supabase.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token not provided');
    }

    try {
      // 1 & 2. Validate token through Supabase Auth
      const authUser = await this.supabaseService.getUserFromToken(token);

      if (!authUser) {
        throw new UnauthorizedException('Invalid or expired authentication token');
      }

      // 3. Retrieve user profile from database
      const profile = await this.usersService.findByAuthUserId(authUser.id);

      // 4. Attach user and profile to request
      request['user'] = {
        ...authUser,
        profile: profile || null,
        role: profile?.role || (authUser.user_metadata?.role as string) || null,
      };

      return true;
    } catch (error) {
      this.logger.warn(`Auth guard validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
