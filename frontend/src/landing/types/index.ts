export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'ta' | 'te';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flagEmoji?: string;
  scriptBadge: string;
}

export type DemandCategory =
  | 'all'
  | 'roads'
  | 'water'
  | 'healthcare'
  | 'education'
  | 'transport'
  | 'digital';

export interface HotspotData {
  id: string;
  title: string;
  location: string;
  state: string;
  category: DemandCategory;
  categoryLabel: string;
  demandLevel: 'Critical' | 'High' | 'Moderate';
  requestCount: number;
  coordinates: { x: number; y: number }; // percentage on SVG canvas
  affectedPopulation: number;
  panchayatCount: number;
  schemeAlignment: string;
  summary: string;
}

export interface PolicymakerDossier {
  id: string;
  code: string;
  category: DemandCategory;
  categoryLabel: string;
  title: string;
  location: string;
  status: 'Pending Review' | 'Fast-Track Approved' | 'In Feasibility Study';
  demandLevel: 'Critical' | 'High' | 'Moderate';
  percentileRank: string;
  citizenRequests: number;
  growthRate: string;
  affectedPopulation: number;
  panchayatCount: number;
  infrastructureIndex: {
    score: number;
    maxScore: number;
    label: string;
  };
  sanctionedBudget: string;
  aiPriority: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  recommendationNote: string;
  capexBreakdown: { item: string; amount: string; scheme: string }[];
  auditTrail: { timestamp: string; event: string; verifiedBy: string }[];
}

export interface VoiceSample {
  id: string;
  originalText: string;
  language: string;
  state: string;
  location: string;
  inputMode: 'Voice Input' | 'Messaging App' | 'IVR Call' | 'Portal Text';
  translatedText: string;
  category: DemandCategory;
  categoryLabel: string;
  urgency: 'Critical' | 'High' | 'Normal';
  confidenceScore: number;
  structuredAttributes: {
    primaryNeed: string;
    subDistrict: string;
    estimatedBeneficiaries: number;
  };
}

export interface CitizenSubmission {
  mode: 'voice' | 'text' | 'message';
  language: string;
  location: string;
  category: string;
  description: string;
  submittedAt: string;
}
