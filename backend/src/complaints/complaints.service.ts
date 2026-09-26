import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Complaint } from './entities/complaint.entity';
import {
  AiProcessingStatus,
  ComplaintStatus,
} from '../common/enums/complaint.enum';
import { AiService } from '../ai/ai.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly aiService: AiService,
    private readonly locationsService: LocationsService,
  ) {}

  /**
   * Creates a new complaint for an authenticated citizen and runs AI triage pipeline.
   * Gracefully handles AI service downtime without corrupting the complaint record.
   * Supports optional PostGIS coordinates and automatic administrative hierarchy resolution.
   */
  async create(
    userId: string,
    createComplaintDto: CreateComplaintDto,
  ): Promise<Complaint> {
    const supabase = this.supabaseService.getAdminClient();

    // Derive administrative area hierarchy from coordinates if provided
    let stateId: string | null = null;
    let districtId: string | null = null;
    let blockId: string | null = null;
    let villageId: string | null = null;
    let wardId: string | null = null;

    if (
      createComplaintDto.latitude !== undefined &&
      createComplaintDto.longitude !== undefined
    ) {
      try {
        const resolution = await this.locationsService.resolveLocation(
          createComplaintDto.latitude,
          createComplaintDto.longitude,
        );
        stateId = resolution.state?.id || null;
        districtId = resolution.district?.id || null;
        blockId = resolution.block?.id || null;
        villageId = resolution.village?.id || null;
        wardId = resolution.ward?.id || null;
      } catch (err: any) {
        this.logger.warn(`Failed to resolve administrative area: ${err.message}`);
      }
    }

    // 1. Initial complaint persistence with PENDING AI status and coordinates
    const newRecord: Record<string, any> = {
      user_id: userId,
      title: createComplaintDto.title,
      description: createComplaintDto.description,
      category: createComplaintDto.category,
      severity: createComplaintDto.severity,
      status: ComplaintStatus.PENDING,
      ai_status: AiProcessingStatus.PENDING,
      latitude: createComplaintDto.latitude ?? null,
      longitude: createComplaintDto.longitude ?? null,
      state_id: stateId || 'a0000000-0000-0000-0000-000000000001',
      district_id: districtId || 'a0000000-0000-0000-0000-000000000002',
      block_id: blockId,
      village_id: villageId,
      ward_id: wardId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: savedRecord, error: insertError } = await supabase
      .from('complaints')
      .insert(newRecord)
      .select()
      .single();

    if (insertError || !savedRecord) {
      this.logger.error(
        `Error inserting complaint: ${insertError?.message}`,
        insertError,
      );
      throw new InternalServerErrorException('Failed to create complaint');
    }

    const complaint = savedRecord as Complaint;

    // 2. Call FastAPI AI processing pipeline
    try {
      const fullText = `${complaint.title}. ${complaint.description}`;
      const aiResult = await this.aiService.processComplaint({
        complaint_id: complaint.id,
        text: fullText,
        language: 'en',
        input_type: 'TEXT',
      });

      if (aiResult && aiResult.status === 'processed') {
        const aiUpdate = {
          ai_status: AiProcessingStatus.COMPLETED,
          ai_category: aiResult.category || null,
          ai_severity: aiResult.severity || null,
          ai_summary: aiResult.summary || null,
          ai_language: aiResult.language || null,
          ai_confidence:
            aiResult.confidence !== undefined ? aiResult.confidence : null,
          ai_entities: aiResult.entities || {},
          ai_processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: updatedComplaint, error: updateError } = await supabase
          .from('complaints')
          .update(aiUpdate)
          .eq('id', complaint.id)
          .select()
          .single();

        if (updateError) {
          this.logger.warn(
            `Failed to update complaint with AI results: ${updateError.message}`,
          );
          return { ...complaint, ...aiUpdate } as Complaint;
        }

        return updatedComplaint as Complaint;
      } else {
        // AI returned unprocessable result
        this.logger.warn(
          `AI service returned non-processed status for complaint ${complaint.id}`,
        );
        await supabase
          .from('complaints')
          .update({
            ai_status: AiProcessingStatus.FAILED,
            updated_at: new Date().toISOString(),
          })
          .eq('id', complaint.id);

        return { ...complaint, ai_status: AiProcessingStatus.FAILED } as Complaint;
      }
    } catch (aiError: any) {
      // Graceful error handling: complaint record is preserved with FAILED ai_status
      this.logger.warn(
        `AI processing pipeline failed for complaint ${complaint.id}: ${aiError.message}`,
      );

      try {
        await supabase
          .from('complaints')
          .update({
            ai_status: AiProcessingStatus.FAILED,
            updated_at: new Date().toISOString(),
          })
          .eq('id', complaint.id);
      } catch (updateErr: any) {
        this.logger.warn(`Failed to set ai_status to FAILED: ${updateErr.message}`);
      }

      return { ...complaint, ai_status: AiProcessingStatus.FAILED } as Complaint;
    }
  }

  /**
   * Retrieves all complaints belonging to a specific citizen
   */
  async findAllByUserId(userId: string): Promise<Complaint[]> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(
        `Error fetching complaints for user ${userId}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to retrieve complaints');
    }

    return (data || []) as Complaint[];
  }

  /**
   * Retrieves all complaints across the municipality (for policymakers and administrators)
   */
  async findAll(): Promise<Complaint[]> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(
        `Error fetching all municipal complaints: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to retrieve complaints');
    }

    return (data || []) as Complaint[];
  }

  /**
   * Finds a complaint by ID without ownership restriction (for policymakers/administrators)
   */
  async findOne(id: string): Promise<Complaint> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.logger.error(`Error querying complaint ${id}: ${error.message}`);
      throw new InternalServerErrorException('Database query failed');
    }

    if (!data) {
      throw new NotFoundException(`Complaint with ID '${id}' was not found`);
    }

    return data as Complaint;
  }

  /**
   * Finds a complaint by ID and verifies user ownership
   * Throws 404 if not found
   * Throws 403 Forbidden if not owned by the requesting citizen
   */
  async findOneWithOwnership(
    id: string,
    userId: string,
  ): Promise<Complaint> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.logger.error(
        `Error querying complaint ${id}: ${error.message}`,
      );
      throw new InternalServerErrorException('Database query failed');
    }

    if (!data) {
      throw new NotFoundException(`Complaint with ID '${id}' was not found`);
    }

    if (data.user_id !== userId) {
      throw new ForbiddenException(
        'Forbidden resource: You can only access your own complaints',
      );
    }

    return data as Complaint;
  }
}
