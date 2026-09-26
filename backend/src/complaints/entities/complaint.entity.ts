import { ApiProperty } from '@nestjs/swagger';
import {
  AiProcessingStatus,
  ComplaintCategory,
  ComplaintSeverity,
  ComplaintStatus,
} from '../../common/enums/complaint.enum';

export class Complaint {
  @ApiProperty({
    example: 'd3b07384-d113-494b-9c8e-32f2ec4e5e4f',
    description: 'Complaint unique identifier',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User profile ID of the owner',
  })
  user_id: string;

  @ApiProperty({
    example: 'Broken water pipeline in Sector 4',
    description: 'Title of the complaint',
  })
  title: string;

  @ApiProperty({
    example:
      'The primary water supply line has been leaking heavily since yesterday morning, flooding the street.',
    description: 'Detailed description of the issue',
  })
  description: string;

  @ApiProperty({
    enum: ComplaintCategory,
    example: ComplaintCategory.WATER,
    description: 'Category of the complaint',
  })
  category: ComplaintCategory;

  @ApiProperty({
    enum: ComplaintSeverity,
    example: ComplaintSeverity.HIGH,
    description: 'Severity level of the complaint',
  })
  severity: ComplaintSeverity;

  @ApiProperty({
    enum: ComplaintStatus,
    example: ComplaintStatus.PENDING,
    description: 'Current status of the complaint',
  })
  status: ComplaintStatus;

  @ApiProperty({
    enum: AiProcessingStatus,
    example: AiProcessingStatus.COMPLETED,
    description: 'AI processing lifecycle status',
  })
  ai_status: AiProcessingStatus;

  @ApiProperty({
    example: 'WATER',
    nullable: true,
    description: 'Category classified by AI',
  })
  ai_category?: string;

  @ApiProperty({
    example: 'HIGH',
    nullable: true,
    description: 'Severity evaluated by AI',
  })
  ai_severity?: string;

  @ApiProperty({
    example: 'Critical water shortage affecting village sector 4 for past 5 days',
    nullable: true,
    description: 'AI generated concise summary',
  })
  ai_summary?: string;

  @ApiProperty({
    example: 'hi',
    nullable: true,
    description: 'Language of the complaint detected by AI',
  })
  ai_language?: string;

  @ApiProperty({
    example: 0.94,
    nullable: true,
    description: 'Confidence score of the AI classification (0.0 - 1.0)',
  })
  ai_confidence?: number;

  @ApiProperty({
    example: { location: 'Sector 4', department: 'Water Supply', duration: '5 days' },
    description: 'Named entities and metadata extracted by AI',
  })
  ai_entities?: Record<string, any>;

  @ApiProperty({
    example: '2026-09-24T12:05:00Z',
    nullable: true,
    description: 'Timestamp when AI processing finished',
  })
  ai_processed_at?: string;

  @ApiProperty({
    example: 25.4358,
    nullable: true,
    description: 'Latitude coordinate of the complaint',
  })
  latitude?: number;

  @ApiProperty({
    example: 78.5421,
    nullable: true,
    description: 'Longitude coordinate of the complaint',
  })
  longitude?: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174010',
    nullable: true,
    description: 'Resolved administrative State ID',
  })
  state_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174011',
    nullable: true,
    description: 'Resolved administrative District ID',
  })
  district_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174012',
    nullable: true,
    description: 'Resolved administrative Block ID',
  })
  block_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174013',
    nullable: true,
    description: 'Resolved administrative Village ID',
  })
  village_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174014',
    nullable: true,
    description: 'Resolved administrative Ward ID',
  })
  ward_id?: string;

  @ApiProperty({
    example: '2026-09-24T12:00:00Z',
    description: 'Created at timestamp',
  })
  created_at: string;

  @ApiProperty({
    example: '2026-09-24T12:00:00Z',
    description: 'Last updated timestamp',
  })
  updated_at: string;
}
