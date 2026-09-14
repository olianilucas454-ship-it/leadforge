import { SearchParams, SearchResult, ProgressUpdate } from '../types/search';
import { Lead } from '../types/lead';
import { BusinessDataProvider } from '../providers/types';
import { NicheRelevanceEngine } from './NicheRelevanceEngine';
import { WebsiteAnalyzer } from './WebsiteAnalyzer';
import { WebsiteOpportunityScoreEngine } from './WebsiteOpportunityScore';
import { DuplicateDetectionService } from './DuplicateDetectionService';

export class LeadDiscoveryEngine {
  private provider: BusinessDataProvider;
  private nicheEngine: NicheRelevanceEngine;
  private websiteAnalyzer: WebsiteAnalyzer;
  private opportunityEngine: WebsiteOpportunityScoreEngine;
  private duplicateService: DuplicateDetectionService;

  constructor(provider: BusinessDataProvider) {
    this.provider = provider;
    this.nicheEngine = new NicheRelevanceEngine();
    this.websiteAnalyzer = new WebsiteAnalyzer();
    this.opportunityEngine = new WebsiteOpportunityScoreEngine();
    this.duplicateService = new DuplicateDetectionService();
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async discover(params: SearchParams, onProgress?: (update: ProgressUpdate) => void): Promise<SearchResult> {
    const startTime = Date.now();

    const emit = (update: ProgressUpdate) => {
      if (onProgress) onProgress(update);
    };

    emit({ step: 'searching', label: 'Buscando empresas...', completed: false });
    let rawBusinesses = await this.provider.search(params);
    emit({ step: 'searching', label: 'Busca concluída', completed: true, duration: Date.now() - startTime });

    const stepStart1 = Date.now();
    emit({ step: 'deduplicating', label: 'Removendo duplicatas...', completed: false });
    rawBusinesses = this.duplicateService.removeDuplicates(rawBusinesses);
    emit({ step: 'deduplicating', label: 'Duplicatas removidas', completed: true, duration: Date.now() - stepStart1 });

    const stepStart2 = Date.now();
    emit({ step: 'validating', label: 'Validando nichos...', completed: false });
    const validatedBusinesses = rawBusinesses.map(biz => {
      const match = this.nicheEngine.calculateMatch(params.niche, biz.category, biz.name);
      return { biz, match };
    }).filter(item => item.match.score >= 60);
    emit({ step: 'validating', label: 'Nichos validados', completed: true, duration: Date.now() - stepStart2 });

    const stepStart3 = Date.now();
    emit({ step: 'analyzing', label: 'Analisando presença digital...', completed: false });
    const analyzedBusinesses = validatedBusinesses.map(item => {
      const analysis = this.websiteAnalyzer.analyze(item.biz.website || null);
      return { ...item, analysis };
    });
    emit({ step: 'analyzing', label: 'Análise digital concluída', completed: true, duration: Date.now() - stepStart3 });

    const stepStart4 = Date.now();
    emit({ step: 'scoring', label: 'Calculando pontuação de oportunidade...', completed: false });
    const leads: Lead[] = analyzedBusinesses.map(item => {
      const biz = item.biz;
      
      const leadData = {
        hasWebsite: !!biz.website,
        hasInstagram: !!biz.instagram,
        hasFacebook: !!biz.facebook,
        phone: biz.phone || null,
        whatsapp: biz.whatsapp || null,
        rating: biz.rating ?? null,
        reviewCount: biz.reviewCount ?? null,
        openingHours: biz.openingHours || null,
        address: biz.address || '',
        category: biz.category || params.niche,
        websiteAnalysis: item.analysis || null,
      };

      const opportunity = this.opportunityEngine.calculate(leadData);

      const now = new Date().toISOString();

      return {
        id: biz.id,
        name: biz.name,
        category: biz.category,
        niche: params.niche,
        address: biz.address || '',
        neighborhood: biz.neighborhood || '',
        city: biz.city || params.city,
        state: biz.state || params.state,
        phone: biz.phone || null,
        whatsapp: biz.whatsapp || biz.phone || null,
        website: biz.website || null,
        instagram: biz.instagram || null,
        facebook: biz.facebook || null,
        googleMapsUrl: biz.googleMapsUrl || null,
        openingHours: biz.openingHours || null,
        rating: biz.rating ?? null,
        reviewCount: biz.reviewCount ?? null,
        lat: biz.lat,
        lon: biz.lon,
        source: biz.source,
        dataConfidence: biz.dataConfidence ?? 0.7,
        nicheMatchScore: item.match.score,
        websiteOpportunityScore: opportunity.score,
        classification: opportunity.classification,
        opportunityReasons: opportunity.reasons,
        opportunitySuggestion: opportunity.suggestion,
        digitalPresence: {
          hasWebsite: !!biz.website,
          websiteUrl: biz.website || null,
          hasInstagram: !!biz.instagram,
          instagramUrl: biz.instagram || null,
          hasFacebook: !!biz.facebook,
          facebookUrl: biz.facebook || null,
          hasGoogleMaps: !!biz.googleMapsUrl,
          googleMapsUrl: biz.googleMapsUrl || null,
        },
        websiteAnalysis: item.analysis,
        discoveredAt: now,
        updatedAt: now,
        isFavorite: false,
        crmStage: 'novo',
      } as Lead;
    });
    emit({ step: 'scoring', label: 'Pontuações calculadas', completed: true, duration: Date.now() - stepStart4 });

    const stepStart5 = Date.now();
    emit({ step: 'prioritizing', label: 'Priorizando leads...', completed: false });
    leads.sort((a, b) => b.websiteOpportunityScore - a.websiteOpportunityScore);
    const limitedLeads = leads.slice(0, params.limit || 50);
    emit({ step: 'prioritizing', label: 'Leads priorizados', completed: true, duration: Date.now() - stepStart5 });

    emit({ step: 'complete', label: 'Processo finalizado', completed: true });

    let hotCount = 0;
    let warmCount = 0;
    let coldCount = 0;
    let withoutWebsite = 0;

    for (const lead of limitedLeads) {
      if (lead.classification === 'hot') hotCount++;
      else if (lead.classification === 'warm') warmCount++;
      else coldCount++;

      if (!lead.digitalPresence.hasWebsite) withoutWebsite++;
    }

    return {
      leads: limitedLeads,
      totalFound: leads.length, // total found before limits
      withoutWebsite,
      hotCount,
      warmCount,
      coldCount,
      searchDuration: Date.now() - startTime,
      query: params
    };
  }
}
