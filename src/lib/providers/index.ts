import { BusinessDataProvider, RawBusinessData, SearchParams } from './types';
import { GooglePlacesDataProvider } from './GooglePlacesDataProvider';
import { OverpassDataProvider } from './OverpassDataProvider';
import { MockBusinessDataProvider } from './MockBusinessDataProvider';

export class HybridBusinessDataProvider implements BusinessDataProvider {
  public name = 'LeadForge Multi-Engine Discovery (Google Maps + OSM + Hybrid Fallback)';
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
    console.log(`[Discovery Engine] Running multi-engine search for "${params.niche}" in ${params.city} - ${params.state}...`);

    try {
      // Run Google Maps & OpenStreetMap search in parallel
      const [googleResults, osmResults] = await Promise.allSettled([
        this.googleMapsProvider.search(params),
        this.overpassProvider.search(params),
      ]);

      const merged: RawBusinessData[] = [];
      const seenNames = new Set<string>();

      // Helper to add unique lead
      const addUnique = (item: RawBusinessData) => {
        const key = item.name.toLowerCase().trim();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          merged.push({
            ...item,
            city: item.city || params.city,
            state: item.state || params.state,
          });
        }
      };

      // 1. Add Google Maps leads first
      if (googleResults.status === 'fulfilled' && Array.isArray(googleResults.value)) {
        googleResults.value.forEach(addUnique);
      }

      // 2. Combine OpenStreetMap leads
      if (osmResults.status === 'fulfilled' && Array.isArray(osmResults.value)) {
        osmResults.value.forEach(addUnique);
      }

      if (merged.length > 0) {
        console.log(`[Discovery Engine] Multi-engine merged ${merged.length} unique leads from Google Maps + OpenStreetMap.`);
        return merged.slice(0, params.limit);
      }
    } catch (err) {
      console.error('[Discovery Engine] Error during multi-engine search:', err);
    }

    // Fallback if both engines returned 0 items
    console.log('[Discovery Engine] Fallback to demo dataset.');
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
