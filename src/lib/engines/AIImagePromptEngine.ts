export interface CommercialImageStrategy {
  prompt: string;
  heroImage: string;
  galleryImages: { url: string; title: string; caption: string }[];
}

export class AIImagePromptEngine {
  public static generateStrategy(businessType: string, businessName: string, city: string): CommercialImageStrategy {
    const type = (businessType || '').toLowerCase();
    
    if (type.includes('barbearia') || type.includes('barber')) {
      return {
        prompt: `Ultra-premium haute barbier interior for ${businessName} in ${city}, dark leather chairs, warm tungsten side lighting, bronze accents, editorial campaign style, wide shot, 8k.`,
        heroImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1800',
        galleryImages: [
          { url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800', title: 'Atelier de Precisão', caption: 'Navalha e visagismo autoral' },
          { url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800', title: 'Ritual de Barba', caption: 'Toalhas quentes e óleos botânicos' },
          { url: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&q=80&w=800', title: 'Camarim Privativo', caption: 'Degustação de maltes nobres' },
        ],
      };
    }

    if (type.includes('arq') || type.includes('interi') || type.includes('construt')) {
      return {
        prompt: `Contemporary architectural residence for ${businessName}, sculptural concrete and glass structure, sunset side lighting, luxury interior photography, 16:9 aspect ratio.`,
        heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800',
        galleryImages: [
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800', title: 'Residência Origami', caption: 'Concreto aparente e luz cênica' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', title: 'Atelier Marista', caption: 'Marcenaria autoral e pedra natural' },
          { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800', title: 'Penthouse Jardins', caption: 'Integração de interiores e paisagismo' },
        ],
      };
    }

    if (type.includes('imóv') || type.includes('imobili')) {
      return {
        prompt: `Luxury modern tropical villa for ${businessName} in ${city}, illuminated infinity pool, palm silhouettes, twilight architectural photography.`,
        heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1800',
        galleryImages: [
          { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800', title: 'Villa Alphaville', caption: 'Suítes panorâmicas e automação' },
          { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800', title: 'Mansão Horizonte', caption: 'Piscina aquecida e vista definitiva' },
        ],
      };
    }

    if (type.includes('gastronom') || type.includes('restaur')) {
      return {
        prompt: `Michelin star culinary presentation for ${businessName}, dark ambient background, golden hour table setting, fine dining photography.`,
        heroImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1800',
        galleryImages: [
          { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', title: 'Corte Prime Wagyu', caption: 'Grelhado a carvão artesanal' },
          { url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800', title: 'Carta de Vinhos', caption: 'Rótulos premiados internacionais' },
        ],
      };
    }

    // Default High-End Business Image Strategy
    return {
      prompt: `Commercial luxury brand photography for ${businessName} in ${city}, high contrast, elegant ambient lighting, editorial design campaign.`,
      heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1800',
      galleryImages: [
        { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800', title: 'Espaço Conceito', caption: 'Ambiente exclusivo projetado para clientes VIP' },
        { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', title: 'Excelência em Projetos', caption: 'Inovação e acabamento de alto padrão' },
      ],
    };
  }
}
