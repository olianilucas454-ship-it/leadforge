-- ====================================================================
-- LEADFORGE — ASAAS GATEWAY & RESEARCH CREDITS LEDGER MIGRATION
-- Migration: 20260917000001_leadforge_asaas_credits.sql
-- ====================================================================

-- 1. ENUM UPDATES & SYNCHRONIZATION
DO $$ BEGIN
    ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'FREE_GRANT';
    ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'SUBSCRIPTION_GRANT';
    ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'RESEARCH_USAGE';
    ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'PURCHASE';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CANONICAL PLAN SEEDING (Free, Starter, Pro, Agency)
INSERT INTO plans (name, slug, monthly_credits, price_cents, unlimited_credits, features) VALUES
('Free', 'free', 5, 0, FALSE, '["5 pesquisas totais", "Qualquer nicho", "Qualquer cidade", "Endereço & Website", "Score do lead", "Leads salvos"]'::jsonb),
('Starter', 'starter', 50, 2990, FALSE, '["50 pesquisas/mês", "Qualquer nicho e cidade", "Telefone & WhatsApp", "Filtros básicos", "Exportação CSV"]'::jsonb),
('Pro', 'pro', 200, 7990, FALSE, '["200 pesquisas/mês", "Busca por raio", "Filtros avançados", "Sem website", "Análise de Website", "CRM Kanban", "CSV & Excel"]'::jsonb),
('Agency', 'agency', 600, 17990, FALSE, '["600 pesquisas/mês", "Busca por raio e mídias sociais", "Prioridade", "Copilot IA Comercial", "Exportação completa"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    monthly_credits = EXCLUDED.monthly_credits,
    price_cents = EXCLUDED.price_cents,
    features = EXCLUDED.features;

-- 3. ASAAS CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS payment_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    asaas_customer_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(30),
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_customers_user ON payment_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_customers_asaas ON payment_customers(asaas_customer_id);

-- 4. SUBSCRIPTIONS TABLE ENHANCEMENTS
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_slug VARCHAR(50) DEFAULT 'free';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS asaas_customer_id VARCHAR(255);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS asaas_subscription_id VARCHAR(255) UNIQUE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS billing_period_start TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS billing_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days');

-- 5. RESEARCH CREDITS BALANCES TABLE
CREATE TABLE IF NOT EXISTS research_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_slug VARCHAR(50) NOT NULL DEFAULT 'free',
    balance INTEGER NOT NULL DEFAULT 5,
    monthly_allowance INTEGER NOT NULL DEFAULT 5,
    billing_period_start TIMESTAMPTZ DEFAULT NOW(),
    billing_period_end TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_research_credits_org UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_research_credits_user ON research_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_research_credits_org ON research_credits(organization_id);

-- 6. RESEARCH CREDIT TRANSACTIONS LEDGER
CREATE TABLE IF NOT EXISTS research_credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    previous_balance INTEGER NOT NULL,
    new_balance INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'FREE_GRANT', 'SUBSCRIPTION_GRANT', 'RESEARCH_USAGE', 'ADMIN_ADJUSTMENT', 'REFUND', 'PURCHASE'
    operation VARCHAR(100) NOT NULL,
    reference_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_credit_tx_org ON research_credit_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_research_credit_tx_user ON research_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_research_credit_tx_created ON research_credit_transactions(created_at DESC);

-- 7. WEBHOOK EVENTS FOR IDEMPOTENCY
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'ASAAS',
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    payload JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_id ON webhook_events(event_id);

-- 8. ATOMIC STORED PROCEDURE: DEDUCT RESEARCH CREDIT (1 RESEARCH SEARCH = 1 CREDIT)
CREATE OR REPLACE FUNCTION deduct_research_credit(
    p_org_id UUID,
    p_user_id UUID,
    p_operation TEXT DEFAULT 'LEAD_RESEARCH',
    p_reference_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARATION
    v_credits RECORD;
    v_org RECORD;
    v_new_balance INT;
    v_tx_id UUID;
BEGIN
    -- Check if org has unlimited credits or is admin master
    SELECT unlimited_credits, plan_slug INTO v_org FROM organizations WHERE id = p_org_id;
    IF v_org.unlimited_credits = TRUE THEN
        RETURN jsonb_build_object(
            'success', true,
            'unlimited', true,
            'balance', 999999,
            'monthly_allowance', 999999
        );
    END IF;

    -- Lock credits row FOR UPDATE to prevent race conditions
    SELECT * INTO v_credits
    FROM research_credits
    WHERE organization_id = p_org_id
    FOR UPDATE;

    IF NOT FOUND THEN
        -- Auto-initialize Free tier record (5 credits) if missing
        INSERT INTO research_credits (
            organization_id, user_id, plan_slug, balance, monthly_allowance, billing_period_start
        ) VALUES (
            p_org_id, p_user_id, 'free', 5, 5, NOW()
        )
        RETURNING * INTO v_credits;
    END IF;

    IF v_credits.balance < 1 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INSUFFICIENT_CREDITS',
            'message', 'Você não possui pesquisas suficientes para executar esta busca.',
            'balance', v_credits.balance,
            'monthly_allowance', v_credits.monthly_allowance
        );
    END IF;

    -- Deduct 1 credit atomically
    v_new_balance := v_credits.balance - 1;
    UPDATE research_credits
    SET balance = v_new_balance, updated_at = NOW()
    WHERE id = v_credits.id;

    -- Log transaction
    INSERT INTO research_credit_transactions (
        organization_id, user_id, amount, previous_balance, new_balance, type, operation, reference_id, created_at
    ) VALUES (
        p_org_id, p_user_id, -1, v_credits.balance, v_new_balance, 'RESEARCH_USAGE', p_operation, p_reference_id, NOW()
    ) RETURNING id INTO v_tx_id;

    RETURN jsonb_build_object(
        'success', true,
        'unlimited', false,
        'balance', v_new_balance,
        'monthly_allowance', v_credits.monthly_allowance,
        'transaction_id', v_tx_id
    );
END;
$$;

-- 9. ATOMIC STORED PROCEDURE: REFUND RESEARCH CREDIT
CREATE OR REPLACE FUNCTION refund_research_credit(
    p_org_id UUID,
    p_user_id UUID,
    p_transaction_id UUID DEFAULT NULL,
    p_reason TEXT DEFAULT 'RESEARCH_FAILED'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_credits RECORD;
    v_new_balance INT;
BEGIN
    SELECT * INTO v_credits
    FROM research_credits
    WHERE organization_id = p_org_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'RECORD_NOT_FOUND');
    END IF;

    v_new_balance := v_credits.balance + 1;
    UPDATE research_credits
    SET balance = v_new_balance, updated_at = NOW()
    WHERE id = v_credits.id;

    INSERT INTO research_credit_transactions (
        organization_id, user_id, amount, previous_balance, new_balance, type, operation, reference_id, metadata, created_at
    ) VALUES (
        p_org_id, p_user_id, 1, v_credits.balance, v_new_balance, 'REFUND', 'RESEARCH_REFUND', p_transaction_id::text, jsonb_build_object('reason', p_reason), NOW()
    );

    RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

-- 10. ATOMIC STORED PROCEDURE: GRANT SUBSCRIPTION CREDITS (NON-ACCUMULATING RESET)
CREATE OR REPLACE FUNCTION grant_subscription_credits(
    p_org_id UUID,
    p_user_id UUID,
    p_plan_slug TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_allowance INT;
    v_credits RECORD;
    v_old_balance INT;
BEGIN
    -- Determine monthly allowance by plan
    CASE LOWER(p_plan_slug)
        WHEN 'starter' THEN v_allowance := 50;
        WHEN 'pro' THEN v_allowance := 200;
        WHEN 'agency' THEN v_allowance := 600;
        ELSE v_allowance := 5;
    END CASE;

    SELECT * INTO v_credits FROM research_credits WHERE organization_id = p_org_id FOR UPDATE;

    IF NOT FOUND THEN
        INSERT INTO research_credits (
            organization_id, user_id, plan_slug, balance, monthly_allowance, billing_period_start, billing_period_end
        ) VALUES (
            p_org_id, p_user_id, p_plan_slug, v_allowance, v_allowance, NOW(), NOW() + INTERVAL '30 days'
        );
        v_old_balance := 0;
    ELSE
        v_old_balance := v_credits.balance;
        -- NON-ACCUMULATING: reset balance directly to maximum allowance
        UPDATE research_credits
        SET plan_slug = p_plan_slug,
            balance = v_allowance,
            monthly_allowance = v_allowance,
            billing_period_start = NOW(),
            billing_period_end = NOW() + INTERVAL '30 days',
            updated_at = NOW()
        WHERE id = v_credits.id;
    END IF;

    -- Update organization plan_slug
    UPDATE organizations
    SET plan_slug = p_plan_slug, updated_at = NOW()
    WHERE id = p_org_id;

    -- Audit Transaction
    INSERT INTO research_credit_transactions (
        organization_id, user_id, amount, previous_balance, new_balance, type, operation, metadata, created_at
    ) VALUES (
        p_org_id, p_user_id, v_allowance, v_old_balance, v_allowance, 'SUBSCRIPTION_GRANT', 'MONTHLY_RENEWAL', jsonb_build_object('plan_slug', p_plan_slug, 'allowance', v_allowance), NOW()
    );

    RETURN jsonb_build_object(
        'success', true,
        'plan_slug', p_plan_slug,
        'balance', v_allowance,
        'monthly_allowance', v_allowance
    );
END;
$$;

-- 11. ROW LEVEL SECURITY POLICIES
ALTER TABLE payment_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_read_payment_customers ON payment_customers;
CREATE POLICY tenant_read_payment_customers ON payment_customers
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_read_research_credits ON research_credits;
CREATE POLICY tenant_read_research_credits ON research_credits
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_read_research_credit_transactions ON research_credit_transactions;
CREATE POLICY tenant_read_research_credit_transactions ON research_credit_transactions
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT get_user_org_ids()));
