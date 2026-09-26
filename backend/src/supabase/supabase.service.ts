import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient | null = null;
  private adminClientInstance: SupabaseClient | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initClients();
  }

  private initClients() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logger.warn(
        'SUPABASE_URL or SUPABASE_ANON_KEY is not defined. Supabase client will not be functional until configured in .env',
      );
      return;
    }

    this.clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    if (supabaseServiceRoleKey) {
      this.adminClientInstance = createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      );
    } else {
      this.logger.warn(
        'SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations will fallback or be restricted.',
      );
    }
  }

  /**
   * Returns standard public Supabase client (anon key)
   */
  getClient(): SupabaseClient {
    if (!this.clientInstance) {
      this.initClients();
    }
    if (!this.clientInstance) {
      throw new Error(
        'Supabase client is not configured. Please provide SUPABASE_URL and SUPABASE_ANON_KEY in .env',
      );
    }
    return this.clientInstance;
  }

  /**
   * Returns Supabase admin client (service role key)
   */
  getAdminClient(): SupabaseClient {
    if (!this.adminClientInstance) {
      this.initClients();
    }
    if (!this.adminClientInstance) {
      throw new Error(
        'Supabase admin client is not configured. Please provide SUPABASE_SERVICE_ROLE_KEY in .env',
      );
    }
    return this.adminClientInstance;
  }

  /**
   * Validates a JWT Bearer token and returns the Supabase Auth User
   */
  async getUserFromToken(token: string): Promise<User> {
    const client = this.getClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser(token);

    if (error || !user) {
      throw new Error(error?.message || 'Invalid or expired authentication token');
    }

    return user;
  }
}
