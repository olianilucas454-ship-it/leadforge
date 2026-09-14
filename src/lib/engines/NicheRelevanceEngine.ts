import { NicheMatch } from '../types/analysis';

export class NicheRelevanceEngine {
  private readonly NICHE_MAP: Record<string, { osmTags: string[], keywords: string[], excludeKeywords: string[], synonyms: string[] }> = {
    'barbearia': {
      osmTags: ['barber', 'hairdresser'],
      keywords: ['barbearia', 'barber', 'barbeiro'],
      excludeKeywords: ['salão feminino', 'pet', 'beleza'],
      synonyms: ['barber shop']
    },
    'restaurante': {
      osmTags: ['restaurant'],
      keywords: ['restaurante', 'food', 'comida', 'refeição'],
      excludeKeywords: [],
      synonyms: ['lanchonete', 'bistrô', 'cantina']
    },
    'clínica odontológica': {
      osmTags: ['dentist'],
      keywords: ['odonto', 'dentista', 'clínica', 'dente', 'sorriso'],
      excludeKeywords: ['estética', 'médica', 'veterinária'],
      synonyms: ['dentista', 'consultório odontológico']
    },
    'dentista': {
      osmTags: ['dentist'],
      keywords: ['odonto', 'dentista', 'clínica', 'dente', 'sorriso'],
      excludeKeywords: ['estética', 'médica', 'veterinária'],
      synonyms: ['clínica odontológica']
    },
    'academia': {
      osmTags: ['fitness_centre', 'gym'],
      keywords: ['academia', 'fitness', 'gym', 'crossfit', 'treinamento'],
      excludeKeywords: [],
      synonyms: ['centro de treinamento', 'estúdio fitness']
    },
    'salão de beleza': {
      osmTags: ['beauty', 'hairdresser'],
      keywords: ['salão', 'beleza', 'cabelo', 'cabeleireiro', 'estética'],
      excludeKeywords: ['barber', 'barbearia'],
      synonyms: ['instituto de beleza', 'centro estético']
    },
    'oficina mecânica': {
      osmTags: ['car_repair'],
      keywords: ['oficina', 'mecânica', 'auto center', 'reparo', 'carro'],
      excludeKeywords: ['loja de peças'],
      synonyms: ['centro automotivo', 'mecânico']
    },
    'pizzaria': {
      osmTags: ['restaurant', 'fast_food'],
      keywords: ['pizza', 'pizzaria', 'forno', 'massas'],
      excludeKeywords: [],
      synonyms: ['delivery de pizza']
    },
    'imobiliária': {
      osmTags: ['estate_agent'],
      keywords: ['imobiliária', 'imóveis', 'corretor', 'vendas', 'locação'],
      excludeKeywords: ['seguros'],
      synonyms: ['corretora de imóveis', 'assessoria imobiliária']
    },
    'clínica veterinária': {
      osmTags: ['veterinary'],
      keywords: ['veterinária', 'vet', 'animal', 'clínica'],
      excludeKeywords: ['pet shop'],
      synonyms: ['hospital veterinário', 'consultório veterinário']
    },
    'escritório de advocacia': {
      osmTags: ['lawyer'],
      keywords: ['advocacia', 'advogados', 'direito', 'jurídico'],
      excludeKeywords: ['contabilidade'],
      synonyms: ['advogado']
    },
    'advogado': {
      osmTags: ['lawyer'],
      keywords: ['advocacia', 'advogados', 'direito', 'jurídico'],
      excludeKeywords: ['contabilidade'],
      synonyms: ['escritório de advocacia']
    },
    'contador': {
      osmTags: ['accountant'],
      keywords: ['contador', 'contabilidade', 'contábil', 'assessoria', 'fiscal'],
      excludeKeywords: ['advogado'],
      synonyms: ['contabilidade', 'escritório de contabilidade']
    },
    'contabilidade': {
      osmTags: ['accountant'],
      keywords: ['contador', 'contabilidade', 'contábil', 'assessoria', 'fiscal'],
      excludeKeywords: ['advogado'],
      synonyms: ['contador']
    },
    'hotel': {
      osmTags: ['hotel', 'motel', 'hostel'],
      keywords: ['hotel', 'pousada', 'hospedagem', 'resort', 'motel', 'hostel'],
      excludeKeywords: [],
      synonyms: ['pousada']
    },
    'pousada': {
      osmTags: ['hotel', 'motel', 'hostel'],
      keywords: ['hotel', 'pousada', 'hospedagem', 'resort', 'motel', 'hostel'],
      excludeKeywords: [],
      synonyms: ['hotel']
    },
    'estúdio de estética': {
      osmTags: ['beauty'],
      keywords: ['estética', 'estúdio', 'beleza', 'facial', 'corporal', 'clínica'],
      excludeKeywords: ['odontológica', 'médica'],
      synonyms: ['clínica de estética']
    },
    'padaria': {
      osmTags: ['bakery'],
      keywords: ['padaria', 'pães', 'confeitaria', 'panificadora'],
      excludeKeywords: [],
      synonyms: ['panificadora', 'boulangerie']
    },
    'farmácia': {
      osmTags: ['pharmacy'],
      keywords: ['farmácia', 'drogaria', 'medicamentos'],
      excludeKeywords: [],
      synonyms: ['drogaria']
    },
    'pet shop': {
      osmTags: ['pet'],
      keywords: ['pet', 'shop', 'banho', 'tosa', 'ração', 'animais'],
      excludeKeywords: ['veterinária'],
      synonyms: ['casa de ração']
    },
    'loja de roupas': {
      osmTags: ['clothes'],
      keywords: ['roupas', 'vestuário', 'moda', 'boutique', 'confecções'],
      excludeKeywords: ['tecido'],
      synonyms: ['boutique']
    },
    'loja de celular': {
      osmTags: ['mobile_phone'],
      keywords: ['celular', 'smartphone', 'assistência', 'acessórios', 'capas'],
      excludeKeywords: [],
      synonyms: ['assistência de celular']
    },
    'escola': {
      osmTags: ['school', 'driving_school'],
      keywords: ['escola', 'curso', 'ensino', 'educação', 'colégio', 'aula'],
      excludeKeywords: [],
      synonyms: ['curso']
    },
    'curso': {
      osmTags: ['school', 'driving_school'],
      keywords: ['escola', 'curso', 'ensino', 'educação', 'colégio', 'aula'],
      excludeKeywords: [],
      synonyms: ['escola']
    },
    'bar': {
      osmTags: ['bar', 'pub'],
      keywords: ['bar', 'pub', 'boteco', 'bebidas', 'choperia'],
      excludeKeywords: ['restaurante', 'lanchonete'],
      synonyms: ['boteco', 'pub']
    }
  };

  private normalizeString(str: string): string {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private stemString(str: string): string {
    const s = this.normalizeString(str);
    if (s.endsWith('es') && s.length > 4) return s.slice(0, -2);
    if (s.endsWith('s') && s.length > 3) return s.slice(0, -1);
    return s;
  }

  public getOSMTags(niche: string): string[] {
    const normalizedNiche = this.normalizeString(niche);
    const stemmedNiche = this.stemString(niche);
    
    // Exact match
    for (const [key, val] of Object.entries(this.NICHE_MAP)) {
      if (this.normalizeString(key) === normalizedNiche || this.stemString(key) === stemmedNiche) {
        return val.osmTags;
      }
    }

    // Synonym match
    for (const val of Object.values(this.NICHE_MAP)) {
      if (val.synonyms.some(s => this.normalizeString(s) === normalizedNiche || this.stemString(s) === stemmedNiche)) {
        return val.osmTags;
      }
    }

    return [];
  }

  public calculateMatch(searchNiche: string, businessCategory: string, businessName: string): NicheMatch {
    const normalizedSearch = this.normalizeString(searchNiche);
    const stemmedSearch = this.stemString(searchNiche);
    const normalizedCategory = this.normalizeString(businessCategory);
    const normalizedName = this.normalizeString(businessName);

    let matchConfig = null;
    let matchedKey = '';

    for (const [key, val] of Object.entries(this.NICHE_MAP)) {
      const normKey = this.normalizeString(key);
      const stemKey = this.stemString(key);
      
      const isMatch =
        normKey === normalizedSearch ||
        stemKey === stemmedSearch ||
        normalizedSearch.includes(normKey) ||
        normKey.includes(normalizedSearch) ||
        val.synonyms.some(s => {
          const normS = this.normalizeString(s);
          return normS === normalizedSearch || this.stemString(s) === stemmedSearch || normalizedSearch.includes(normS);
        });

      if (isMatch) {
        matchConfig = val;
        matchedKey = key;
        break;
      }
    }

    if (!matchConfig) {
      // Flexible fallback
      const score =
        (normalizedCategory.includes(stemmedSearch) || normalizedName.includes(stemmedSearch) ||
         normalizedCategory.includes(normalizedSearch) || normalizedName.includes(normalizedSearch))
          ? 75
          : 60; // if provider returned it for this query, give default acceptance
      return {
        score,
        category: searchNiche,
        confidence: 0.6,
        searchTerm: searchNiche,
        matchedCategory: businessCategory
      };
    }

    for (const exclude of matchConfig.excludeKeywords) {
      if (normalizedCategory.includes(this.normalizeString(exclude)) || normalizedName.includes(this.normalizeString(exclude))) {
        return { score: 0, category: matchedKey, confidence: 0.9, searchTerm: searchNiche, matchedCategory: businessCategory };
      }
    }

    let score = 0;
    
    const combinedText = `${normalizedCategory} ${normalizedName}`;
    let matchCount = 0;
    
    for (const kw of matchConfig.keywords) {
      if (combinedText.includes(this.normalizeString(kw))) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      score = Math.min(100, 50 + (matchCount * 15));
    }

    return {
      score,
      category: matchedKey,
      confidence: 0.8,
      searchTerm: searchNiche,
      matchedCategory: businessCategory
    };
  }
}
