import { Lead } from './lead';

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

export interface SearchResult {
  leads: Lead[];
  totalFound: number;
  withoutWebsite: number;
  hotCount: number;
  warmCount: number;
  coldCount: number;
  searchDuration: number;
  query: SearchParams;
}

export type ProgressStep = 'searching' | 'deduplicating' | 'validating' | 'analyzing' | 'scoring' | 'prioritizing' | 'complete';

export interface ProgressUpdate {
  step: ProgressStep;
  label: string;
  completed: boolean;
  duration?: number;
}
