import { SiteSchema, QualityAuditResult, AuditIssue } from '../types/siteBuilder';

export class QualityAuditEngine {
  public static audit(site: SiteSchema): QualityAuditResult {
    const issues: AuditIssue[] = [];

    let designScore = 95;
    let uxScore = 92;
    let mobileScore = 96;
    let performanceScore = 90;
    let seoScore = 88;
    let accessibilityScore = 92;
    let conversionScore = 89;

    // 1. Check SEO Title & Description
    if (!site.seo.title || site.seo.title.length < 10) {
      seoScore -= 15;
      issues.push({
        id: 'seo-title-short',
        category: 'seo',
        severity: 'critical',
        title: 'Título SEO incompleto',
        description: 'O título das páginas do site precisa ter pelo menos 10 caracteres para indexação no Google.',
        autoFixable: true,
      });
    }

    if (!site.seo.description || site.seo.description.length < 30) {
      seoScore -= 10;
      issues.push({
        id: 'seo-desc-short',
        category: 'seo',
        severity: 'warning',
        title: 'Descrição Meta SEO ausente ou curta',
        description: 'Uma descrição de 50 a 160 caracteres aumenta significativamente a taxa de clique no Google.',
        autoFixable: true,
      });
    }

    // 2. Check Conversion & CTAs
    const allSections = site.pages.flatMap((p) => p.sections);
    const allComponents = allSections.flatMap((s) => s.components);
    const hasCTA = allComponents.some(
      (c) => c.category === 'cta' || c.props.ctaText || c.props.whatsappNumber
    );

    if (!hasCTA) {
      conversionScore -= 25;
      issues.push({
        id: 'conv-no-cta',
        category: 'conversion',
        severity: 'critical',
        title: 'Sem botão principal de Chamada para Ação (CTA)',
        description: 'O site não possui botão de reserva ou WhatsApp visível. Adicione uma chamada direta para conversão.',
        autoFixable: true,
      });
    }

    // 3. Check Mobile Responsiveness
    const hasHeavyAnimationOnMobile = allComponents.some(
      (c) => c.frameSequence?.enabled && !c.hiddenOnMobile
    );

    if (hasHeavyAnimationOnMobile) {
      mobileScore -= 10;
      performanceScore -= 12;
      issues.push({
        id: 'mobile-heavy-anim',
        category: 'mobile',
        severity: 'warning',
        title: 'Animação pesada no Mobile detectada',
        description: 'Sequência de frames ou vídeo 4K ativa no mobile sem otimização de banda.',
        autoFixable: true,
      });
    }

    // Calculate Overall Weighted Score
    const overallScore = Math.round(
      (designScore + uxScore + mobileScore + performanceScore + seoScore + accessibilityScore + conversionScore) / 7
    );

    return {
      overallScore,
      scores: {
        design: Math.max(0, designScore),
        ux: Math.max(0, uxScore),
        mobile: Math.max(0, mobileScore),
        performance: Math.max(0, performanceScore),
        seo: Math.max(0, seoScore),
        accessibility: Math.max(0, accessibilityScore),
        conversion: Math.max(0, conversionScore),
      },
      issues,
    };
  }

  public static autoFix(site: SiteSchema): SiteSchema {
    const updated = JSON.parse(JSON.stringify(site)) as SiteSchema;

    // Fix SEO Title
    if (!updated.seo.title || updated.seo.title.length < 10) {
      updated.seo.title = `${updated.name} — ${updated.seo.description ? updated.seo.description.substring(0, 40) : 'Experiência Web Exclusiva'}`;
    }

    // Fix SEO Description
    if (!updated.seo.description || updated.seo.description.length < 30) {
      updated.seo.description = `Conheça ${updated.name}. Experiência digital contemporânea de alto padrão com atendimento exclusivo.`;
    }

    // Ensure WhatsApp CTA is present if lead data is available
    const hasCTA = updated.pages.some((p) =>
      p.sections.some((s) => s.components.some((c) => c.category === 'cta' || c.props.ctaText))
    );

    if (!hasCTA && updated.pages.length > 0) {
      updated.pages[0].sections.push({
        id: `sec-autofix-cta-${Date.now()}`,
        name: 'Chamada para Ação',
        category: 'cta',
        variant: 'CtaMinimal',
        components: [
          {
            id: `cmp-autofix-cta-${Date.now()}`,
            name: 'CTA Principal',
            category: 'cta',
            variant: 'CtaMinimal',
            props: {
              title: 'Pronto para transformar sua experiência?',
              subtitle: 'Fale diretamente com nossa equipe pelo WhatsApp.',
              ctaText: 'FALAR COM CONSULTOR AGORA',
              ctaLink: updated.leadData?.whatsapp
                ? `https://wa.me/55${updated.leadData.whatsapp.replace(/\D/g, '')}`
                : '#contato',
              whatsappNumber: updated.leadData?.whatsapp || '5511999999999',
            },
          },
        ],
      });
    }

    return updated;
  }
}
