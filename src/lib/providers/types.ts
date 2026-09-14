export interface SearchParams {
  niche: string;
  city: string;
  state: string;
  neighborhood?: string;
  radiusKm: number;
  limit: number;
  lat?: number;
  lon?: number;
}

export interface RawBusinessData {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  phone?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  googleMapsUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  openingHours?: string;
  rating?: number;
  reviewCount?: number;
  dataConfidence?: number;
  source: string;
}

export interface BusinessDataProvider {
  name: string;
  search(params: SearchParams): Promise<RawBusinessData[]>;
  isAvailable(): Promise<boolean>;
}
