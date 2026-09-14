import { WebsiteOpportunityResult } from '../types/analysis';
import { WebsiteAnalysis } from '../types/lead';

export interface LeadOpportunityData {
  hasWebsite: boolean;
  hasInstagram: boolean;
  hasFacebook: boolean;
  phone: string | null;
  whatsapp: string | null;
  rating: number | null;
  reviewCount: number | null;
  openingHours: string | null;
  address: string;
  category: string;
  websiteAnalysis?: WebsiteAnalysis | null;
}

export class WebsiteOpportunityScoreEngine {
  public calculate(lead: LeadOpportunityData): WebsiteOpportunityResult {
    let score = 0;
    const reasons: string[] = [];
    
    if (!lead.hasWebsite) {
      score += 40;
      reasons.push('Não possui site oficial');
    }

    if (!lead.hasWebsite && (lead.hasInstagram || lead.hasFacebook)) {
      score += 20;
      reasons.push('Possui presença em redes sociais, mas não tem site');
    }

    if (lead.phone || lead.whatsapp) {
      score += 15;
      reasons.push('Possui canal de contato direto disponível');
    }

    if (lead.reviewCount && lead.reviewCount > 50) {
      score += 10;
      reasons.push('Alto engajamento de clientes (muitas avaliações)');
    }

    if (lead.rating && lead.rating >= 4.0) {
      score += 10;
      reasons.push('Boa reputação online (avaliação >= 4.0)');
    }

    if (lead.openingHours && lead.rating) {
      score += 10;
      reasons.push('Presença comercial ativa e estruturada');
    }

    if ((lead.phone || lead.whatsapp) && lead.address && lead.category) {
      score += 10;
      reasons.push('Informações cadastrais completas facilitam a prospecção');
    }

    if (lead.hasWebsite && lead.websiteAnalysis) {
      const wa = lead.websiteAnalysis;
      if (wa.overallQuality > 80) {
        score -= 20;
        reasons.push('Site atual já possui alta qualidade geral');
      }
      if (wa.performanceScore > 70) {
        score -= 15;
        reasons.push('Site atual tem boa performance');
      }
      if (wa.isMobileFriendly) {
        score -= 10;
        reasons.push('Site atual já é otimizado para dispositivos móveis');
      }
      if (wa.designScore > 70) {
        score -= 10;
        reasons.push('Design do site atual parece satisfatório');
      }
    }

    score = Math.max(0, Math.min(100, score));

    let classification: 'hot' | 'warm' | 'cold' = 'cold';
    if (score >= 80) {
      classification = 'hot';
    } else if (score >= 50) {
      classification = 'warm';
    }

    let suggestion = '';
    if (!lead.hasWebsite) {
      suggestion = 'OFERECER PRIMEIRO SITE';
    } else if (lead.websiteAnalysis && !lead.websiteAnalysis.isMobileFriendly) {
      suggestion = 'OFERECER NOVO SITE RESPONSIVO';
    } else if (lead.websiteAnalysis && lead.websiteAnalysis.performanceScore <= 50) {
      suggestion = 'OFERECER MELHORIA DE PERFORMANCE';
    } else if (score >= 50) {
      suggestion = 'OFERECER REDESIGN';
    } else {
      suggestion = 'LEAD COM BAIXO POTENCIAL';
    }

    return {
      score,
      classification,
      reasons,
      suggestion
    };
  }
}
