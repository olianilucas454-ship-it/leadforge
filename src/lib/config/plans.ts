export interface PlanDefinition {
  id: string;
  name: string;
  slug: 'free' | 'starter' | 'pro' | 'agency';
  researchCredits: number;
  price: number;
  billing: 'one_time' | 'monthly';
  description: string;
  ctaText: string;
  isPopular?: boolean;
  features: string[];
}

export const PLAN_CONFIG: Record<'free' | 'starter' | 'pro' | 'agency', PlanDefinition> = {
  free: {
    id: 'plan_free',
    name: 'Free',
    slug: 'free',
    researchCredits: 5,
    price: 0,
    billing: 'one_time',
    description: 'Comece gratuitamente',
    ctaText: 'Começar grátis',
    features: [
      '5 pesquisas totais',
      'Qualquer nicho',
      'Qualquer cidade',
      'Busca de empresas',
      'Endereço & Website',
      'Score do lead',
      'Leads salvos',
    ],
  },
  starter: {
    id: 'plan_starter',
    name: 'Starter',
    slug: 'starter',
    researchCredits: 50,
    price: 29.90,
    billing: 'monthly',
    description: 'Para quem está começando a prospectar',
    ctaText: 'Assinar Starter',
    features: [
      '50 pesquisas/mês',
      'Qualquer nicho',
      'Qualquer cidade',
      'Busca de empresas',
      'Telefone quando disponível',
      'WhatsApp quando disponível',
      'Endereço & Website',
      'Score do lead',
      'Filtros básicos',
      'Histórico de pesquisas',
      'Leads salvos',
      'Exportação CSV',
    ],
  },
  pro: {
    id: 'plan_pro',
    name: 'Pro',
    slug: 'pro',
    researchCredits: 200,
    price: 79.90,
    billing: 'monthly',
    isPopular: true,
    description: 'Para quem leva prospecção a sério',
    ctaText: 'Começar com Pro',
    features: [
      '200 pesquisas/mês',
      'Qualquer nicho, cidade ou estado',
      'Busca por raio de localização',
      'Filtros avançados',
      'Empresas sem website',
      'Telefone & WhatsApp quando disponível',
      'Endereço, Website & Instagram',
      'Lead Score & Análise de Website',
      'Leads salvos & Histórico completo',
      'Exportação CSV & Excel',
      'CRM de Vendas Kanban',
    ],
  },
  agency: {
    id: 'plan_agency',
    name: 'Agency',
    slug: 'agency',
    researchCredits: 600,
    price: 179.90,
    billing: 'monthly',
    description: 'Para operações de prospecção em maior escala',
    ctaText: 'Assinar Agency',
    features: [
      '600 pesquisas/mês',
      'Qualquer nicho, cidade ou estado',
      'Busca por raio & Filtros avançados',
      'Empresas sem website',
      'Telefone & WhatsApp quando disponível',
      'Endereço, Website & Mídias Sociais',
      'Lead Score & Análise de Website',
      'Histórico completo & Leads salvos',
      'Exportação CSV, Excel & JSON',
      'CRM de Vendas Kanban completo',
      'Gerador de Abordagens Comerciais IA',
      'Maiores limites operacionais do sistema',
    ],
  },
};

export function getPlanBySlug(slug: string): PlanDefinition {
  const normalized = (slug || 'free').toLowerCase() as keyof typeof PLAN_CONFIG;
  return PLAN_CONFIG[normalized] || PLAN_CONFIG.free;
}
