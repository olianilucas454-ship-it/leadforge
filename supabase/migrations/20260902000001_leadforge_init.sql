-- ====================================================================
-- LEADFORGE INTELLIGENCE ENGINE — INITIAL DATABASE MIGRATION
-- Multi-tenancy, Row Level Security (RLS), Leads, AI & Credit Tracking
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE lead_status AS ENUM ('NOVO', 'CONTATADO', 'RESPONDEU', 'INTERESSADO', 'REUNIÃO', 'PROPOSTA', 'NEGOCIAÇÃO', 'GANHO', 'PERDIDO');
CREATE TYPE website_status_type AS ENUM ('FOUND', 'NOT_FOUND', 'NOT_VERIFIED');
CREATE TYPE credit_transaction_type AS ENUM ('SEARCH', 'AI_ANALYSIS', 'MESSAGE_GENERATION', 'WEBSITE_ANALYSIS', 'REFUND', 'BONUS', 'ADMIN_ADJUSTMENT', 'COMMUNITY_UNLIMITED');
CREATE TYPE proposal_status AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED');
CREATE TYPE search_job_status AS ENUM ('SEARCH_CREATED', 'DISCOVERING', 'NORMALIZING', 'DEDUPLICATING', 'ENRICHING', 'ANALYZING', 'SCORING', 'COMPLETED', 'FAILED');

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    business_type VARCHAR(100) DEFAULT 'Agência',
    services_offered TEXT[] DEFAULT ARRAY['Criação de Sites', 'Landing Pages'],
    average_ticket_cents INTEGER DEFAULT 250000,
    commercial_objective TEXT,
    plan_slug VARCHAR(50) DEFAULT 'trial',
    unlimited_credits BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORGANIZATION MEMBERS (Multi-tenancy Link)
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- 6. PLANS & SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    monthly_credits INTEGER NOT NULL DEFAULT 500,
    price_cents INTEGER NOT NULL DEFAULT 0,
    unlimited_credits BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status VARCHAR(50) DEFAULT 'active',
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CREDITS & TRANSACTIONS LEDGER
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 250,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    previous_balance INTEGER NOT NULL,
    new_balance INTEGER NOT NULL,
    type credit_transaction_type NOT NULL,
    operation VARCHAR(100) NOT NULL,
    reference_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SEARCHES & ASYNC JOBS
CREATE TABLE IF NOT EXISTS searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    query VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    radius_km INTEGER DEFAULT 25,
    results_count INTEGER DEFAULT 0,
    filters JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status search_job_status NOT NULL DEFAULT 'SEARCH_CREATED',
    query VARCHAR(255) NOT NULL,
    total_found INTEGER DEFAULT 0,
    normalized_count INTEGER DEFAULT 0,
    enriched_count INTEGER DEFAULT 0,
    current_step VARCHAR(100) DEFAULT 'Iniciando',
    progress_percent INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LEADS
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    normalized_category VARCHAR(100) NOT NULL,
    address TEXT,
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Brasil',
    postal_code VARCHAR(30),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    phone VARCHAR(50),
    has_whatsapp BOOLEAN DEFAULT FALSE,
    whatsapp VARCHAR(50),
    website TEXT,
    website_status website_status_type DEFAULT 'NOT_VERIFIED',
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    email VARCHAR(255),
    rating NUMERIC(2, 1) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    status lead_status DEFAULT 'NOVO',
    deal_value_cents INTEGER DEFAULT 250000,
    lead_score INTEGER DEFAULT 50,
    digital_presence_score INTEGER DEFAULT 30,
    opportunity_summary TEXT,
    recommended_service VARCHAR(255),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. LEAD ENRICHMENTS & SOURCES
CREATE TABLE IF NOT EXISTS lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    source_provider VARCHAR(100) NOT NULL,
    source_id VARCHAR(255),
    raw_data JSONB DEFAULT '{}'::jsonb,
    confidence NUMERIC(3, 2) DEFAULT 0.90,
    collected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_enrichments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    value TEXT,
    source VARCHAR(100) NOT NULL,
    confidence NUMERIC(3, 2) DEFAULT 0.85,
    collected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. LEAD SCORES BREAKDOWN
CREATE TABLE IF NOT EXISTS lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID UNIQUE NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL,
    missing_website_pts INTEGER DEFAULT 0,
    weak_website_pts INTEGER DEFAULT 0,
    phone_pts INTEGER DEFAULT 0,
    social_pts INTEGER DEFAULT 0,
    active_business_pts INTEGER DEFAULT 0,
    high_reviews_pts INTEGER DEFAULT 0,
    high_rating_pts INTEGER DEFAULT 0,
    service_fit_pts INTEGER DEFAULT 0,
    explanation JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WEBSITE ANALYSES
CREATE TABLE IF NOT EXISTS website_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_https BOOLEAN DEFAULT FALSE,
    http_status INTEGER DEFAULT 200,
    is_mobile_responsive BOOLEAN DEFAULT FALSE,
    has_viewport BOOLEAN DEFAULT FALSE,
    title TEXT,
    meta_description TEXT,
    has_cta BOOLEAN DEFAULT FALSE,
    has_whatsapp_button BOOLEAN DEFAULT FALSE,
    has_contact_form BOOLEAN DEFAULT FALSE,
    performance_score INTEGER DEFAULT 50,
    seo_score INTEGER DEFAULT 50,
    mobile_score INTEGER DEFAULT 50,
    overall_score INTEGER DEFAULT 50,
    sales_pitch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. LEAD LISTS & ITEMS
CREATE TABLE IF NOT EXISTS lead_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#0ea5e9',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES lead_lists(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (list_id, lead_id)
);

-- 14. NOTES, ACTIVITIES & TASKS
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PROPOSALS & AI USAGE
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    problem_diagnosed TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    scope TEXT[] DEFAULT ARRAY[]::TEXT[],
    investment_cents INTEGER NOT NULL DEFAULT 250000,
    timeline_days INTEGER DEFAULT 14,
    call_to_action TEXT NOT NULL,
    status proposal_status DEFAULT 'DRAFT',
    sent_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    prompt_type VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    estimated_cost_usd NUMERIC(8, 6) DEFAULT 0.0,
    result_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    operation VARCHAR(100) NOT NULL,
    credits_consumed INTEGER DEFAULT 1,
    latency_ms INTEGER DEFAULT 0,
    is_success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FEEDBACK & AUDIT LOGS
CREATE TABLE IF NOT EXISTS lead_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    lead_score_at_event INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's organization ids
CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS TABLE (org_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT organization_id
  FROM organization_members
  WHERE user_id = auth.uid();
END;
$$;

-- Isolation Policy for Leads
CREATE POLICY tenant_isolation_leads ON leads
  FOR ALL
  USING (organization_id IN (SELECT get_user_org_ids()));

-- Isolation Policy for Searches
CREATE POLICY tenant_isolation_searches ON searches
  FOR ALL
  USING (organization_id IN (SELECT get_user_org_ids()));

-- Isolation Policy for Credits
CREATE POLICY tenant_isolation_credits ON credits
  FOR ALL
  USING (organization_id IN (SELECT get_user_org_ids()));

-- Isolation Policy for Proposals
CREATE POLICY tenant_isolation_proposals ON proposals
  FOR ALL
  USING (organization_id IN (SELECT get_user_org_ids()));

-- Isolation Policy for Tasks
CREATE POLICY tenant_isolation_lead_tasks ON lead_tasks
  FOR ALL
  USING (organization_id IN (SELECT get_user_org_ids()));

-- 18. INITIAL SEED PLANS (Canonical 4 Plans)
INSERT INTO plans (name, slug, monthly_credits, price_cents, unlimited_credits, features) VALUES
('Trial', 'trial', 50, 0, FALSE, '["50 créditos para teste", "Busca básica", "CRM Kanban", "Visualização de contatos"]'::jsonb),
('Community', 'community', 0, 0, TRUE, '["Créditos Ilimitados para membros", "Busca em todo o Brasil", "Relevance Engine 2.0", "Lead Score 2.0", "CRM Kanban", "Website Analyzer", "Exportação CSV"]'::jsonb),
('Pro', 'pro', 2500, 14700, FALSE, '["2.500 créditos/mês", "Busca Multi-fonte", "OpenAI Copilot Comercial", "Geração ilimitada de propostas", "Website Analyzer Completo", "Exportação Excel/JSON/CSV", "Suporte prioritário"]'::jsonb),
('Agency', 'agency', 10000, 39700, FALSE, '["10.000 créditos/mês", "Multi-usuários ilimitados", "API e Webhooks", "Prioridade na fila de enriquecimento", "Automações de follow-up", "Gerente de contas dedicado"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;