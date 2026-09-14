import { SiteSectionSchema, SiteComponentSchema } from '../types/siteBuilder';
import { CreativeDirection } from './CreativeDirectorEngine';

export class CompositionEngine {
  /**
   * Generates a rhythmically varied, asymmetric story-driven section sequence
   * based on the CreativeDirection object.
   */
  public static buildStoryComposition(
    direction: CreativeDirection,
    leadData: any,
    imageStrategy: any
  ): SiteSectionSchema[] {
    const concept = direction.chosenConcept;
    const name = leadData.name || 'Empresa Exclusiva';
    const city = leadData.city || 'São Paulo';

    // Section 1: Immersive Hero Section
    const heroComponent: SiteComponentSchema = {
      id: 'cmp-hero-1',
      name: 'Hero Dominante Imersivo',
      category: 'hero',
      variant: concept.heroStructure,
      props: {
        title: concept.heroStructure === 'HeroEcoGlass'
          ? 'YOUR VISION OF SUSTAINABLE LIVING'
          : concept.heroStructure === 'HeroArchevo'
          ? 'Architecture that inspires. Spaces that live.'
          : concept.heroStructure === 'HeroLavilla'
          ? name.toUpperCase()
          : `A precisão não é detalhe. É a sua assinatura.`,
        subtitle: leadData.tagline || `Referência autoral e experiência VIP em ${city}.`,
        badge: concept.heroStructure === 'HeroEcoGlass'
          ? 'SUSTAINABLE LIVING'
          : concept.heroStructure === 'HeroArchevo'
          ? 'ARCHITECTURE • INTERIORS • DESIGN'
          : `HAUTE ATELIER — ${city.toUpperCase()}`,
        ctaText: 'AGENDAR HORÁRIO ↗',
        ctaLink: '#booking',
        secondaryCtaText: 'CONHECER O ATELIER',
        secondaryCtaLink: '#about',
        image: imageStrategy.heroImage,
        overlayOpacity: 55,
      },
      styleOverrides: {
        titleFontFamily: concept.typography.headingFont,
        bodyFontFamily: concept.typography.bodyFont,
        gradient: concept.colorPalette.gradient,
        fontWeight: 'font-bold',
      },
    };

    const heroSection: SiteSectionSchema = {
      id: 'sec-hero',
      name: 'Hero Dominante',
      category: 'hero',
      variant: concept.heroStructure,
      components: [heroComponent],
    };

    // Section 2: Manifesto & Floating Stats
    const aboutComponent: SiteComponentSchema = {
      id: 'cmp-about-1',
      name: 'Manifesto & Estatísticas',
      category: 'about',
      variant: 'AboutAsymmetric',
      props: {
        badge: '01 / MANIFESTO',
        title: 'Criamos experiências atemporais desenhadas com paixão e maestria.',
        description: `Na ${name}, acreditamos que o luxo autêntico está na precisão milimétrica e no atendimento verdadeiramente exclusivo. Cada detalhe é concebido para transformar a sua rotina em uma celebração de sofisticação.`,
        stats: [
          { number: '98%', label: 'Satisfação de Clientes VIP' },
          { number: '12+', label: 'Anos de Tradição Autoral' },
          { number: '4.9★', label: 'Avaliação Média no Google' },
        ],
      },
      styleOverrides: {
        titleFontFamily: concept.typography.headingFont,
        bodyFontFamily: concept.typography.bodyFont,
        gradient: concept.colorPalette.gradient,
      },
    };

    const aboutSection: SiteSectionSchema = {
      id: 'sec-about',
      name: 'Manifesto & Posição',
      category: 'about',
      variant: 'AboutAsymmetric',
      components: [aboutComponent],
    };

    // Section 3: Services & Rituals (Horizontal List)
    const servicesComponent: SiteComponentSchema = {
      id: 'cmp-services-1',
      name: 'Menu de Serviços & Rituais',
      category: 'services',
      variant: 'ServicesList',
      props: {
        badge: '02 / O MENU',
        title: 'Serviços & Rituais Autorais',
        subtitle: 'Curadoria de experiências personalizadas para quem exige o melhor.',
        items: [
          { name: 'Atendimento Autoral Signature', price: 'R$ 150', description: 'Consultoria de imagem e execução impecável por especialistas masters.', duration: '60 MIN' },
          { name: 'Ritual VIP de Imersão', price: 'R$ 220', description: 'Tratamento completo com produtos botânicos e ambiente privativo.', duration: '90 MIN' },
          { name: 'Experiência Executiva Completa', price: 'Sob Consulta', description: 'Serviço exclusivo sob agendamento corporativo ou celebração privada.', duration: '120 MIN' },
        ],
      },
      styleOverrides: {
        titleFontFamily: concept.typography.headingFont,
        bodyFontFamily: concept.typography.bodyFont,
      },
    };

    const servicesSection: SiteSectionSchema = {
      id: 'sec-services',
      name: 'Serviços Autorais',
      category: 'services',
      variant: 'ServicesList',
      components: [servicesComponent],
    };

    // Section 4: Editorial Gallery (Mosaic)
    const galleryComponent: SiteComponentSchema = {
      id: 'cmp-gallery-1',
      name: 'Galeria Editorial',
      category: 'gallery',
      variant: 'GalleryMosaic',
      props: {
        badge: '03 / O ATELIER',
        title: 'Onde a experiência acontece.',
        subtitle: 'Atmosfera pensada para proporcionar conforto, privacidade e sofisticação.',
        items: imageStrategy.galleryImages,
      },
      styleOverrides: {
        titleFontFamily: concept.typography.headingFont,
        bodyFontFamily: concept.typography.bodyFont,
      },
    };

    const gallerySection: SiteSectionSchema = {
      id: 'sec-gallery',
      name: 'Galeria Imersiva',
      category: 'gallery',
      variant: 'GalleryMosaic',
      components: [galleryComponent],
    };

    // Section 5: Testimonials (Editorial Proof)
    const testimonialComponent: SiteComponentSchema = {
      id: 'cmp-testimonials-1',
      name: 'Depoimentos Editoriais',
      category: 'testimonials',
      variant: 'TestimonialsEditorial',
      props: {
        badge: '04 / CRÍTICA & DEPOIMENTOS',
        title: 'O que dizem os nossos clientes VIP.',
        items: [
          { clientName: 'Dr. Ricardo Silveira', city: 'São Paulo', rating: 5, quote: 'A experiência na empresa é simplesmente impecável. A atenção aos detalhes e o profissionalismo superam qualquer expectativa.' },
          { clientName: 'Fernanda Lins', city: 'Goiânia', rating: 5, quote: 'Atendimento incomparável. O ambiente é acolhedor e a qualidade dos serviços é do mais alto nível de agência.' },
        ],
      },
      styleOverrides: {
        titleFontFamily: concept.typography.headingFont,
        bodyFontFamily: concept.typography.bodyFont,
        gradient: concept.colorPalette.gradient,
      },
    };

    const testimonialSection: SiteSectionSchema = {
      id: 'sec-testimonials',
      name: 'Prova Social Editorial',
      category: 'testimonials',
      variant: 'TestimonialsEditorial',
      components: [testimonialComponent],
    };

    // Section 6: Premium CTA & Booking
    const ctaComponent: SiteComponentSchema = {
      id: 'cmp-cta-1',
      name: 'Chamada para Ação',
      category: 'cta',
      variant: 'CtaCinematic',
      props: {
        title: 'SEU PRÓXIMO PASSO COMEÇA AQUI.',
        subtitle: `Agende o seu horário privativo com a equipe da ${name} e vivencie a excelência.`,
        ctaText: 'RESERVAR MEU HORÁRIO AGORA ↗',
        ctaLink: leadData.whatsapp ? `https://wa.me/55${leadData.whatsapp.replace(/\D/g, '')}` : '#contact',
      },
      styleOverrides: {
        titleFontFamily: concept.typography.headingFont,
        bodyFontFamily: concept.typography.bodyFont,
        gradient: concept.colorPalette.gradient,
      },
    };

    const ctaSection: SiteSectionSchema = {
      id: 'sec-cta',
      name: 'Conversão Premium',
      category: 'cta',
      variant: 'CtaCinematic',
      components: [ctaComponent],
    };

    return [
      heroSection,
      aboutSection,
      servicesSection,
      gallerySection,
      testimonialSection,
      ctaSection,
    ];
  }
}
