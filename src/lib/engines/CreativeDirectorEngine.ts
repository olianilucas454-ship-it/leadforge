import { HeroVariant } from '../types/siteBuilder';

export interface TypographyPairing {
  headingFont: string;
  bodyFont: string;
  scale: 'monumental' | 'editorial' | 'compact';
}

export interface ColorPaletteTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  gradient: 'gold' | 'silver' | 'cyan' | 'emerald' | 'none';
}

export interface VisualConcept {
  id: string;
  name: string;
  tagline: string;
  visualStyle: 'editorial' | 'cinematic' | 'minimal' | 'glass-futuristic' | 'bold-luxury' | 'tech-modern';
  artDirection: string;
  typography: TypographyPairing;
  colorPalette: ColorPaletteTokens;
  heroStructure: HeroVariant;
  compositionStyle: 'asymmetric' | 'editorial' | 'split' | 'fullscreen' | 'overlapping' | 'masonry';
  imageryPrompt: string;
  animationStyle: 'smooth-reveal' | 'cinematic-parallax' | 'minimal-fade';
  navigationStyle: 'minimal-transparent' | 'floating-glass' | 'dark-overlay';
  score: number;
}

export interface CreativeDirection {
  industry: string;
  businessType: string;
  audience: string;
  positioning: string;
  chosenConcept: VisualConcept;
  storytellingSequence: string[];
}

export class CreativeDirectorEngine {
  /**
   * Evaluates 3 internal creative concepts (Editorial, Cinematic, Next-Gen Minimal/Glass)
   * and selects the strongest direction for the business.
   */
  public static generateCreativeDirection(leadData: any): CreativeDirection {
    const category = (leadData.category || leadData.niche || 'general').toLowerCase();
    const name = leadData.name || 'Empresa Exclusiva';
    const city = leadData.city || 'São Paulo';
    const state = leadData.state || 'SP';

    // 1. Concept A: Editorial Luxury
    const conceptEditorial: VisualConcept = {
      id: 'editorial-luxury',
      name: 'Editorial Haute Couture',
      tagline: 'Elegância atemporal, serifas monumentais e espaços negativos equilibrados.',
      visualStyle: 'editorial',
      artDirection: 'Composição editorial de alta costura com contraste sofisticado, serifas em Bodoni / Cormorant e fita de métricas.',
      typography: {
        headingFont: category.includes('barb') || category.includes('barber') ? 'Cinzel, serif' : 'Bodoni Moda, serif',
        bodyFont: 'Inter, sans-serif',
        scale: 'monumental',
      },
      colorPalette: {
        primary: '#0F0E0C',
        secondary: '#1A1815',
        accent: '#D4AF37', // Ouro Champanhe
        background: '#070605',
        surface: '#151310',
        text: '#F5F2EB',
        muted: '#A39E93',
        border: 'rgba(212, 175, 55, 0.25)',
        gradient: 'gold',
      },
      heroStructure: category.includes('barb') ? 'HeroLuxury' : 'HeroArchevo',
      compositionStyle: 'editorial',
      imageryPrompt: `Ultra-luxury commercial photography for ${name} in ${city}, dramatic warm lighting, architectural contrast, 8k resolution, editorial campaign style.`,
      animationStyle: 'cinematic-parallax',
      navigationStyle: 'dark-overlay',
      score: 95,
    };

    // 2. Concept B: Cinematic Immersive
    const conceptCinematic: VisualConcept = {
      id: 'cinematic-immersive',
      name: 'Imersão Cinematográfica Dark',
      tagline: 'Fundo escuro absoluto, luzes ambiente direcionais e tipografia expansiva.',
      visualStyle: 'cinematic',
      artDirection: 'Atmosfera imersiva com degradês escuros, fotos arquitetônicas em tela cheia e badges em vidro fosco.',
      typography: {
        headingFont: 'Playfair Display, serif',
        bodyFont: 'Manrope, sans-serif',
        scale: 'monumental',
      },
      colorPalette: {
        primary: '#08090C',
        secondary: '#12141A',
        accent: '#C5A059', // Bronze Imperial
        background: '#040507',
        surface: '#0E1015',
        text: '#EAEAEA',
        muted: '#8A8F9E',
        border: 'rgba(255, 255, 255, 0.15)',
        gradient: 'gold',
      },
      heroStructure: 'HeroLavilla',
      compositionStyle: 'fullscreen',
      imageryPrompt: `Cinematic twilight photography of ${name}, architectural reflections, pool lighting, luxury real estate mood, 16:9 aspect ratio.`,
      animationStyle: 'cinematic-parallax',
      navigationStyle: 'floating-glass',
      score: 92,
    };

    // 3. Concept C: Next-Gen Organic Glass / Tech Minimal
    const conceptGlass: VisualConcept = {
      id: 'next-gen-glass',
      name: 'Vidro Orgânico & Arquitetura Futurista',
      tagline: 'Cards de vidro fosco flutuantes, azul ciano / esmeralda e layout orgânico assimétrico.',
      visualStyle: 'glass-futuristic',
      artDirection: 'Visual contemporâneo com containers orgânicos de vidro (backdrop-blur), elementos flutuantes e estética Awwwards.',
      typography: {
        headingFont: category.includes('tech') || category.includes('saas') ? 'Space Grotesk, sans-serif' : 'Outfit, sans-serif',
        bodyFont: 'Plus Jakarta Sans, sans-serif',
        scale: 'editorial',
      },
      colorPalette: {
        primary: '#0F172A',
        secondary: '#1E293B',
        accent: category.includes('tech') ? '#0EA5E9' : '#10B981', // Cyan / Emerald
        background: '#090D16',
        surface: 'rgba(15, 23, 42, 0.6)',
        text: '#F8FAFC',
        muted: '#94A3B8',
        border: 'rgba(255, 255, 255, 0.12)',
        gradient: category.includes('tech') ? 'cyan' : 'emerald',
      },
      heroStructure: 'HeroEcoGlass',
      compositionStyle: 'asymmetric',
      imageryPrompt: `Contemporary sustainable architectural masterpiece for ${name}, glass facades, natural sunlight, organic textures, editorial design.`,
      animationStyle: 'smooth-reveal',
      navigationStyle: 'minimal-transparent',
      score: 94,
    };

    // Choose the strongest visual concept based on category & business profile
    let chosenConcept = conceptEditorial;
    if (category.includes('imóve') || category.includes('imobiliá') || category.includes('hotel') || category.includes('pousada')) {
      chosenConcept = conceptCinematic;
    } else if (category.includes('arq') || category.includes('design') || category.includes('eco') || category.includes('tech') || category.includes('saas')) {
      chosenConcept = conceptGlass;
    } else if (category.includes('barb') || category.includes('gastronom') || category.includes('restaurante')) {
      chosenConcept = conceptEditorial;
    }

    return {
      industry: category.toUpperCase(),
      businessType: category,
      audience: 'Clientes de Alto Padrão / Projetos Premium',
      positioning: `${name} — Referência de Luxo e Excelência em ${city}, ${state}`,
      chosenConcept,
      storytellingSequence: [
        'INTRODUÇÃO IMERSIVA (HERO VISUAL DOMINANTE)',
        'MANIFESTO DE POSICIONAMENTO & ESTATÍSTICAS',
        'PROJETOS & SERVIÇOS AUTORAIS DEDICADOS',
        'EXPERIÊNCIA DO CLIENTE & PROVA SOCIAL EDITORIAL',
        'ATELIER / ESPAÇO & LOCALIZAÇÃO',
        'CHAMADA DE AÇÃO & CONVERSÃO PREMIUM'
      ],
    };
  }
}
