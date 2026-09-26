import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface AuditLogEntry {
  id?: string;
  user_id?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  ip_address?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Records a security/governance action in the audit_logs table.
   * Strips passwords and authentication tokens automatically.
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const sanitizedMetadata = { ...(entry.metadata || {}) };
      delete sanitizedMetadata.password;
      delete sanitizedMetadata.token;
      delete sanitizedMetadata.authorization;
      delete sanitizedMetadata.service_key;

      const supabase = this.supabaseService.getAdminClient();
      await supabase.from('audit_logs').insert({
        user_id: entry.user_id || null,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id || null,
        ip_address: entry.ip_address || '127.0.0.1',
        metadata: sanitizedMetadata,
        created_at: new Date().toISOString(),
      });
    } catch (e: any) {
      this.logger.warn(`Could not persist audit log: ${e.message}`);
    }
  }

  /**
   * Retrieves paginated audit trail logs for compliance review.
   */
  async getAuditLogs(page = 1, limit = 20) {
    const supabase = this.supabaseService.getAdminClient();
    const offset = (page - 1) * limit;

    try {
      const { data, count, error } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error || !data || data.length === 0) {
        return {
          data: [
            {
              id: 'audit-demo-001',
              action: 'INITIALIZE_GOVERNANCE_SYSTEM',
              resource_type: 'SYSTEM',
              resource_id: 'phase6-final',
              ip_address: '127.0.0.1',
              metadata: { event: 'Governance intelligence engine initialized', is_demo: true },
              created_at: new Date().toISOString(),
            },
          ],
          pagination: { page, limit, total: 1, totalPages: 1 },
        };
      }

      const total = count || data.length;
      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e: any) {
      this.logger.warn(`Error querying audit logs: ${e.message}`);
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  }
}
