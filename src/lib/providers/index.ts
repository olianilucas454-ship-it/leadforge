import { BusinessDataProvider, RawBusinessData, SearchParams } from './types';
import { GooglePlacesDataProvider } from './GooglePlacesDataProvider';
import { OverpassDataProvider } from './OverpassDataProvider';
import { MockBusinessDataProvider } from './MockBusinessDataProvider';

export class HybridBusinessDataProvider implements BusinessDataProvider {
  public name = 'LeadForge Discovery Engine (Google Maps Primary)';
  private googleMapsProvider: GooglePlacesDataProvider;
  private overpassProvider: OverpassDataProvider;
  private mockProvider: MockBusinessDataProvider;

  constructor() {
    this.googleMapsProvider = new GooglePlacesDataProvider();
    this.overpassProvider = new OverpassDataProvider();
    this.mockProvider = new MockBusinessDataProvider();
  }

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async search(params: SearchParams): Promise<RawBusinessData[]> {
    console.log(`[Discovery Engine] Fetching leads for "${params.niche}" in ${params.city} - ${params.state} (Source: ${params.searchSource || 'google_maps'})...`);

    // Explicit OpenStreetMap source
    if (params.searchSource === 'openstreetmap') {
      try {
        const osmResults = await this.overpassProvider.search(params);
        if (osmResults && osmResults.length > 0) return osmResults;
      } catch (e) {
        console.error('[Discovery Engine] OpenStreetMap failed:', e);
      }
    }

    // Default / Primary: Google Maps Engine
    try {
      const googleResults = await this.googleMapsProvider.search(params);
      if (googleResults && googleResults.length > 0) {
        console.log(`[Discovery Engine] Found ${googleResults.length} leads via Google Maps Engine.`);
        return googleResults;
      }
    } catch (err) {
      console.error('[Discovery Engine] Google Maps search error:', err);
    }

    // Secondary fallback: OpenStreetMap POIs
    try {
      const osmResults = await this.overpassProvider.search(params);
      if (osmResults && osmResults.length > 0) return osmResults;
    } catch (err) {
      console.error('[Discovery Engine] OpenStreetMap fallback error:', err);
    }

    // Final fallback: Demo Dataset
    return await this.mockProvider.search(params);
  }
}

let providerInstance: BusinessDataProvider | null = null;

export function getProvider(): BusinessDataProvider {
  if (!providerInstance) {
    providerInstance = new HybridBusinessDataProvider();
  }
  return providerInstance;
}

export { GooglePlacesDataProvider, OverpassDataProvider, MockBusinessDataProvider };
