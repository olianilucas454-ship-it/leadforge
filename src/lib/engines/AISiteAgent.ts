import { SiteSchema, SiteExperienceLevel, SiteSectionSchema, SiteComponentSchema } from '../types/siteBuilder';
import { DEFAULT_DESIGN_SYSTEM } from '../templates/defaultTemplates';

export class AISiteAgent {
  /**
   * Generates a new complete, structured SiteSchema from Lead Data and Experience Level.
   */
  public static generateFromLead(leadData: any, experienceLevel: SiteExperienceLevel = 'premium'): SiteSchema {
    const brandName = leadData.name || 'Nova Empresa';
    const category = leadData.category || 'Serviços';
    const city = leadData.city || 'São Paulo';
    const state = leadData.state || 'SP';
    const cleanPhone = leadData.whatsapp || leadData.phone || '5511999999999';

    // Color accents based on niche category
    let accentColor = '#00D68F'; // Emerald default
    if (category.toLowerCase().includes('barbearia') || category.toLowerCase().includes('gourmet')) {
      accentColor = '#D4AF37'; // Gold
    } else if (category.toLowerCase().includes('arquitetura') || category.toLowerCase().includes('luxo')) {
      accentColor = '#6366F1'; // Indigo
    } else if (category.toLowerCase().includes('clínica') || category.toLowerCase().includes('saúde')) {
      accentColor = '#0EA5E9'; // Cyan
    }

    const heroSection: SiteSectionSchema = {
      id: `sec-hero-${Date.now()}`,
      name: 'Hero Section',
      category: 'hero',
      variant: experienceLevel === 'cinematic' ? 'HeroCinematic' : 'HeroSplit',
      components: [
        {
          id: `cmp-hero-${Date.now()}`,
          name: 'Hero Component',
          category: 'hero',
          variant: experienceLevel === 'cinematic' ? 'HeroCinematic' : 'HeroSplit',
          props: {
            badge: `${category.toUpperCase()} — ${city.toUpperCase()}, ${state.toUpperCase()}`,
            title: `A excelência em ${category.toLowerCase()} que sua presença merece.`,
            subtitle: 'Tradição, atendimento personalizado e ambiente exclusivo.',
            description: leadData.opportunitySuggestion || 'Oferecemos soluções sob medida com atendimento diferenciado e alta precisão.',
            ctaText: 'AGENDAR PELO WHATSAPP',
            ctaLink: `https://wa.me/55${cleanPhone.replace(/\D/g, '')}`,
            secondaryCtaText: 'CONHECER SERVIÇOS',
            secondaryCtaLink: '#servicos',
            image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1600',
            whatsappNumber: cleanPhone,
          },
          animation: {
            enabled: true,
            type: experienceLevel === 'cinematic' ? 'frame-sequence' : 'fade-up',
            scrub: experienceLevel === 'cinematic' || experienceLevel === 'premium',
            start: 'top 80%',
            end: 'bottom 20%',
          },
        },
      ],
    };

    const servicesSection: SiteSectionSchema = {
      id: `sec-serv-${Date.now()}`,
      name: 'Serviços & Especialidades',
      category: 'services',
      variant: 'ServicesInteractive',
      components: [
        {
          id: `cmp-serv-${Date.now()}`,
          name: 'Lista de Serviços',
          category: 'services',
          variant: 'ServicesInteractive',
          props: {
            badge: 'ESPECIALIDADES',
            title: 'Serviços & Experiências Exclusivas',
            subtitle: 'Conheça nossos rituais e soluções dedicadas.',
            items: [
              { name: 'Atendimento Premium Autoral', price: 'Consulte', description: 'Experiência completa e personalizada com horário reservado.' },
              { name: 'Consultoria & Diagnóstico Especializado', price: 'Consulte', description: 'Análise detalhada de necessidades e acompanhamento individual.' },
              { name: 'Pacote Executivo Signature', price: 'Consulte', description: 'Tratamento de alto padrão com amenidades e conforto total.' },
            ],
          },
        },
      ],
    };

    const ctaSection: SiteSectionSchema = {
      id: `sec-cta-${Date.now()}`,
      name: 'Chamada Final',
      category: 'cta',
      variant: 'CtaMinimal',
      components: [
        {
          id: `cmp-cta-${Date.now()}`,
          name: 'CTA Block',
          category: 'cta',
          variant: 'CtaMinimal',
          props: {
            title: 'SEU PRÓXIMO ATENDIMENTO COMEÇA AQUI.',
            subtitle: 'Garanta seu horário reservado e experimente o padrão de excelência.',
            ctaText: 'AGENDAR HORÁRIO VIA WHATSAPP',
            ctaLink: `https://wa.me/55${cleanPhone.replace(/\D/g, '')}`,
            whatsappNumber: cleanPhone,
          },
        },
      ],
    };

    return {
      id: `site-${Date.now()}`,
      name: `Site — ${brandName}`,
      clientName: brandName,
      leadId: leadData.id,
      leadData: {
        name: brandName,
        category,
        city,
        state,
        phone: leadData.phone,
        whatsapp: leadData.whatsapp,
        address: leadData.address,
        rating: leadData.rating,
        reviewCount: leadData.reviewCount,
      },
      experienceLevel,
      status: 'draft',
      subdomain: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designSystem: {
        ...DEFAULT_DESIGN_SYSTEM,
        accentColor,
      },
      seo: {
        title: `${brandName} — ${category} em ${city}, ${state}`,
        description: `Conheça ${brandName} em ${city}. Experiência exclusiva em ${category}.`,
        keywords: [category, city, state, brandName],
      },
      assets: [],
      pages: [
        {
          id: `page-home-${Date.now()}`,
          title: 'Home',
          slug: '/',
          sections: [heroSection, servicesSection, ctaSection],
        },
      ],
    };
  }

  /**
   * Executes a natural language edit command onto an existing SiteSchema granually.
   */
  public static executeCommand(site: SiteSchema, command: string): SiteSchema {
    const updated = JSON.parse(JSON.stringify(site)) as SiteSchema;
    const cmd = command.toLowerCase().trim();

    // 1. Color Changes
    if (cmd.includes('vinho') || cmd.includes('bordo') || cmd.includes('vermelho')) {
      updated.designSystem.accentColor = '#8B0000';
    } else if (cmd.includes('dourado') || cmd.includes('ouro') || cmd.includes('gold')) {
      updated.designSystem.accentColor = '#D4AF37';
    } else if (cmd.includes('azul') || cmd.includes('blue')) {
      updated.designSystem.accentColor = '#0EA5E9';
    } else if (cmd.includes('verde') || cmd.includes('emerald')) {
      updated.designSystem.accentColor = '#00D68F';
    } else if (cmd.includes('roxo') || cmd.includes('indigo')) {
      updated.designSystem.accentColor = '#6366F1';
    }

    // 2. Experience Level Command
    if (cmd.includes('cinematográfico') || cmd.includes('cinematic')) {
      updated.experienceLevel = 'cinematic';
    } else if (cmd.includes('experimental') || cmd.includes('3d') || cmd.includes('webgl')) {
      updated.experienceLevel = 'experimental';
    } else if (cmd.includes('premium')) {
      updated.experienceLevel = 'premium';
    } else if (cmd.includes('standard') || cmd.includes('simples')) {
      updated.experienceLevel = 'standard';
    }

    // 3. CTA Buttons size or text
    if (cmd.includes('botão') || cmd.includes('cta')) {
      updated.pages.forEach((page) => {
        page.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            if (cmd.includes('maior') || cmd.includes('grande')) {
              cmp.styleOverrides = { ...cmp.styleOverrides, fontSize: '1.125rem', padding: '1.25rem 2.5rem' };
            }
            if (cmd.includes('whatsapp') && !cmp.props.whatsappNumber && updated.leadData?.whatsapp) {
              cmp.props.whatsappNumber = updated.leadData.whatsapp;
              cmp.props.ctaText = 'FALAR NO WHATSAPP';
            }
          });
        });
      });
    }

    // Increment version
    updated.version += 1;
    updated.updatedAt = new Date().toISOString();

    return updated;
  }
}
