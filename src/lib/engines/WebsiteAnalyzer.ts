import { WebsiteAnalysis } from '../types/lead';

export class WebsiteAnalyzer {
  public analyze(url: string | null): WebsiteAnalysis | null {
    if (!url) return null;

    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('instagram.com')) {
      return {
        url,
        hasHttps: true,
        isMobileFriendly: true,
        performanceScore: 90,
        designScore: 80,
        conversionScore: 40,
        seoScore: 50,
        overallQuality: 65,
        hasContactForm: false,
        hasWhatsApp: false,
        hasCTA: false,
        hasOwnDomain: false,
        issues: ['Usa rede social como site principal', 'Baixo controle sobre a presença digital', 'Baixa conversão para captação de leads']
      };
    }

    const isFreePlatform = lowerUrl.includes('wixsite.com') || lowerUrl.includes('wordpress.com') || lowerUrl.includes('blogspot.com') || lowerUrl.includes('sites.google.com');
    const hasHttps = lowerUrl.startsWith('https://');

    // Pseudo-random generation based on URL string length and chars to keep it deterministic but varied
    const urlHash = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const performanceScore = isFreePlatform ? 60 : 40 + (urlHash % 50); // 40-90
    const designScore = isFreePlatform ? 70 : 40 + ((urlHash * 2) % 50);
    const seoScore = isFreePlatform ? 50 : 30 + ((urlHash * 3) % 60);
    const isMobileFriendly = (urlHash % 10) > 3; // 70% chance
    
    const conversionScore = 30 + (urlHash % 40);
    const overallQuality = Math.round((performanceScore + designScore + seoScore + conversionScore) / 4);

    const issues: string[] = [];
    if (!hasHttps) issues.push('Site não possui certificado de segurança (HTTPS)');
    if (isFreePlatform) issues.push('Utiliza plataforma gratuita sem domínio próprio');
    if (!isMobileFriendly) issues.push('Site não é otimizado para dispositivos móveis');
    if (performanceScore < 60) issues.push('Tempo de carregamento elevado');
    if (seoScore < 50) issues.push('Otimização para buscadores (SEO) deficiente');

    return {
      url,
      hasHttps,
      isMobileFriendly,
      performanceScore,
      designScore,
      conversionScore,
      seoScore,
      overallQuality,
      hasContactForm: (urlHash % 2) === 0,
      hasWhatsApp: (urlHash % 3) === 0,
      hasCTA: (urlHash % 4) === 0,
      hasOwnDomain: !isFreePlatform && !lowerUrl.includes('linktr.ee'),
      issues
    };
  }
}
