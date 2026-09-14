import { BusinessDataProvider, RawBusinessData, SearchParams } from './types';

// Instant in-memory cache and coordinates dictionary for Brazilian cities
const CITY_COORDS_CACHE: Record<string, { lat: number; lon: number }> = {
  // Goiás & DF
  'goiania': { lat: -16.6869, lon: -49.2648 },
  'aparecida de goiania': { lat: -16.8228, lon: -49.2458 },
  'anapolis': { lat: -16.3267, lon: -48.9534 },
  'rio verde': { lat: -17.7924, lon: -50.9192 },
  'brasilia': { lat: -15.7975, lon: -47.8919 },
  // São Paulo
  'sao paulo': { lat: -23.5505, lon: -46.6333 },
  'campinas': { lat: -22.9099, lon: -47.0626 },
  'guarulhos': { lat: -23.4542, lon: -46.5333 },
  'santo andre': { lat: -23.6639, lon: -46.5383 },
  'sao bernardo do campo': { lat: -23.6944, lon: -46.5653 },
  'osasco': { lat: -23.5329, lon: -46.7922 },
  'ribeirao preto': { lat: -21.1775, lon: -47.8103 },
  'santos': { lat: -23.9608, lon: -46.3336 },
  'sorocaba': { lat: -23.5015, lon: -47.4526 },
  'sao jose dos campos': { lat: -23.2237, lon: -45.9009 },
  // Rio de Janeiro
  'rio de janeiro': { lat: -22.9068, lon: -43.1729 },
  'niteroi': { lat: -22.8833, lon: -43.1039 },
  'duque de caxias': { lat: -22.7858, lon: -43.3117 },
  'nova iguacu': { lat: -22.7556, lon: -43.4603 },
  // Minas Gerais
  'belo horizonte': { lat: -19.9167, lon: -43.9345 },
  'uberlandia': { lat: -18.9186, lon: -48.2772 },
  'contagem': { lat: -19.9322, lon: -44.0539 },
  'juiz de fora': { lat: -21.7587, lon: -43.3496 },
  'betim': { lat: -19.9678, lon: -44.1983 },
  // Sul
  'curitiba': { lat: -25.4284, lon: -49.2733 },
  'londrina': { lat: -23.3045, lon: -51.1696 },
  'maringa': { lat: -23.4205, lon: -51.9333 },
  'porto alegre': { lat: -30.0346, lon: -51.2177 },
  'caxias do sul': { lat: -29.1678, lon: -51.1794 },
  'florianopolis': { lat: -27.5954, lon: -48.5480 },
  'joinville': { lat: -26.3045, lon: -48.8487 },
  // Nordeste
  'salvador': { lat: -12.9777, lon: -38.5016 },
  'feira de santana': { lat: -12.2667, lon: -38.9667 },
  'fortaleza': { lat: -3.7172, lon: -38.5434 },
  'recife': { lat: -8.0476, lon: -34.8770 },
  'natal': { lat: -5.7945, lon: -35.2110 },
  'joao pessoa': { lat: -7.1195, lon: -34.8450 },
  'maceio': { lat: -9.6658, lon: -35.7353 },
  'aracaju': { lat: -10.9472, lon: -37.0731 },
  'teresina': { lat: -5.0919, lon: -42.8034 },
  'sao luis': { lat: -2.5391, lon: -44.2828 },
  // Norte & Centro-Oeste
  'belem': { lat: -1.4558, lon: -48.4902 },
  'manaus': { lat: -3.1190, lon: -60.0217 },
  'cuiaba': { lat: -15.6014, lon: -56.0979 },
  'campo grande': { lat: -20.4697, lon: -54.6201 },
  'vitoria': { lat: -20.3155, lon: -40.3128 },
  'palmas': { lat: -10.1844, lon: -48.3336 },
};

export class OverpassDataProvider implements BusinessDataProvider {
  public name = 'OpenStreetMap & Photon (Leads Reais)';

  /**
   * Fast Haversine distance in km
   */
  private getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = (lat2 - lat1) * 0.017453292519943295;
    const dLon = (lon2 - lon1) * 0.017453292519943295;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * 0.017453292519943295) * Math.cos(lat2 * 0.017453292519943295) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /**
   * Instant geocoding with in-memory dictionary and fast fallback
   */
  private async geocodeCity(city: string, state: string): Promise<{ lat: number; lon: number }> {
    const key = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    // 1. Instant check in dictionary (0ms)
    if (CITY_COORDS_CACHE[key]) {
      return CITY_COORDS_CACHE[key];
    }

    // 2. Fetch Nominatim with fast 1500ms timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const query = encodeURIComponent(`${city}, ${state}, Brasil`);
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'LeadForge-Prospector/1.0 (contact@leadforge.saas)',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          };
          CITY_COORDS_CACHE[key] = coords;
          return coords;
        }
      }
    } catch {
      // Ignore and use fallback
    }

    // Fallback default coordinates (Goiânia center)
    return { lat: -16.6869, lon: -49.2648 };
  }

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  private getSearchKeywords(niche: string): string[] {
    const n = niche.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (n.includes('barbearia') || n.includes('barbeiro')) return ['barbearia', 'barber'];
    if (n.includes('restaurante')) return ['restaurante'];
    if (n.includes('pizza')) return ['pizzaria', 'pizza'];
    if (n.includes('odonto') || n.includes('dentista')) return ['dentista', 'odontologia'];
    if (n.includes('clinica')) return ['clinica odontologica', 'clinica'];
    if (n.includes('academia') || n.includes('fitness')) return ['academia', 'crossfit'];
    if (n.includes('salao') || n.includes('beleza')) return ['salao de beleza', 'cabeleireiro'];
    if (n.includes('oficina') || n.includes('mecanic')) return ['oficina mecanica', 'auto center'];
    if (n.includes('pet') || n.includes('veterinari')) return ['veterinaria', 'pet shop'];
    if (n.includes('imobiliari') || n.includes('imove')) return ['imobiliaria', 'imoveis'];
    if (n.includes('advocac') || n.includes('advogad')) return ['advogado', 'advocacia'];
    if (n.includes('contabil') || n.includes('contador')) return ['contabilidade', 'contador'];
    if (n.includes('padaria') || n.includes('panificador')) return ['padaria'];
    if (n.includes('hotel') || n.includes('pousada')) return ['hotel', 'pousada'];
    if (n.includes('farmacia') || n.includes('drogaria')) return ['farmacia', 'drogaria'];

    const singular = n.endsWith('s') && n.length > 3 ? n.slice(0, -1) : n;
    return [singular, n];
  }

  public async search(params: SearchParams): Promise<RawBusinessData[]> {
    let lat = params.lat;
    let lon = params.lon;

    // Fast coordinate resolution (0ms for all cached/major cities)
    if (!lat || !lon) {
      const coords = await this.geocodeCity(params.city, params.state);
      lat = coords.lat;
      lon = coords.lon;
    }

    const keywords = this.getSearchKeywords(params.niche);
    const limit = Math.min(params.limit || 50, 100);
    const maxRadius = Math.max(params.radiusKm || 25, 5);

    const leads: RawBusinessData[] = [];
    const seen = new Set<string>();

    for (const kw of keywords) {
      if (leads.length >= limit) break;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(kw)}&lat=${lat}&lon=${lon}&limit=${limit * 2}`;
        
        const res = await fetch(photonUrl, {
          headers: {
            'User-Agent': 'LeadForge-DiscoveryEngine/1.0',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.features && Array.isArray(data.features)) {
            for (const feat of data.features) {
              const prop = feat.properties || {};
              const name = prop.name;
              if (!name || name.trim().length < 2) continue;

            const norm = name.toLowerCase().trim();
            if (seen.has(norm)) continue;

            // Filter out non-business administrative entities
            const isNonBusiness =
              prop.osm_key === 'place' ||
              prop.osm_key === 'boundary' ||
              prop.osm_value === 'city' ||
              prop.osm_value === 'administrative' ||
              prop.type === 'locality' ||
              prop.type === 'city' ||
              prop.type === 'district' ||
              norm === params.city.toLowerCase().trim() ||
              norm.startsWith('região metropolitana');

            if (isNonBusiness) continue;

            const coords = feat.geometry?.coordinates || [lon, lat];
            const itemLon = coords[0];
            const itemLat = coords[1];

            // Check distance
            const dist = this.getDistanceKm(lat, lon, itemLat, itemLon);
            if (dist > maxRadius) continue;

            seen.add(norm);

            const street = prop.street || '';
            const housenumber = prop.housenumber || '';
            const neighborhood = prop.district || prop.suburb || prop.neighbourhood || '';
            const city = prop.city || params.city;
            const state = prop.state || params.state;

            const addressParts = [
              street ? `${street}${housenumber ? `, ${housenumber}` : ''}` : '',
              neighborhood,
              `${city} - ${state}`
            ].filter(Boolean);

            const fullAddress = addressParts.join(' - ');
            const categoryFormatted = this.formatCategoryName(prop.osm_value || prop.osm_key, params.niche);

            const phone = prop.phone || prop['contact:phone'] || prop['contact:mobile'];
            const website = prop.website || prop['contact:website'];

            leads.push({
              id: `osm-${prop.osm_type || 'N'}-${prop.osm_id || Math.floor(Math.random() * 1000000)}`,
              name: name.trim(),
              category: categoryFormatted,
              lat: itemLat,
              lon: itemLon,
              phone: phone || undefined,
              whatsapp: phone || undefined,
              website: website ? (website.startsWith('http') ? website : `https://${website}`) : undefined,
              googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${street} ${city} ${state}`)}`,
              address: fullAddress,
              city: city,
              state: state,
              neighborhood: neighborhood || undefined,
              source: 'OpenStreetMap (Dados Reais)',
              dataConfidence: 0.98,
            });

            if (leads.length >= limit) break;
          }

          if (leads.length > 0) {
            return leads;
          }
        }
      }
    } catch (err) {
      console.warn('[OverpassDataProvider] Fast search error or timeout:', err);
    }
  }

  return leads;
}

  private formatCategoryName(tag: string | undefined, fallback: string): string {
    if (!tag) return fallback;
    const map: Record<string, string> = {
      hairdresser: 'Barbearia / Salão',
      barber: 'Barbearia',
      restaurant: 'Restaurante',
      cafe: 'Cafeteria',
      dentist: 'Clínica Odontológica',
      fitness_centre: 'Academia',
      beauty: 'Estética / Salão de Beleza',
      car_repair: 'Oficina Mecânica',
      car_wash: 'Lava Rápido',
      veterinary: 'Clínica Veterinária',
      estate_agent: 'Imobiliária',
      lawyer: 'Advocacia',
      accountant: 'Contabilidade',
      bakery: 'Padaria',
      hotel: 'Hotel',
      pharmacy: 'Farmácia',
    };

    return map[tag] || fallback;
  }
}
