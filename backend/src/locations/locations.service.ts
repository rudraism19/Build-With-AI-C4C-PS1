import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { NearbyQueryDto } from './dto/nearby.dto';
import {
  AdministrativeAreaItem,
  ComplaintLocationResult,
  LocationResolutionResult,
  NearbyComplaintItem,
} from './types/location.types';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Resolves administrative area hierarchy containing given coordinates using PostGIS ST_Contains.
   * Returns null values if no boundary dataset matches, rather than fabricating locations.
   */
  async resolveLocation(
    latitude: number,
    longitude: number,
  ): Promise<LocationResolutionResult> {
    const supabase = this.supabaseService.getAdminClient();

    try {
      const { data, error } = await supabase.rpc('resolve_administrative_areas', {
        p_latitude: latitude,
        p_longitude: longitude,
      });

      if (error) {
        this.logger.warn(
          `RPC resolve_administrative_areas call note: ${error.message}`,
        );
        return this.buildEmptyResolution(latitude, longitude);
      }

      const rows: AdministrativeAreaItem[] = data || [];

      return {
        latitude,
        longitude,
        state: rows.find((r) => r.type === 'STATE') || null,
        district: rows.find((r) => r.type === 'DISTRICT') || null,
        block: rows.find((r) => r.type === 'BLOCK') || null,
        village: rows.find((r) => r.type === 'VILLAGE') || null,
        ward: rows.find((r) => r.type === 'WARD') || null,
      };
    } catch (err: any) {
      this.logger.warn(`Error resolving location coordinates: ${err.message}`);
      return this.buildEmptyResolution(latitude, longitude);
    }
  }

  /**
   * Performs spatial radius search for nearby complaints using PostGIS ST_DWithin and ST_Distance.
   */
  async findNearbyComplaints(
    dto: NearbyQueryDto,
  ): Promise<NearbyComplaintItem[]> {
    const supabase = this.supabaseService.getAdminClient();
    const radiusMeters = dto.radius || 5000;

    try {
      const { data, error } = await supabase.rpc('get_nearby_complaints', {
        p_latitude: dto.latitude,
        p_longitude: dto.longitude,
        p_radius_meters: radiusMeters,
        p_category: dto.category || null,
      });

      if (error) {
        this.logger.error(
          `Spatial query failed in get_nearby_complaints: ${error.message}`,
          error,
        );
        throw new InternalServerErrorException(
          'Geospatial search could not be executed',
        );
      }

      return (data || []) as NearbyComplaintItem[];
    } catch (err: any) {
      if (err instanceof InternalServerErrorException) throw err;
      this.logger.error(`Error querying nearby complaints: ${err.message}`);
      throw new InternalServerErrorException(
        'Failed to query nearby complaints',
      );
    }
  }

  /**
   * Retrieves geographic coordinates of a complaint with privacy enforcement.
   * A citizen can only access their own complaint location.
   */
  async getComplaintLocation(
    complaintId: string,
    currentUserId: string,
    userRole?: string,
  ): Promise<ComplaintLocationResult> {
    const supabase = this.supabaseService.getAdminClient();

    const { data: complaint, error } = await supabase
      .from('complaints')
      .select('id, user_id, latitude, longitude')
      .eq('id', complaintId)
      .maybeSingle();

    if (error) {
      this.logger.error(
        `Failed to retrieve complaint location for ${complaintId}: ${error.message}`,
      );
      throw new InternalServerErrorException('Database query failed');
    }

    if (!complaint) {
      throw new NotFoundException(`Complaint '${complaintId}' was not found`);
    }

    // Privacy & Security Check: Citizen can only view own complaint coordinates
    if (complaint.user_id !== currentUserId && userRole !== 'POLICYMAKER') {
      throw new ForbiddenException(
        'Forbidden: You can only access the location of your own complaints',
      );
    }

    return {
      complaint_id: complaint.id,
      latitude: complaint.latitude,
      longitude: complaint.longitude,
    };
  }

  private buildEmptyResolution(
    latitude: number,
    longitude: number,
  ): LocationResolutionResult {
    return {
      latitude,
      longitude,
      state: null,
      district: null,
      block: null,
      village: null,
      ward: null,
    };
  }
}
