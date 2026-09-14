export type LeadClassification = 'hot' | 'warm' | 'cold';

export interface DigitalPresence {
  hasWebsite: boolean;
  websiteUrl: string | null;
  hasInstagram: boolean;
  instagramUrl: string | null;
  hasFacebook: boolean;
  facebookUrl: string | null;
  hasGoogleMaps: boolean;
  googleMapsUrl: string | null;
}

export interface WebsiteAnalysis {
  url: string;
  hasHttps: boolean;
  isMobileFriendly: boolean;
  mobileScore?: number;
  performanceScore: number;
  designScore: number;
  conversionScore: number;
  seoScore: number;
  overallQuality: number;
  hasContactForm: boolean;
  hasWhatsApp: boolean;
  hasCTA: boolean;
  hasOwnDomain: boolean;
  issues: string[];
}

export interface Lead {
  id: string;
  name: string;
  category: string;
  niche: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  googleMapsUrl: string | null;
  openingHours: string | null;
  rating: number | null;
  reviewCount: number | null;
  lat: number;
  lon: number;
  source: string;
  dataConfidence: number;
  nicheMatchScore: number;
  websiteOpportunityScore: number;
  classification: LeadClassification;
  opportunityReasons: string[];
  opportunitySuggestion: string;
  digitalPresence: DigitalPresence;
  websiteAnalysis: WebsiteAnalysis | null;
  discoveredAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  crmStage?: string;
}
