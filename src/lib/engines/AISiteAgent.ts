import { SiteSchema, SiteExperienceLevel, SiteSectionSchema, SiteComponentSchema } from '../types/siteBuilder';
import { DEFAULT_DESIGN_SYSTEM } from '../templates/defaultTemplates';

export interface BusinessAnalysis {
  sector: 'barbershop' | 'gastronomy' | 'architecture' | 'health' | 'legal' | 'fitness' | 'retail' | 'general';
  headingFont: string;
  bodyFont: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderRadius: string;
  spacingScale: 'compact' | 'normal' | 'spacious';
  heroImage: string;
  vibeBadge: string;
  tagline: string;
  services: { name: string; price: string; description: string }[];
}

export class AISiteAgent {
  /**
   * Analyzes the business category and metadata to return custom creative direction.
   */
  public static analyzeBusiness(leadData: any): BusinessAnalysis {
    const category = (leadData.category || '').toLowerCase();
    const name = (leadData.name || '').toLowerCase();
    const city = leadData.city || 'São Paulo';
    const state = leadData.state || 'SP';

    // 1. Barbearia & Beauty FIRST (Barbearia, Barbeiro, Salão, Estética, Spa, Visagismo)
    if (
      category.includes('barbearia') ||
      category.includes('barbeiro') ||
      category.includes('estética') ||
      category.includes('salão') ||
      category.includes('spa') ||
      category.includes('beleza') ||
      name.includes('barber') ||
      name.includes('barbearia')
    ) {
      return {
        sector: 'barbershop',
        headingFont: 'Cormorant Garamond, serif',
        bodyFont: 'Inter, sans-serif',
        primaryColor: '#0B0C10',
        accentColor: '#C5A059', // Bronze Gold
        backgroundColor: '#070709',
        surfaceColor: '#141519',
        textColor: '#EAEAEA',
        borderRadius: '0.375rem',
        spacingScale: 'spacious',
        heroImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1600',
        vibeBadge: `HAUTE BARBIER & ATELIER — ${city.toUpperCase()}, ${state.toUpperCase()}`,
        tagline: 'A precisão não é detalhe. É a sua assinatura pessoal.',
        services: [
          { name: 'Corte Autoral Signature', price: 'R$ 120', description: 'Design personalizado com análise visagista e acabamento à navalha.' },
          { name: 'Ritual de Barba com Toalha Quente', price: 'R$ 90', description: 'Hidratação profunda com óleos essenciais e alinhamento impecável.' },
          { name: 'Dia do Noivo & Experiência VIP', price: 'Sob Consulta', description: 'Serviço exclusivo em camarim privativo com degustação de bebidas.' },
          { name: 'Tratamento Capilar & Camuflagem de Grisalhos', price: 'R$ 150', description: 'Revitalização do couro cabeludo e tonalização natural.' },
        ],
      };
    }

    // 2. Gastronomy (Restaurante, Pizzaria, Cafe, Bistro, Confeitaria, Pub)
    if (
      category.includes('restaurante') ||
      category.includes('gourmet') ||
      category.includes('pizzaria') ||
      category.includes('café') ||
      category.includes('bistrô') ||
      (category.includes('bar') && !category.includes('barbearia')) ||
      name.includes('bistrô') ||
      name.includes('restaurante')
    ) {
      return {
        sector: 'gastronomy',
        headingFont: 'Cormorant Garamond, serif',
        bodyFont: 'Inter, sans-serif',
        primaryColor: '#0A0A0A',
        accentColor: '#D4AF37', // Gold
        backgroundColor: '#050505',
        surfaceColor: '#121212',
        textColor: '#F5F5F7',
        borderRadius: '0.25rem',
        spacingScale: 'spacious',
        heroImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1600',
        vibeBadge: `HAUTE CUISINE — ${city.toUpperCase()}, ${state.toUpperCase()}`,
        tagline: 'Sabores autorais, ingredientes selecionados e experiência gastronômica inesquecível.',
        services: [
          { name: 'Menu Degustação Autoral', price: 'Sob Consulta', description: 'Experiência em etapas harmonizada pelo chef executivo.' },
          { name: 'Reserva Exclusiva de Salão', price: 'Sob Consulta', description: 'Espaço privativo para eventos corporativos e celebrações especiais.' },
          { name: 'Carta de Vinhos & Cocktails Signature', price: 'Ver Menu', description: 'Rótulos premiados e mixologia autoral refinada.' },
        ],
      };
    }

    // 3. Architecture & Construction (Arquitetura, Engenharia, Interiores, Imóveis)
    if (
      category.includes('arquitetura') ||
      category.includes('engenharia') ||
      category.includes('interiores') ||
      category.includes('imóveis') ||
      category.includes('construtora') ||
      name.includes('arq')
    ) {
      return {
        sector: 'architecture',
        headingFont: 'Space Grotesk, sans-serif',
        bodyFont: 'Inter, sans-serif',
        primaryColor: '#0F1115',
        accentColor: '#6366F1', // Indigo Accent
        backgroundColor: '#090A0D',
        surfaceColor: '#16181D',
        textColor: '#F3F4F6',
        borderRadius: '0px',
        spacingScale: 'spacious',
        heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
        vibeBadge: `ARQUITETURA & DESIGN — ${city.toUpperCase()}`,
        tagline: 'Espaços atemporais desenhados para elevar a forma de viver e trabalhar.',
        services: [
          { name: 'Projetos Residenciais de Alto Padrão', price: 'Sob Consulta', description: 'Concepção arquitetônica completa do conceito à entrega de chaves.' },
          { name: 'Design de Interiores & Marcenaria', price: 'Sob Consulta', description: 'Curadoria de materiais nobres, iluminação cênica e mobiliário autoral.' },
          { name: 'Projetos Corporativos & Comerciais', price: 'Sob Consulta', description: 'Arquitetura estratégica focada em posicionamento de marca e funcionalidade.' },
        ],
      };
    }

    // 4. Health & Medical (Clínica, Odontologia, Médico, Saúde, Dermatologia)
    if (
      category.includes('clínica') ||
      category.includes('saúde') ||
      category.includes('médico') ||
      category.includes('odontologia') ||
      category.includes('dermatologia') ||
      name.includes('clínica') ||
      name.includes('odonto')
    ) {
      return {
        sector: 'health',
        headingFont: 'Plus Jakarta Sans, sans-serif',
        bodyFont: 'Inter, sans-serif',
        primaryColor: '#08121E',
        accentColor: '#0EA5E9', // Sky Cyan
        backgroundColor: '#040A12',
        surfaceColor: '#0D1B2A',
        textColor: '#F8FAFC',
        borderRadius: '0.75rem',
        spacingScale: 'normal',
        heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600',
        vibeBadge: `MEDICINA & BEM-ESTAR — ${city.toUpperCase()}`,
        tagline: 'Tecnologia avançada e acolhimento humano para a sua saúde integral.',
        services: [
          { name: 'Avaliação Médica Especializada', price: 'Agendar', description: 'Diagnóstico detalhado com equipamentos de alta precisão.' },
          { name: 'Tratamentos Estéticos Avançados', price: 'Agendar', description: 'Procedimentos não invasivos com protocolos de segurança internacional.' },
          { name: 'Acompanhamento Preventivo VIP', price: 'Agendar', description: 'Planos de saúde personalizados e acompanhamento contínuo.' },
        ],
      };
    }

    // 5. Legal & Corporate (Advocacia, Consultoria, Contabilidade, B2B)
    if (
      category.includes('advocacia') ||
      category.includes('advogado') ||
      category.includes('consultoria') ||
      category.includes('contabilidade') ||
      category.includes('jurídico') ||
      name.includes('advogados')
    ) {
      return {
        sector: 'legal',
        headingFont: 'Playfair Display, serif',
        bodyFont: 'Inter, sans-serif',
        primaryColor: '#0B132B',
        accentColor: '#E2C044', // Platinum Gold
        backgroundColor: '#060B18',
        surfaceColor: '#121D3B',
        textColor: '#F1F5F9',
        borderRadius: '0.375rem',
        spacingScale: 'normal',
        heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
        vibeBadge: `ADVOCACIA & CONSULTORIA ESTRATÉGICA — ${city.toUpperCase()}`,
        tagline: 'Segurança jurídica, alta especialização e defesa rigorosa de interesses.',
        services: [
          { name: 'Consultoria Jurídica Empresarial', price: 'Agendar', description: 'Governança corporativa, contratos complexos e proteção patrimonial.' },
          { name: 'Contencioso de Alta Complexidade', price: 'Agendar', description: 'Representação estratégica em litígios cíveis e tributários.' },
          { name: 'Planejamento Sucessório & Holding', price: 'Agendar', description: 'Estruturação patrimonial familiar com eficiência fiscal.' },
        ],
      };
    }

    // 6. Default / General Services
    return {
      sector: 'general',
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      primaryColor: '#0F172A',
      accentColor: '#00D68F', // Emerald
      backgroundColor: '#080E1A',
      surfaceColor: '#131F37',
      textColor: '#F8FAFC',
      borderRadius: '0.5rem',
      spacingScale: 'normal',
      heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600',
      vibeBadge: `${category.toUpperCase()} DE EXCELÊNCIA — ${city.toUpperCase()}, ${state.toUpperCase()}`,
      tagline: 'Atendimento personalizado, máxima eficiência e foco em resultados.',
      services: [
        { name: 'Atendimento Autoral Personalizado', price: 'Consulte', description: 'Soluções feitas sob medida para suas necessidades específicas.' },
        { name: 'Consultoria Exclusiva', price: 'Consulte', description: 'Análise detalhada e acompanhamento dedicado do início ao fim.' },
        { name: 'Suporte & Acompanhamento VIP', price: 'Consulte', description: 'Atendimento prioritário com garantia de excelência.' },
      ],
    };
  }

  /**
   * Generates a complete structured SiteSchema tailored to the analyzed business profile with ALL 7 pre-built pages.
   */
  public static generateFromLead(leadData: any, experienceLevel: SiteExperienceLevel = 'premium'): SiteSchema {
    const analysis = this.analyzeBusiness(leadData);

    const brandName = leadData.name || 'Nova Empresa';
    const category = leadData.category || 'Serviços';
    const city = leadData.city || 'São Paulo';
    const state = leadData.state || 'SP';
    const cleanPhone = leadData.whatsapp || leadData.phone || '5511999999999';

    // Page 1: HOME
    const homeSections: SiteSectionSchema[] = [
      {
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
              badge: analysis.vibeBadge,
              title: brandName,
              subtitle: analysis.tagline,
              description: leadData.opportunitySuggestion || 'Soluções sob medida com atendimento diferenciado e alto padrão de qualidade.',
              ctaText: 'FALAR COM ATENDIMENTO',
              ctaLink: `https://wa.me/55${cleanPhone.replace(/\D/g, '')}`,
              secondaryCtaText: 'CONHECER SERVIÇOS',
              secondaryCtaLink: '#servicos',
              image: analysis.heroImage,
              whatsappNumber: cleanPhone,
            },
            animation: {
              enabled: true,
              type: experienceLevel === 'cinematic' ? 'frame-sequence' : 'fade-up',
              scrub: true,
              start: 'top 80%',
              end: 'bottom 20%',
            },
          },
        ],
      },
      {
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
              title: 'Serviços & Soluções Exclusivas',
              subtitle: 'Conheça nossos diferenciais e rituais de atendimento.',
              items: analysis.services,
            },
          },
        ],
      },
      {
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
              title: 'GARANTA SEU HORÁRIO OU ATENDIMENTO.',
              subtitle: `Entre em contato com ${brandName} e experimente o padrão de excelência.`,
              ctaText: 'AGENDAR VIA WHATSAPP',
              ctaLink: `https://wa.me/55${cleanPhone.replace(/\D/g, '')}`,
              whatsappNumber: cleanPhone,
            },
          },
        ],
      },
    ];

    // Page 2: SOBRE / O ATELIER
    const sobreSections: SiteSectionSchema[] = [
      {
        id: `sec-sobre-hero-${Date.now()}`,
        name: 'Sobre Nossos Valores',
        category: 'about',
        variant: 'HeroSplit',
        components: [
          {
            id: `cmp-sobre-hero-${Date.now()}`,
            name: 'História & Filosofia',
            category: 'about',
            variant: 'HeroSplit',
            props: {
              badge: 'TRADIÇÃO & PROPÓSITO',
              title: `A História por trás da ${brandName}`,
              subtitle: `Fundada em ${city}, nossa marca nasceu com o compromisso inabalável pela qualidade e atendimento diferenciado.`,
              description: 'Combinamos técnicas consolidadas, materiais nobres e uma atmosfera acolhedora projetada para proporcionar momentos únicos.',
              ctaText: 'AGENDAR UMA VISITA',
              ctaLink: `https://wa.me/55${cleanPhone.replace(/\D/g, '')}`,
              image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600',
            },
          },
        ],
      },
    ];

    // Page 3: SERVIÇOS & RITUAIS
    const servicosSections: SiteSectionSchema[] = [
      {
        id: `sec-servicos-full-${Date.now()}`,
        name: 'Menu Completo de Serviços',
        category: 'services',
        variant: 'ServicesInteractive',
        components: [
          {
            id: `cmp-servicos-full-${Date.now()}`,
            name: 'Cardápio de Rituais',
            category: 'services',
            variant: 'ServicesInteractive',
            props: {
              badge: 'MENU DE SERVIÇOS',
              title: 'Experiências Completas & Rituais',
              subtitle: 'Selecione o procedimento desejado e reserve seu horário com nossos mestres.',
              items: analysis.services,
            },
          },
        ],
      },
    ];

    // Page 4: OS MESTRES / EQUIPE
    const equipeSections: SiteSectionSchema[] = [
      {
        id: `sec-equipe-${Date.now()}`,
        name: 'Nossos Profissionais',
        category: 'team',
        variant: 'HeroSplit',
        components: [
          {
            id: `cmp-equipe-${Date.now()}`,
            name: 'Mestres & Especialistas',
            category: 'team',
            variant: 'HeroSplit',
            props: {
              badge: 'EQUIPE DE ELITE',
              title: 'Mestres & Especialistas Dedicados',
              subtitle: 'Nossa equipe conta com profissionais renomados com anos de bagagem internacional.',
              description: 'Atendimento estritamente personalizado e garantia de resultados impecáveis em cada atendimento.',
              ctaText: 'CONHECER ESPECIALISTAS',
              ctaLink: `https://wa.me/55${cleanPhone.replace(/\D/g, '')}`,
              image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1600',
            },
          },
        ],
      },
    ];

    // Page 5: GALERIA & ESPAÇO
    const galeriaSections: SiteSectionSchema[] = [
      {
        id: `sec-galeria-${Date.now()}`,
        name: 'Ambiente & Fotos',
        category: 'gallery',
        variant: 'HeroSplit',
        components: [
          {
            id: `cmp-galeria-${Date.now()}`,
            name: 'Galeria Mosaico',
            category: 'gallery',
            variant: 'HeroSplit',
            props: {
              badge: 'NOSSO ESPAÇO',
              title: 'Um Ambiente Desenhado para o seu Conforto',
              subtitle: 'Arquitetura sofisticada, climatização perfeita e degustação VIP em cada atendimento.',
              image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1600',
            },
          },
        ],
      },
    ];

    // Page 6: DEPOIMENTOS
    const depoimentosSections: SiteSectionSchema[] = [
      {
        id: `sec-depoimentos-${Date.now()}`,
        name: 'Depoimentos de Clientes',
        category: 'testimonials',
        variant: 'HeroSplit',
        components: [
          {
            id: `cmp-depoimentos-${Date.now()}`,
            name: 'Avaliações Google',
            category: 'testimonials',
            variant: 'HeroSplit',
            props: {
              badge: 'CRÍTICA & SOCIAL PROOF',
              title: 'O que Nossos Clientes Dizem',
              subtitle: `Avaliação ${leadData.rating || 4.9} ⭐ no Google com mais de ${leadData.reviewCount || 280} clientes satisfeitos em ${city}.`,
              description: '"Atendimento incomparável. Desde a recepção até a entrega final, o nível de detalhamento e cuidado supera qualquer expectativa."',
              ctaText: 'VER AVALIAÇÕES NO GOOGLE',
              ctaLink: '#',
              image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600',
            },
          },
        ],
      },
    ];

    // Page 7: CONTATO
    const contatoSections: SiteSectionSchema[] = [
      {
        id: `sec-contato-${Date.now()}`,
        name: 'Localização & Contato',
        category: 'contact',
        variant: 'CtaMinimal',
        components: [
          {
            id: `cmp-contato-${Date.now()}`,
            name: 'Contato Direct',
            category: 'contact',
            variant: 'CtaMinimal',
            props: {
              title: `VENHA CONHECER A ${brandName.toUpperCase()}`,
              subtitle: `Endereço: ${leadData.address || `${city} - ${state}`}. WhatsApp: ${cleanPhone}`,
              ctaText: 'CHAMAR NO WHATSAPP AGORA',
              ctaLink: `https://wa.me/55${cleanPhone.replace(/\D/g, '')}`,
              whatsappNumber: cleanPhone,
            },
          },
        ],
      },
    ];

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
        digitalPresence: leadData.digitalPresence,
      },
      experienceLevel,
      status: 'draft',
      subdomain: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designSystem: {
        ...DEFAULT_DESIGN_SYSTEM,
        primaryColor: analysis.primaryColor,
        accentColor: analysis.accentColor,
        backgroundColor: analysis.backgroundColor,
        surfaceColor: analysis.surfaceColor,
        textColor: analysis.textColor,
        headingFont: analysis.headingFont,
        bodyFont: analysis.bodyFont,
        borderRadius: analysis.borderRadius,
        spacingScale: analysis.spacingScale,
      },
      seo: {
        title: `${brandName} — ${category} em ${city}, ${state}`,
        description: `Conheça ${brandName} em ${city}. ${analysis.tagline}`,
        keywords: [category, city, state, brandName],
      },
      assets: [],
      pages: [
        { id: `page-home-${Date.now()}`, title: 'Home', slug: '/', sections: homeSections },
        { id: `page-sobre-${Date.now()}`, title: 'Sobre / O Atelier', slug: '/sobre', sections: sobreSections },
        { id: `page-servicos-${Date.now()}`, title: 'Serviços & Rituais', slug: '/servicos', sections: servicosSections },
        { id: `page-equipe-${Date.now()}`, title: 'Mestres & Equipe', slug: '/equipe', sections: equipeSections },
        { id: `page-galeria-${Date.now()}`, title: 'Galeria & Espaço', slug: '/galeria', sections: galeriaSections },
        { id: `page-depoimentos-${Date.now()}`, title: 'Depoimentos', slug: '/depoimentos', sections: depoimentosSections },
        { id: `page-contato-${Date.now()}`, title: 'Contato & Localização', slug: '/contato', sections: contatoSections },
      ],
    };
  }

  /**
   * Executes a natural language edit command onto an existing SiteSchema.
   */
  public static executeCommand(site: SiteSchema, command: string): SiteSchema {
    const updated = JSON.parse(JSON.stringify(site)) as SiteSchema;
    const cmd = command.toLowerCase().trim();

    // Color Changes
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

    // Experience Level
    if (cmd.includes('cinematográfico') || cmd.includes('cinematic')) {
      updated.experienceLevel = 'cinematic';
    } else if (cmd.includes('experimental') || cmd.includes('3d') || cmd.includes('webgl')) {
      updated.experienceLevel = 'experimental';
    } else if (cmd.includes('premium')) {
      updated.experienceLevel = 'premium';
    } else if (cmd.includes('standard') || cmd.includes('simples')) {
      updated.experienceLevel = 'standard';
    }

    // CTAs
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

    updated.version += 1;
    updated.updatedAt = new Date().toISOString();

    return updated;
  }
}
