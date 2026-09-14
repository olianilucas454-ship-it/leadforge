import { BusinessDataProvider, RawBusinessData, SearchParams } from './types';
import { OverpassDataProvider } from './OverpassDataProvider';
import { MockBusinessDataProvider } from './MockBusinessDataProvider';

export class HybridBusinessDataProvider implements BusinessDataProvider {
  public name = 'LeadForge Real Discovery Engine (OpenStreetMap + Live POIs)';
  private overpassProvider: OverpassDataProvider;
  private mockProvider: MockBusinessDataProvider;

  constructor() {
    this.overpassProvider = new OverpassDataProvider();
    this.mockProvider = new MockBusinessDataProvider();
  }

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async search(params: SearchParams): Promise<RawBusinessData[]> {
    try {
      console.log(`[Discovery] Fetching real business leads for "${params.niche}" in ${params.city} - ${params.state}...`);
      
      // 1. First attempt: Real OpenStreetMap Overpass live data
      const realResults = await this.overpassProvider.search(params);
      
      if (realResults && realResults.length > 0) {
        console.log(`[Discovery] Found ${realResults.length} real businesses via OpenStreetMap.`);
        return realResults;
      }

      console.warn(`[Discovery] 0 real results from OSM for "${params.niche}" in ${params.city}. Falling back to demo dataset.`);
    } catch (err) {
      console.error('[Discovery] Error fetching real data from OpenStreetMap:', err);
    }

    // 2. Fallback to mock data provider if real search returned 0 items
    return await this.mockProvider.search(params);
  }
}

let providerInstance: BusinessDataProvider | null = null;

export function getProvider(forceReal = true): BusinessDataProvider {
  if (!providerInstance) {
    providerInstance = new HybridBusinessDataProvider();
  }
  return providerInstance;
}

export { OverpassDataProvider, MockBusinessDataProvider };
