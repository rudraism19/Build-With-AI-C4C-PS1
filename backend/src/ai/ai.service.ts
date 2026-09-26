import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AiProcessResult {
  complaint_id: string;
  status: string;
  category?: string | null;
  severity?: string | null;
  summary?: string | null;
  entities?: Record<string, any>;
  language?: string;
  confidence?: number | null;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly aiServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.aiServiceUrl = this.configService
      .get<string>('AI_SERVICE_URL', 'http://localhost:8000')
      .replace(/\/+$/, '');
  }

  /**
   * Calls FastAPI AI microservice to process citizen complaint.
   * Handles errors gracefully so complaint creation is not aborted if AI service is temporarily down.
   */
  async processComplaint(payload: {
    complaint_id: string;
    text: string;
    language?: string;
    input_type?: 'TEXT' | 'VOICE';
  }): Promise<AiProcessResult | null> {
    const targetUrl = `${this.aiServiceUrl}/api/v1/complaints/process`;
    const startTime = Date.now();

    try {
      this.logger.log(
        `Dispatching complaint ${payload.complaint_id} to AI Service at ${targetUrl}`,
      );

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          complaint_id: payload.complaint_id,
          text: payload.text,
          language: payload.language || 'en',
          input_type: payload.input_type || 'TEXT',
        }),
        signal: AbortSignal.timeout(20000), // 20s timeout
      });

      const latency = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn(
          `AI Service responded with status ${response.status} in ${latency}ms: ${errorText}`,
        );
        return null;
      }

      const result = (await response.json()) as AiProcessResult;
      this.logger.log(
        `AI processing completed for complaint ${payload.complaint_id} in ${latency}ms (status: ${result.status}, category: ${result.category})`,
      );
      return result;
    } catch (error: any) {
      const latency = Date.now() - startTime;
      this.logger.warn(
        `Failed to reach AI service at ${targetUrl} after ${latency}ms: ${error.message}`,
      );
      return null;
    }
  }
}
