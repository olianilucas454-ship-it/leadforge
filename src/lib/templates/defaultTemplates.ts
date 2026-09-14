import { SiteSchema, DesignSystemTokens } from '../types/siteBuilder';

export const DEFAULT_DESIGN_SYSTEM: DesignSystemTokens = {
  primaryColor: '#090A0F',
  secondaryColor: '#12141F',
  accentColor: '#00D68F',
  backgroundColor: '#090A0F',
  surfaceColor: '#181A28',
  textColor: '#F8FAFC',
  mutedColor: '#94A3B8',
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  borderRadius: '0.75rem',
  containerWidth: '1280px',
  spacingScale: 'normal',
  themeMode: 'dark',
};

export const INITIAL_DEMO_SITES: SiteSchema[] = [
  {
    id: 'site-1',
    name: 'Atelier Gourmet & Lounge',
    clientName: 'Atelier Gastronomia',
    experienceLevel: 'cinematic',
    status: 'published',
    subdomain: 'atelier-gourmet',
    domain: 'gourmet.leadforge.site',
    version: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designSystem: {
      ...DEFAULT_DESIGN_SYSTEM,
      accentColor: '#D4AF37',
      primaryColor: '#0B0A08',
      secondaryColor: '#161410',
    },
    seo: {
      title: 'Atelier Gourmet — Alta Gastronomia e Experiência Sensorial',
      description: 'Cozinha autoral e coquetelaria exclusiva em ambiente intimista.',
      keywords: ['restaurante', 'alta gastronomia', 'gourmet', 'lounge'],
    },
    assets: [],
    pages: [
      {
        id: 'p1',
        title: 'Home',
        slug: '/',
        sections: [
          {
            id: 'sec-hero',
            name: 'Hero Cinematográfico',
            category: 'hero',
            variant: 'HeroCinematic',
            components: [
              {
                id: 'cmp-hero-1',
                name: 'Hero Main',
                category: 'hero',
                variant: 'HeroCinematic',
                props: {
                  badge: 'DEPUIS 2019 — ALTA GASTRONOMIA',
                  title: 'A culinária como expressão artística de alta precisão.',
                  subtitle: 'Cada prato é concebido como uma narrativa sensorial única.',
                  description: 'Ingredientes nobres selecionados diariamente para criar momentos inesquecíveis.',
                  ctaText: 'RESERVAR MESA',
                  ctaLink: '#reservas',
                  secondaryCtaText: 'VER MENU DE DEGUSTAÇÃO',
                  secondaryCtaLink: '#menu',
                  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600',
                  whatsappNumber: '5511999999999',
                  whatsappMessage: 'Olá, gostaria de reservar uma mesa no Atelier Gourmet.',
                },
                animation: {
                  enabled: true,
                  type: 'fade-up',
                  scrub: false,
                  start: 'top 80%',
                  end: 'bottom 20%',
                },
              },
            ],
          },
          {
            id: 'sec-services',
            name: 'Menu & Rituais',
            category: 'services',
            variant: 'ServicesInteractive',
            components: [
              {
                id: 'cmp-serv-1',
                name: 'Lista de Pratos',
                category: 'services',
                variant: 'ServicesInteractive',
                props: {
                  badge: 'EXPERIÊNCIAS',
                  title: 'Menu Autorais & Rituais',
                  subtitle: 'Selecione a harmonização perfeita para sua noite',
                  items: [
                    { name: 'Menu Degustação 7 Passos', price: 'R$ 380', description: 'Viagem gastronômica completa harmonizada com vinhos raros.' },
                    { name: 'Tomahawk Dry-Aged 45 Dias', price: 'R$ 290', description: 'Corte nobre com crosta de ervas de Provence e alho assado.' },
                    { name: 'Risoto de Trufas Negras', price: 'R$ 190', description: 'Arroz arbóreo italiano com trufas frescas importadas.' },
                  ],
                },
              },
            ],
          },
          {
            id: 'sec-cta',
            name: 'Reserva Rápida',
            category: 'cta',
            variant: 'CtaMinimal',
            components: [
              {
                id: 'cmp-cta-1',
                name: 'CTA Block',
                category: 'cta',
                variant: 'CtaMinimal',
                props: {
                  title: 'SUA MESA ESTÁ RESERVADA PARA ESSA NOITE.',
                  subtitle: 'Entre em contato pelo WhatsApp e garanta seu lugar exclusivo.',
                  ctaText: 'GARANTIR MINHA RESERVA VIA WHATSAPP',
                  ctaLink: 'https://wa.me/5511999999999',
                  whatsappNumber: '5511999999999',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'site-2',
    name: 'Vanguard Arquitetura & Studio',
    clientName: 'Vanguard Studio',
    experienceLevel: 'experimental',
    status: 'draft',
    subdomain: 'vanguard-arch',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designSystem: {
      ...DEFAULT_DESIGN_SYSTEM,
      accentColor: '#6366F1',
      primaryColor: '#0A0A0C',
    },
    seo: {
      title: 'Vanguard — Arquitetura de Alto Padrão e Urbanismo',
      description: 'Projetos residenciais e corporativos vanguardistas.',
      keywords: ['arquitetura', 'design de interiores', 'luxo'],
    },
    assets: [],
    pages: [
      {
        id: 'p1',
        title: 'Home',
        slug: '/',
        sections: [
          {
            id: 'sec-hero-arch',
            name: 'Hero Arquitetura',
            category: 'hero',
            variant: 'HeroSplit',
            components: [
              {
                id: 'cmp-arch-1',
                name: 'Hero Minimal Split',
                category: 'hero',
                variant: 'HeroSplit',
                props: {
                  badge: 'STUDIO DE ARQUITETURA',
                  title: 'Esculpindo espaços futuristas e orgânicos.',
                  subtitle: 'Design minimalista onde a luz natural molda cada ambiente.',
                  ctaText: 'SOLICITAR PROJETO',
                  ctaLink: '#contato',
                  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
