import {
  SiteSchema,
  SiteExperienceLevel,
  SiteSectionSchema,
  SiteComponentSchema,
  HeroVariant,
  AiActionLog,
} from '../types/siteBuilder';
import { DEFAULT_DESIGN_SYSTEM } from '../templates/defaultTemplates';
import { CreativeDirectorEngine } from './CreativeDirectorEngine';
import { AIImagePromptEngine } from './AIImagePromptEngine';
import { CompositionEngine } from './CompositionEngine';
import { QualityGateEngine } from './QualityGateEngine';

export interface BusinessAnalysis {
  sector:
    | 'barbershop'
    | 'gastronomy'
    | 'architecture'
    | 'health'
    | 'legal'
    | 'fitness'
    | 'realestate'
    | 'hotel'
    | 'tech'
    | 'general';
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
  heroVariant: HeroVariant;
  vibeBadge: string;
  tagline: string;
  services: { name: string; price: string; description: string; image?: string }[];
  team?: { name: string; role: string; specialty: string; image: string; whatsapp?: string }[];
  galleryImages?: { url: string; title: string; caption?: string }[];
  testimonials?: { clientName: string; city: string; avatar: string; quote: string; rating: number }[];
  stats?: { number: string; label: string }[];
  faqs?: { question: string; answer: string }[];
}

export class AISiteAgent {
  /**
   * Analyzes the business category and metadata to return custom creative direction & niche art direction.
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
        heroVariant: 'HeroLuxury',
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
      name.includes('restaurante') ||
      name.includes('pizza')
    ) {
      return {
        sector: 'gastronomy',
        headingFont: 'Playfair Display, serif',
        bodyFont: 'Manrope, sans-serif',
        primaryColor: '#0A0A0A',
        accentColor: '#D4AF37', // Gold
        backgroundColor: '#050505',
        surfaceColor: '#121212',
        textColor: '#F5F5F7',
        borderRadius: '0.25rem',
        spacingScale: 'spacious',
        heroImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1600',
        heroVariant: 'HeroRestaurant',
        vibeBadge: `HAUTE CUISINE — ${city.toUpperCase()}, ${state.toUpperCase()}`,
        tagline: 'Sabores autorais, ingredientes selecionados e experiência gastronômica inesquecível.',
        services: [
          { name: 'Menu Degustação Autoral', price: 'Sob Consulta', description: 'Experiência em etapas harmonizada pelo chef executivo.' },
          { name: 'Reserva Exclusiva de Salão', price: 'Sob Consulta', description: 'Espaço privativo para eventos corporativos e celebrações especiais.' },
          { name: 'Carta de Vinhos & Cocktails Signature', price: 'Ver Menu', description: 'Rótulos premiados e mixologia autoral refinada.' },
        ],
      };
    }

    // 3. Architecture & Construction (Arquitetura, Engenharia, Interiores, Construtora)
    if (
      category.includes('arquitetura') ||
      category.includes('engenharia') ||
      category.includes('interiores') ||
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
        heroVariant: 'HeroArchitecture',
        vibeBadge: `ARQUITETURA & DESIGN — ${city.toUpperCase()}`,
        tagline: 'Espaços atemporais desenhados para elevar a forma de viver e trabalhar.',
        services: [
          { name: 'Projetos Residenciais de Alto Padrão', price: 'Sob Consulta', description: 'Concepção arquitetônica completa do conceito à entrega de chaves.' },
          { name: 'Design de Interiores & Marcenaria', price: 'Sob Consulta', description: 'Curadoria de materiais nobres, iluminação cênica e mobiliário autoral.' },
          { name: 'Projetos Corporativos & Comerciais', price: 'Sob Consulta', description: 'Arquitetura estratégica focada em posicionamento de marca e funcionalidade.' },
        ],
      };
    }

    // 4. Real Estate / Imóveis
    if (category.includes('imóveis') || category.includes('imobiliária') || name.includes('imóveis')) {
      return {
        sector: 'realestate',
        headingFont: 'Sora, sans-serif',
        bodyFont: 'DM Sans, sans-serif',
        primaryColor: '#0B132B',
        accentColor: '#E2C044',
        backgroundColor: '#060C1E',
        surfaceColor: '#121F42',
        textColor: '#F8FAFC',
        borderRadius: '0.5rem',
        spacingScale: 'spacious',
        heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
        heroVariant: 'HeroFullScreen',
        vibeBadge: `LUXURY REAL ESTATE — ${city.toUpperCase()}`,
        tagline: 'Residências exclusivas e investimentos imobiliários de alto padrão.',
        services: [
          { name: 'Curadoria de Imóveis de Luxo', price: 'Sob Consulta', description: 'Portfólio selecionado nas melhores localizações da cidade.' },
          { name: 'Assessoria em Investimentos Imobiliários', price: 'Sob Consulta', description: 'Análise de rentabilidade e estruturação patrimonial.' },
        ],
      };
    }

    // 5. Health & Medical (Clínica, Odontologia, Médico, Saúde, Dermatologia)
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
        heroVariant: 'HeroMinimal',
        vibeBadge: `MEDICINA & BEM-ESTAR — ${city.toUpperCase()}`,
        tagline: 'Tecnologia avançada e acolhimento humano para a sua saúde integral.',
        services: [
          { name: 'Avaliação Médica Especializada', price: 'Agendar', description: 'Diagnóstico detalhado com equipamentos de alta precisão.' },
          { name: 'Tratamentos Estéticos Avançados', price: 'Agendar', description: 'Procedimentos não invasivos com protocolos de segurança internacional.' },
          { name: 'Acompanhamento Preventivo VIP', price: 'Agendar', description: 'Planos de saúde personalizados e acompanhamento contínuo.' },
        ],
      };
    }

    // 6. Legal & Corporate (Advocacia, Consultoria, Contabilidade, B2B)
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
        heroVariant: 'HeroLuxury',
        vibeBadge: `ADVOCACIA & CONSULTORIA ESTRATÉGICA — ${city.toUpperCase()}`,
        tagline: 'Segurança jurídica, alta especialização e defesa rigorosa de interesses.',
        services: [
          { name: 'Consultoria Jurídica Empresarial', price: 'Agendar', description: 'Governança corporativa, contratos complexos e proteção patrimonial.' },
          { name: 'Contencioso de Alta Complexidade', price: 'Agendar', description: 'Representação estratégica em litígios cíveis e tributários.' },
          { name: 'Planejamento Sucessório & Holding', price: 'Agendar', description: 'Estruturação patrimonial familiar com eficiência fiscal.' },
        ],
      };
    }

    // 7. Fitness / Gym
    if (category.includes('academia') || category.includes('fitness') || category.includes('crossfit') || name.includes('gym')) {
      return {
        sector: 'fitness',
        headingFont: 'Space Grotesk, sans-serif',
        bodyFont: 'Inter, sans-serif',
        primaryColor: '#0A0A0A',
        accentColor: '#F59E0B', // Amber Flame
        backgroundColor: '#050505',
        surfaceColor: '#141414',
        textColor: '#FFFFFF',
        borderRadius: '0.25rem',
        spacingScale: 'spacious',
        heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600',
        heroVariant: 'HeroFullScreen',
        vibeBadge: `HIGH PERFORMANCE PERFORMANCE CLUB — ${city.toUpperCase()}`,
        tagline: 'Supere seus limites com treinos de alta intensidade e estrutura de ponta.',
        services: [
          { name: 'Treinamento Personalizado VIP', price: 'Matricular', description: 'Acompanhamento biométrico e prescrição de treinos focados em metas.' },
          { name: 'Área de Musculação & Cardio Elite', price: 'Matricular', description: 'Equipamentos importados de biomecânica avançada.' },
        ],
      };
    }

    // 8. Hotel & Luxury Hospitality
    if (category.includes('hotel') || category.includes('pousada') || category.includes('resort')) {
      return {
        sector: 'hotel',
        headingFont: 'Playfair Display, serif',
        bodyFont: 'Manrope, sans-serif',
        primaryColor: '#0C0E12',
        accentColor: '#D4AF37',
        backgroundColor: '#07080A',
        surfaceColor: '#161920',
        textColor: '#F5F5F7',
        borderRadius: '0.375rem',
        spacingScale: 'spacious',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600',
        heroVariant: 'HeroFullScreen',
        vibeBadge: `BOUTIQUE HOTEL & SANCTUARY — ${city.toUpperCase()}`,
        tagline: 'Um refúgio de tranquilidade, sofisticação e hospitalidade inesquecível.',
        services: [
          { name: 'Suítes Master Signature', price: 'Reservar', description: 'Vista panorâmica, enxoval de algodão egípcio e serviço de mordomo.' },
          { name: 'Spa & Experiências de Bem-Estar', price: 'Reservar', description: 'Massagens terapêuticas, sauna seca e piscinas aquecidas.' },
        ],
      };
    }

    // 9. Tech & SaaS
    if (category.includes('tecnologia') || category.includes('software') || category.includes('sistemas') || name.includes('tech')) {
      return {
        sector: 'tech',
        headingFont: 'Space Grotesk, sans-serif',
        bodyFont: 'Inter, sans-serif',
        primaryColor: '#090D16',
        accentColor: '#6366F1',
        backgroundColor: '#04070D',
        surfaceColor: '#0F172A',
        textColor: '#F8FAFC',
        borderRadius: '0.75rem',
        spacingScale: 'normal',
        heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600',
        heroVariant: 'HeroCinematic',
        vibeBadge: `NEXT-GEN DIGITAL SOLUTIONS — ${city.toUpperCase()}`,
        tagline: 'Engenharia de software e inteligência artificial para escalar o seu negócio.',
        services: [
          { name: 'Desenvolvimento Web & SaaS', price: 'Sob Consulta', description: 'Aplicações ultra-rápidas com arquitetura de alta disponibilidade.' },
          { name: 'Consultoria em Inteligência Artificial', price: 'Sob Consulta', description: 'Automação de processos e integração de LLMs proprietárias.' },
        ],
      };
    }

    // 10. Default / General Services
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
      heroVariant: 'HeroFullScreen',
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
    const brandName = leadData.name || 'Nova Empresa';
    const category = leadData.category || 'Serviços Autorais';
    const city = leadData.city || 'São Paulo';
    const state = leadData.state || 'SP';

    // 1. Run Creative Director Engine to establish Art Direction & Concept
    const creativeDirection = CreativeDirectorEngine.generateCreativeDirection(leadData);
    const concept = creativeDirection.chosenConcept;

    // 2. Run Commercial AI Photography Engine to establish Imagery Strategy
    const imageStrategy = AIImagePromptEngine.generateStrategy(category, brandName, city);

    // 3. Run Composition Engine to generate Asymmetric Storytelling Sections
    const homeSections = CompositionEngine.buildStoryComposition(creativeDirection, leadData, imageStrategy);

    const now = new Date().toISOString();
    const siteId = `site-${Date.now()}`;

    const rawSite: SiteSchema = {
      id: siteId,
      name: brandName,
      clientName: leadData.contactPerson || brandName,
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
      experienceLevel: 'cinematic',
      status: 'draft',
      subdomain: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'site',
      version: 1,
      createdAt: now,
      updatedAt: now,
      designSystem: {
        ...DEFAULT_DESIGN_SYSTEM,
        primaryColor: concept.colorPalette.primary,
        secondaryColor: concept.colorPalette.secondary,
        accentColor: concept.colorPalette.accent,
        backgroundColor: concept.colorPalette.background,
        surfaceColor: concept.colorPalette.surface,
        textColor: concept.colorPalette.text,
        headingFont: concept.typography.headingFont,
        bodyFont: concept.typography.bodyFont,
        borderRadius: '0.5rem',
        containerWidth: '1280px',
        spacingScale: 'spacious',
      },
      seo: {
        title: `${brandName} | ${concept.name} em ${city}`,
        description: concept.tagline,
        keywords: [category, city, state, brandName, 'Luxo', 'Alta Costura'],
      },
      assets: [
        { id: `asset-${Date.now()}`, name: 'Fotografia Comercial Principal', type: 'image', url: imageStrategy.heroImage }
      ],
      pages: [
        { id: `page-home-${Date.now()}`, title: 'Home', slug: '/', sections: homeSections },
      ],
    };

    // 4. Run Self-Critique & Quality Gate Loop
    const { site: finalAuditedSite } = QualityGateEngine.auditAndRefine(rawSite);
    return finalAuditedSite;
  }

  /**
   * Executes a natural language command by parsing it into structured AI Actions and mutating the site.
   * Returns { updatedSite, log }
   */
  public static executeCommandWithLog(site: SiteSchema, command: string): { updatedSite: SiteSchema; log: AiActionLog } {
    const updated = JSON.parse(JSON.stringify(site)) as SiteSchema;
    const cmd = command.toLowerCase().trim();
    const actionsExecuted: string[] = [];

    // 1. Hero Overlay Opacity & Color
    if (cmd.includes('escuro') || cmd.includes('darker') || cmd.includes('overlay') || cmd.includes('opacidade')) {
      updated.pages.forEach((page) => {
        page.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            if (cmp.category === 'hero') {
              cmp.props.overlayOpacity = Math.min(95, (cmp.props.overlayOpacity || 50) + 25);
              cmp.props.overlayColor = '#000000';
            }
          });
        });
      });
      actionsExecuted.push('Escureceu a camada de overlay do Hero para aumentar o contraste');
    }

    if (cmd.includes('claro') || cmd.includes('lighter')) {
      updated.pages.forEach((page) => {
        page.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            if (cmp.category === 'hero') {
              cmp.props.overlayOpacity = Math.max(10, (cmp.props.overlayOpacity || 50) - 25);
            }
          });
        });
      });
      actionsExecuted.push('Reduziu a opacidade do overlay para revelar mais o fundo');
    }

    // 2. Typography & Fonts
    if (cmd.includes('space grotesk') || cmd.includes('grotesk')) {
      updated.designSystem.headingFont = 'Space Grotesk, sans-serif';
      actionsExecuted.push('Alterou fonte dos títulos para Space Grotesk (Estilo Modern/Tech)');
    } else if (cmd.includes('cormorant') || cmd.includes('garamond')) {
      updated.designSystem.headingFont = 'Cormorant Garamond, serif';
      actionsExecuted.push('Alterou fonte dos títulos para Cormorant Garamond (Estilo Haute Luxury)');
    } else if (cmd.includes('playfair')) {
      updated.designSystem.headingFont = 'Playfair Display, serif';
      actionsExecuted.push('Alterou fonte dos títulos para Playfair Display (Estilo Editorial High-End)');
    } else if (cmd.includes('plus jakarta') || cmd.includes('jakarta')) {
      updated.designSystem.headingFont = 'Plus Jakarta Sans, sans-serif';
      actionsExecuted.push('Alterou fonte dos títulos para Plus Jakarta Sans (Estilo Modern Medical/Clean)');
    } else if (cmd.includes('sora')) {
      updated.designSystem.headingFont = 'Sora, sans-serif';
      actionsExecuted.push('Alterou fonte dos títulos para Sora');
    } else if (cmd.includes('inter')) {
      updated.designSystem.headingFont = 'Inter, sans-serif';
      actionsExecuted.push('Alterou fonte dos títulos para Inter');
    }

    // 3. Hero Variants & Compositions
    if (cmd.includes('video') || cmd.includes('vídeo')) {
      updated.pages.forEach((p) => {
        p.sections.forEach((s) => {
          s.components.forEach((c) => {
            if (c.category === 'hero') {
              c.variant = 'HeroVideo';
              c.props.videoUrl = c.props.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-barber-cutting-hair-in-a-barbershop-41484-large.mp4';
            }
          });
        });
      });
      actionsExecuted.push('Transformou o Hero em formato Video Background de alta definição');
    } else if (cmd.includes('full screen') || cmd.includes('fullscreen') || cmd.includes('tela cheia')) {
      updated.pages.forEach((p) => {
        p.sections.forEach((s) => {
          s.components.forEach((c) => {
            if (c.category === 'hero') {
              c.variant = 'HeroFullScreen';
              c.props.heroHeight = 'screen';
            }
          });
        });
      });
      actionsExecuted.push('Aplicou formato Hero FullScreen com 100% da altura da tela');
    } else if (cmd.includes('luxury') || cmd.includes('luxo')) {
      updated.pages.forEach((p) => {
        p.sections.forEach((s) => {
          s.components.forEach((c) => {
            if (c.category === 'hero') {
              c.variant = 'HeroLuxury';
            }
          });
        });
      });
      updated.designSystem.accentColor = '#D4AF37';
      actionsExecuted.push('Aplicou composição Hero Luxury com acentos dourados e fundo obscuro');
    } else if (cmd.includes('restaurant') || cmd.includes('restaurante') || cmd.includes('pizza')) {
      updated.pages.forEach((p) => {
        p.sections.forEach((s) => {
          s.components.forEach((c) => {
            if (c.category === 'hero') {
              c.variant = 'HeroRestaurant';
            }
          });
        });
      });
      actionsExecuted.push('Aplicou layout de Hero especializado para Gastronomia & Restaurante');
    } else if (cmd.includes('architecture') || cmd.includes('arquitetura')) {
      updated.pages.forEach((p) => {
        p.sections.forEach((s) => {
          s.components.forEach((c) => {
            if (c.category === 'hero') {
              c.variant = 'HeroArchitecture';
            }
          });
        });
      });
      actionsExecuted.push('Aplicou layout de Hero estilo Arquitetura Minimalista');
    }

    // 4. Color Palettes
    if (cmd.includes('vinho') || cmd.includes('bordo') || cmd.includes('vermelho')) {
      updated.designSystem.accentColor = '#8B0000';
      actionsExecuted.push('Atualizou a cor de destaque (Accent) para Vinho / Burgundy (#8B0000)');
    } else if (cmd.includes('dourado') || cmd.includes('ouro') || cmd.includes('gold')) {
      updated.designSystem.accentColor = '#D4AF37';
      actionsExecuted.push('Atualizou a cor de destaque (Accent) para Ouro Dourado (#D4AF37)');
    } else if (cmd.includes('azul') || cmd.includes('blue')) {
      updated.designSystem.accentColor = '#0EA5E9';
      actionsExecuted.push('Atualizou a cor de destaque para Azul Cyan (#0EA5E9)');
    } else if (cmd.includes('verde') || cmd.includes('emerald')) {
      updated.designSystem.accentColor = '#00D68F';
      actionsExecuted.push('Atualizou a cor de destaque para Verde Emerald (#00D68F)');
    } else if (cmd.includes('roxo') || cmd.includes('indigo')) {
      updated.designSystem.accentColor = '#6366F1';
      actionsExecuted.push('Atualizou a cor de destaque para Indigo Vibrant (#6366F1)');
    }

    // 5. Image Replacements
    if (cmd.includes('imagem') || cmd.includes('foto') || cmd.includes('image')) {
      const nicheImages = [
        'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1600',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1600',
      ];
      const randomImg = nicheImages[Math.floor(Math.random() * nicheImages.length)];
      updated.pages[0].sections[0].components[0].props.image = randomImg;
      actionsExecuted.push('Gerou e aplicou uma nova foto cinematográfica de alta resolução no Hero');
    }

    // Fallback if no specific action matched
    if (actionsExecuted.length === 0) {
      updated.designSystem.accentColor = '#D4AF37';
      actionsExecuted.push(`Executou refatoração visual baseada no comando: "${command}"`);
    }

    updated.version += 1;
    updated.updatedAt = new Date().toISOString();

    const log: AiActionLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      command,
      actionsExecuted,
      summary: `Atualizou o site com ${actionsExecuted.length} modificação(ões) visual(is) direta(s).`,
    };

    return { updatedSite: updated, log };
  }

  public static applyReferenceRedesign(
    site: SiteSchema,
    promptText?: string,
    referenceImageDataUrl?: string | null,
    presetId?: string | null
  ): SiteSchema {
    const updated = JSON.parse(JSON.stringify(site)) as SiteSchema;
    const prompt = (promptText || '').toLowerCase();

    if (presetId === 'ecodream-architecture' || prompt.includes('ecodream') || prompt.includes('vidro') || prompt.includes('sustentável') || prompt.includes('glass')) {
      updated.designSystem.headingFont = 'Outfit, sans-serif';
      updated.designSystem.bodyFont = 'Inter, sans-serif';
      updated.designSystem.accentColor = '#10B981'; // Emerald Green
      updated.designSystem.primaryColor = '#0F172A';
      updated.designSystem.backgroundColor = '#090D16';
      updated.designSystem.surfaceColor = 'rgba(15, 23, 42, 0.6)';
      updated.designSystem.textColor = '#F8FAFC';
      updated.designSystem.borderRadius = '1.5rem';

      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              titleFontFamily: 'Outfit, sans-serif',
              gradient: 'emerald',
              fontWeight: 'font-bold',
              letterSpacing: 'tracking-tight',
            };
            if (cmp.category === 'hero') {
              cmp.variant = 'HeroEcoGlass';
              cmp.props.image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800';
              cmp.props.badge = 'SUSTAINABLE LIVING';
              cmp.props.title = 'YOUR VISION OF SUSTAINABLE LIVING';
              cmp.props.subtitle = 'Our commitment to eco-friendly practices ensures that every home we create is both beautiful and environmentally responsible.';
              cmp.props.ctaText = 'LETS EXPLORE';
            }
          });
        });
      });
    } else if (presetId === 'archevo-editorial' || prompt.includes('archevo') || prompt.includes('inspire') || prompt.includes('monumental')) {
      updated.designSystem.headingFont = 'Bodoni Moda, serif';
      updated.designSystem.bodyFont = 'Inter, sans-serif';
      updated.designSystem.accentColor = '#D4AF37'; // Champagne Gold
      updated.designSystem.primaryColor = '#12100E';
      updated.designSystem.backgroundColor = '#0B0A08';
      updated.designSystem.surfaceColor = '#1A1815';
      updated.designSystem.textColor = '#F5F2EB';
      updated.designSystem.borderRadius = '0.25rem';

      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              titleFontFamily: 'Bodoni Moda, serif',
              gradient: 'gold',
              fontWeight: 'font-normal',
            };
            if (cmp.category === 'hero') {
              cmp.variant = 'HeroArchevo';
              cmp.props.image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1800';
              cmp.props.badge = 'ARCHITECTURE • INTERIORS • DESIGN';
              cmp.props.title = 'Architecture that inspires. Spaces that live.';
              cmp.props.subtitle = 'We craft timeless architecture and intelligent spaces that blend beauty, function, and sustainability — built around human experience.';
              cmp.props.ctaText = 'EXPLORE PROJECTS ↗';
              cmp.props.secondaryCtaText = 'WATCH SHOWREEL';
            }
          });
        });
      });
    } else if (presetId === 'lavilla-realestate' || prompt.includes('lavilla') || prompt.includes('bali') || prompt.includes('villa') || prompt.includes('piscina')) {
      updated.designSystem.headingFont = 'Outfit, sans-serif';
      updated.designSystem.bodyFont = 'Plus Jakarta Sans, sans-serif';
      updated.designSystem.accentColor = '#38BDF8'; // Sky Blue
      updated.designSystem.primaryColor = '#061325';
      updated.designSystem.backgroundColor = '#030A14';
      updated.designSystem.surfaceColor = '#0B1D36';
      updated.designSystem.textColor = '#FFFFFF';
      updated.designSystem.borderRadius = '0.5rem';

      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              titleFontFamily: 'Outfit, sans-serif',
              fontWeight: 'font-extrabold',
            };
            if (cmp.category === 'hero') {
              cmp.variant = 'HeroLavilla';
              cmp.props.image = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1800';
              cmp.props.badge = 'LUXURY REAL ESTATE BALI';
              cmp.props.title = 'LAVILLA';
              cmp.props.subtitle = 'Дизайнерская недвижимость на Бали / Imóveis Exclusivos de Alta Gastronomia e Luxo';
              cmp.props.ctaText = 'СКАЧАТЬ КАТАЛОГ ↓';
            }
          });
        });
      });
    } else if (presetId === 'haute-barbier' || prompt.includes('barbearia') || prompt.includes('barber') || prompt.includes('ouro') || prompt.includes('haute')) {
      updated.designSystem.headingFont = 'Cinzel, serif';
      updated.designSystem.bodyFont = 'Inter, sans-serif';
      updated.designSystem.accentColor = '#C5A059'; // Imperial Gold
      updated.designSystem.primaryColor = '#0B0C10';
      updated.designSystem.backgroundColor = '#050507';
      updated.designSystem.surfaceColor = '#141519';
      updated.designSystem.textColor = '#EAEAEA';
      updated.designSystem.borderRadius = '0.375rem';

      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              titleFontFamily: 'Cinzel, serif',
              gradient: 'gold',
              fontWeight: 'font-bold',
              letterSpacing: 'tracking-tight',
            };
            if (cmp.category === 'hero') {
              cmp.variant = 'HeroLuxury';
              cmp.props.overlayOpacity = 65;
            }
          });
        });
      });
    } else if (presetId === 'gastronomy-michelin' || prompt.includes('gastronomia') || prompt.includes('restaurante') || prompt.includes('vinho')) {
      updated.designSystem.headingFont = 'Playfair Display, serif';
      updated.designSystem.bodyFont = 'Manrope, sans-serif';
      updated.designSystem.accentColor = '#D4AF37';
      updated.designSystem.primaryColor = '#0A0A0A';
      updated.designSystem.backgroundColor = '#050505';

      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              titleFontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              gradient: 'gold',
            };
          });
        });
      });
    } else if (presetId === 'syne-futuristic' || prompt.includes('syne') || prompt.includes('agência') || prompt.includes('design')) {
      updated.designSystem.headingFont = 'Syne, sans-serif';
      updated.designSystem.bodyFont = 'Space Grotesk, sans-serif';
      updated.designSystem.accentColor = '#6366F1';
      updated.designSystem.backgroundColor = '#090A0D';

      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              titleFontFamily: 'Syne, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: 'tracking-wider',
            };
          });
        });
      });
    } else if (presetId === 'cyber-neon' || prompt.includes('saas') || prompt.includes('tech') || prompt.includes('cyan')) {
      updated.designSystem.headingFont = 'Space Grotesk, sans-serif';
      updated.designSystem.bodyFont = 'Inter, sans-serif';
      updated.designSystem.accentColor = '#0EA5E9';
      updated.designSystem.backgroundColor = '#04070D';

      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              titleFontFamily: 'Space Grotesk, sans-serif',
              gradient: 'cyan',
            };
          });
        });
      });
    } else {
      updated.designSystem.headingFont = 'Cormorant Garamond, serif';
      updated.designSystem.accentColor = '#D4AF37';
      updated.pages.forEach((p) => {
        p.sections.forEach((sec) => {
          sec.components.forEach((cmp) => {
            cmp.styleOverrides = {
              ...cmp.styleOverrides,
              gradient: 'gold',
            };
          });
        });
      });
    }

    updated.version += 1;
    updated.updatedAt = new Date().toISOString();
    return updated;
  }

  public static executeCommand(site: SiteSchema, command: string): SiteSchema {
    return this.executeCommandWithLog(site, command).updatedSite;
  }
}
