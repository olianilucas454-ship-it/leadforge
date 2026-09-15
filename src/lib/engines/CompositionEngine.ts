import { SiteSectionSchema, SiteComponentSchema } from '../types/siteBuilder';
import { CreativeDirection } from './CreativeDirectorEngine';

export class CompositionEngine {
  /**
   * Generates a rhythmically varied, asymmetric story-driven section sequence
   * based on the CreativeDirection object.
   */
  /**
   * Helper to resolve niche-specific titles, badges, CTAs, menu links, and descriptions.
   */
  /**
   * Helper to resolve niche-specific titles, badges, CTAs, menu links, and descriptions.
   */
  private static getSectorContent(leadData: any) {
    const name = leadData.name || 'Empresa Exclusiva';
    const city = leadData.city || 'São Paulo';
    const cat = `${leadData.category || ''} ${leadData.niche || ''} ${leadData.name || ''}`.toLowerCase();

    // 1. Barbearia & Estética Masculina FIRST
    if (cat.includes('barb') || cat.includes('barber') || cat.includes('estética masculina') || cat.includes('visagismo')) {
      return {
        heroTitle: 'A precisão não é detalhe. É a sua assinatura.',
        heroSubtitle: `Cortes autorais, ritual de barba tradicional e experiência VIP exclusiva em ${city}.`,
        badge: `HAUTE BARBIER • ${city.toUpperCase()}`,
        navLink1: 'SERVIÇOS',
        navLink2: 'MESTRES',
        navLink3: 'EXPERIÊNCIA',
        navLink4: 'CONTATO',
        ctaText: 'AGENDAR HORÁRIO ↗',
        secondaryCtaText: 'CONHECER O ATELIER',
        headerCta: 'AGENDAR HORÁRIO',
        aboutBadge: '01 / MANIFESTO AUTORAL',
        aboutTitle: 'Mais que um corte, um ritual de alinhamento e presença.',
        aboutDesc: `Na ${name}, acreditamos que a imagem pessoal é a sua maior credencial. Ambiente privativo, bebidas selecionadas e mestres barbeiros dedicados a superar suas expectativas.`,
        servicesBadge: '02 / O MENU',
        servicesTitle: 'Serviços & Rituais Autorais',
        servicesItems: [
          { name: 'Corte Autoral Signature', price: 'R$ 130', description: 'Consultoria de visagismo, lavagem terapêutica e corte preciso com acabamento impecável.', duration: '50 MIN' },
          { name: 'Barba de Toalha Quente Ritual', price: 'R$ 90', description: 'Barboterapia com óleos essenciais, massagem facial e navalha tradicional.', duration: '40 MIN' },
          { name: 'Experiência Completa VIP (Corte + Barba)', price: 'R$ 200', description: 'Combo exclusivo com harmonização de imagem e degustação de whisky.', duration: '90 MIN' },
        ],
        galleryBadge: '03 / O ATELIER',
        galleryTitle: 'Onde o ritual de precisão acontece.',
        ctaTitle: 'SEU PRÓXIMO CORTE COMEÇA AQUI.',
        ctaSubtitle: `Agende o seu horário privativo com a equipe da ${name} e vivencie a excelência.`,
        ctaTextMain: 'AGENDAR MEU HORÁRIO AGORA ↗'
      };
    }

    // 2. Gastronomia (Restaurante, Bistrô, Pizzaria, Culinária)
    if (cat.includes('gastronom') || cat.includes('restaurante') || cat.includes('culinár') || cat.includes('bistrô') || cat.includes('pizzaria') || cat.includes('pub') || cat.includes('gourmet')) {
      return {
        heroTitle: 'Sabores autorais. Experiência inesquecível.',
        heroSubtitle: `Gastronomia contemporânea, ingredientes selecionados e alta culinária em ${city}.`,
        badge: `GASTRONOMIA AUTORAL • ${city.toUpperCase()}`,
        navLink1: 'CARDÁPIO',
        navLink2: 'SOBRE NÓS',
        navLink3: 'GALERIA',
        navLink4: 'RESERVAS',
        ctaText: 'RESERVAR MESA ↗',
        secondaryCtaText: 'VER CARDÁPIO',
        headerCta: 'RESERVAS',
        aboutBadge: '01 / MANIFESTO CULINÁRIO',
        aboutTitle: 'Gastronomia de alta ordem onde cada prato conta uma história única.',
        aboutDesc: `No ${name}, cada ingrediente é selecionado a dedo para criar combinações memoráveis. Nossa cozinha combina tradição e inovação para encantar o seu paladar em ${city}.`,
        servicesBadge: '02 / O CARDÁPIO',
        servicesTitle: 'Experiências & Seleção Autoral',
        servicesItems: [
          { name: 'Menu Degustação Signature', price: 'R$ 280', description: 'Sequência exclusiva de 7 tempos harmonizada por nosso chef master.', duration: '120 MIN' },
          { name: 'Pratos Principais Autorais', price: 'A partir de R$ 85', description: 'Cortes nobres, frutos do mar frescos e massas artesanais preparadas na hora.', duration: '45 MIN' },
          { name: 'Carta de Vinhos & Coquetelaria', price: 'Sob Consulta', description: 'Rótulos premiados e coquetéis autorais criados por mixologistas renomados.', duration: '30 MIN' },
        ],
        galleryBadge: '03 / O AMBIENTE',
        galleryTitle: 'Uma atmosfera envolvente para momentos especiais.',
        ctaTitle: 'SUA MESA ESTÁ ESPERANDO POR VOCÊ.',
        ctaSubtitle: `Garanta a sua reserva no ${name} e viva uma noite inesquecível em ${city}.`,
        ctaTextMain: 'RESERVAR MINHA MESA ↗'
      };
    }

    if (cat.includes('arq') || cat.includes('architect') || cat.includes('interiores') || cat.includes('design de interiores')) {
      return {
        heroTitle: 'Arquitetura que inspira. Espaços que vivem.',
        heroSubtitle: `Projetos residenciais e corporativos de alto padrão com estética atemporal em ${city}.`,
        badge: `ARCHITECTURE • INTERIORS • DESIGN`,
        navLink1: 'PROJETOS',
        navLink2: 'SERVIÇOS',
        navLink3: 'SOBRE',
        navLink4: 'CONTATO',
        ctaText: 'EXPLORAR PROJETOS ↗',
        secondaryCtaText: 'INICIAR PROJETO',
        headerCta: 'FALAR COM ARQUITETO',
        aboutBadge: '01 / MANIFESTO ARQUITETÔNICO',
        aboutTitle: 'Criamos formas puras que elevam a experiência humana.',
        aboutDesc: `Na ${name}, desenvolvemos arquitetura e interiores autorais que combinam sustentabilidade, funcionalidade e sofisticação para clientes exigentes em ${city}.`,
        servicesBadge: '02 / NOSOS SERVIÇOS',
        servicesTitle: 'Soluções em Arquitetura & Design',
        servicesItems: [
          { name: 'Projeto Arquitetônico Residencial', price: 'Sob Consulta', description: 'Desenvolvimento completo desde a concepção espacial até o detalhamento executivo.', duration: 'FASE 1' },
          { name: 'Design de Interiores High-End', price: 'Sob Consulta', description: 'Curadoria de mobiliário autoral, iluminação cênica e escolha de revestimentos nobres.', duration: 'FASE 2' },
          { name: 'Consultoria de Retrofit & Reforma', price: 'Sob Consulta', description: 'Modernização de ambientes com otimização de espaço e materiais sustentáveis.', duration: 'FASE 3' },
        ],
        galleryBadge: '03 / PORTFÓLIO',
        galleryTitle: 'Projetos que redefinem o morar contemporâneo.',
        ctaTitle: 'TRANSFORME SUA VISÃO EM REALIDADE.',
        ctaSubtitle: `Entre em contato com o escritório ${name} para apresentar o seu projeto residencial ou comercial.`,
        ctaTextMain: 'INICIAR MEU PROJETO ↗'
      };
    }

    if (cat.includes('imóve') || cat.includes('imobiliá') || cat.includes('real estate') || cat.includes('construtora')) {
      return {
        heroTitle: 'Residências Exclusivas & Luxo',
        heroSubtitle: `Curadoria rigorosa dos imóveis mais desejados de alto padrão em ${city}.`,
        badge: `LUXURY REAL ESTATE • ${city.toUpperCase()}`,
        navLink1: 'IMÓVEIS',
        navLink2: 'SOBRE NÓS',
        navLink3: 'DIFERENCIAIS',
        navLink4: 'CONTATO',
        ctaText: 'SOLICITAR CATÁLOGO ↗',
        secondaryCtaText: 'FALAR COM CORRETOR',
        headerCta: 'CATÁLOGO DE IMÓVEIS',
        aboutBadge: '01 / NOSSA CURADORIA',
        aboutTitle: 'Acesso privilegiado às propriedades mais cobiçadas da região.',
        aboutDesc: `A ${name} é especializada em conectar clientes de alto poder aquisitivo às melhores oportunidades imobiliárias com total discrição e consultoria jurídica completa.`,
        servicesBadge: '02 / NOSSOS SERVIÇOS',
        servicesTitle: 'Assessoria Imobiliária High-End',
        servicesItems: [
          { name: 'Venda de Imóveis de Luxo', price: 'Sob Consulta', description: 'Casas em condomínios fechados, coberturas e vilas exclusivas em localizações nobres.', duration: 'PRIVATIVO' },
          { name: 'Lançamentos & Empreendimentos', price: 'Sob Consulta', description: 'Acesso antecipado a pré-lançamentos imobiliários com alto potencial de valorização.', duration: 'EXCLUSIVO' },
          { name: 'Consultoria de Investimento Imobiliário', price: 'Sob Consulta', description: 'Análise de rentabilidade e estruturação de carteiras de ativos imobiliários.', duration: 'CONSULTORIA' },
        ],
        galleryBadge: '03 / PROPRIEDADES',
        galleryTitle: 'Imóveis selecionados com acabamentos extraordinários.',
        ctaTitle: 'ENCONTRE SEU NOVO ENDEREÇO DE PRESTÍGIO.',
        ctaSubtitle: `Fale com os nossos consultores especializados da ${name} e agende uma visita privativa.`,
        ctaTextMain: 'AGENDAR VISITA PRIVATIVA ↗'
      };
    }

    if (cat.includes('saúde') || cat.includes('odontolog') || cat.includes('médic') || cat.includes('clínica') || cat.includes('dermatolog')) {
      return {
        heroTitle: 'Saúde, estética & transformação com excelência.',
        heroSubtitle: `Atendimento humanizado, tecnologia de ponta e procedimentos exclusivos em ${city}.`,
        badge: `CLÍNICA VIP • ${city.toUpperCase()}`,
        navLink1: 'PROCEDIMENTOS',
        navLink2: 'SOBRE',
        navLink3: 'EQUIPE',
        navLink4: 'CONTATO',
        ctaText: 'AGENDAR CONSULTA ↗',
        secondaryCtaText: 'CONHECER CLÍNICA',
        headerCta: 'AGENDAR CONSULTA',
        aboutBadge: '01 / MANIFESTO DE SAÚDE',
        aboutTitle: 'Cuidado individualizado pautado na ciência e no bem-estar.',
        aboutDesc: `Na ${name}, cada paciente é atendido com protocolo personalizado e tecnologias de última geração em um ambiente acolhedor e altamente sofisticado.`,
        servicesBadge: '02 / PROCEDIMENTOS',
        servicesTitle: 'Procedimentos & Tratamentos',
        servicesItems: [
          { name: 'Avaliação Estética & Protocolo Personalizado', price: 'R$ 350', description: 'Mapeamento detalhado e planejamento integrativo de procedimentos.', duration: '60 MIN' },
          { name: 'Tratamentos Avançados de Alta Tecnologia', price: 'Sob Consulta', description: 'Tecnologia de ponta para resultados naturais e duradouros.', duration: '45 MIN' },
          { name: 'Acompanhamento VIP & Pós-Procedimento', price: 'Incluso', description: 'Suporte contínuo e acompanhamento dedicado durante toda a jornada.', duration: 'CONTÍNUO' },
        ],
        galleryBadge: '03 / A CLÍNICA',
        galleryTitle: 'Infraestrutura moderna e ambiente acolhedor.',
        ctaTitle: 'CUIDE DA SUA SAÚDE E BEM-ESTAR COM ESPECIALISTAS.',
        ctaSubtitle: `Agende a sua consulta de avaliação na ${name} e descubra o plano ideal para você.`,
        ctaTextMain: 'AGENDAR CONSULTA AGORA ↗'
      };
    }

    // Default General
    return {
      heroTitle: 'Excelência autoral & atendimento exclusivo.',
      heroSubtitle: `Serviços de alto padrão pensados especialmente para suas necessidades em ${city}.`,
      badge: `EXCELÊNCIA AUTORAL • ${city.toUpperCase()}`,
      navLink1: 'INÍCIO',
      navLink2: 'SERVIÇOS',
      navLink3: 'SOBRE NÓS',
      navLink4: 'CONTATO',
      ctaText: 'ENTRAR EM CONTATO ↗',
      secondaryCtaText: 'SAIBAMAIS',
      headerCta: 'FALAR CONOSCO',
      aboutBadge: '01 / MANIFESTO',
      aboutTitle: 'Compromisso inflexível com a qualidade e satisfação total.',
      aboutDesc: `Na ${name}, entregamos soluções sob medida com profissionalismo e atenção rigorosa aos detalhes em ${city}.`,
      servicesBadge: '02 / SERVIÇOS',
      servicesTitle: 'Nossos Serviços Autorais',
      servicesItems: [
        { name: 'Atendimento Autoral Signature', price: 'R$ 150', description: 'Consultoria e execução impecável por especialistas masters.', duration: '60 MIN' },
        { name: 'Serviço Personalizado VIP', price: 'R$ 250', description: 'Tratamento completo adaptado às suas necessidades individuais.', duration: '90 MIN' },
        { name: 'Consultoria Executiva Completa', price: 'Sob Consulta', description: 'Solução integral com acompanhamento dedicado do início ao fim.', duration: '120 MIN' },
      ],
      galleryBadge: '03 / ESPAÇO',
      galleryTitle: 'Qualidade que você vê e sente.',
      ctaTitle: 'SEU PRÓXIMO PASSO COMEÇA AQUI.',
      ctaSubtitle: `Entre em contato com a equipe da ${name} e agende seu atendimento personalizado.`,
      ctaTextMain: 'FALAR COM A EQUIPE AGORA ↗'
    };
  }

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
    const sector = this.getSectorContent(leadData);

    // Section 1: Immersive Hero Section
    const heroComponent: SiteComponentSchema = {
      id: 'cmp-hero-1',
      name: 'Hero Dominante Imersivo',
      category: 'hero',
      variant: concept.heroStructure,
      props: {
        title: sector.heroTitle,
        subtitle: leadData.tagline || sector.heroSubtitle,
        badge: sector.badge,
        navLink1: sector.navLink1,
        navLink2: sector.navLink2,
        navLink3: sector.navLink3,
        navLink4: sector.navLink4,
        headerCta: sector.headerCta,
        ctaText: sector.ctaText,
        ctaLink: '#booking',
        secondaryCtaText: sector.secondaryCtaText,
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
        badge: sector.aboutBadge,
        title: sector.aboutTitle,
        description: sector.aboutDesc,
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
        badge: sector.servicesBadge,
        title: sector.servicesTitle,
        subtitle: 'Curadoria de experiências personalizadas para quem exige o melhor.',
        items: sector.servicesItems,
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
        badge: sector.galleryBadge,
        title: sector.galleryTitle,
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
          { clientName: 'Dr. Ricardo Silveira', city: city, rating: 5, quote: `A experiência na ${name} é simplesmente impecável. A atenção aos detalhes e o profissionalismo superam qualquer expectativa.` },
          { clientName: 'Fernanda Lins', city: city, rating: 5, quote: 'Atendimento incomparável. O ambiente é acolhedor e a qualidade dos serviços é do mais alto nível de agência.' },
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

    // Section 6: Location & Google Maps Section
    const mapAddress = leadData.address || `Av. Paulista, 1500 - Jardins, ${city} - SP`;
    const searchQuery = encodeURIComponent(`${name} ${city}`);
    const mapComponent: SiteComponentSchema = {
      id: 'cmp-map-1',
      name: 'Localização & Google Maps',
      category: 'map',
      variant: 'LocationMap',
      props: {
        badge: '05 / COMO CHEGAR',
        title: 'Encontre o nosso espaço com facilidade.',
        subtitle: `Localização privilegiada com estacionamento privativo e acesso acessível em ${city}.`,
        address: mapAddress,
        city: city,
        phone: leadData.phone || '(11) 99876-5432',
        openingHours: 'Seg - Sáb: 09:00 - 20:00',
        mapLabel: 'VER NO GOOGLE MAPS',
        googleMapsEmbedUrl: `https://maps.google.com/maps?q=${searchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${searchQuery}`,
      },
      styleOverrides: {
        titleFontFamily: concept.typography.headingFont,
        bodyFontFamily: concept.typography.bodyFont,
        gradient: concept.colorPalette.gradient,
      },
    };

    const mapSection: SiteSectionSchema = {
      id: 'sec-map',
      name: 'Localização & Mapa',
      category: 'map',
      variant: 'LocationMap',
      components: [mapComponent],
    };

    // Section 7: Premium CTA & Booking
    const ctaComponent: SiteComponentSchema = {
      id: 'cmp-cta-1',
      name: 'Chamada para Ação',
      category: 'cta',
      variant: 'CtaCinematic',
      props: {
        title: sector.ctaTitle,
        subtitle: sector.ctaSubtitle,
        ctaText: sector.ctaTextMain,
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
      mapSection,
      ctaSection,
    ];
  }
}
