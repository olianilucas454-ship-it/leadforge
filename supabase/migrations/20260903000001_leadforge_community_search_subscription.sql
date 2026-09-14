-- ====================================================================
-- LEADFORGE — MIGRATION: COMMUNITY SEARCH USAGE & SUBSCRIPTION (R$ 60/mês)
-- Migration: 20260903000001_leadforge_community_search_subscription.sql
--
-- REGRAS:
-- 1. Remoção de créditos ilimitados para o plano Community (unlimited_credits = false).
-- 2. Nova precificação do plano Community: R$ 60,00/mês (price_cents = 6000).
-- 3. Primeiro mês GRÁTIS (trial de 30 dias).
-- 4. Franquia de 20 PESQUISAS TOTAIS no período gratuito.
-- 5. Nova tabela `search_usage` para controle atômico de pesquisas.
-- 6. RPC atômica `consume_community_search` protegida com FOR UPDATE contra race conditions.
-- 7. Atualização da RPC `redeem_community_invitation` para iniciar o trial de 20 pesquisas.
-- 8. Isolamento RLS com WITH CHECK e auditoria completa em `audit_logs`.
-- ====================================================================

-- 1. ATUALIZAR PLANO COMMUNITY NA TABELA DE PLANOS
UPDATE plans
SET price_cents = 6000,
    monthly_credits = 0,
    unlimited_credits = FALSE,
    features = '["1º Mês Grátis (30 dias)", "20 Pesquisas no período gratuito", "R$ 60/mês após o trial", "Busca Real em todo o Brasil (OSM)", "Relevance Engine 2.0", "Lead Score 2.0", "CRM Kanban", "Website Analyzer", "Exportação CSV"]'::jsonb
WHERE slug = 'community';

-- 2. TABELA DE CONTROLE DE USO DE PESQUISAS (SEARCH_USAGE)
CREATE TABLE IF NOT EXISTS search_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    period_type VARCHAR(50) NOT NULL DEFAULT 'COMMUNITY_TRIAL',
    status VARCHAR(50) NOT NULL DEFAULT 'TRIALING', -- 'TRIALING', 'ACTIVE', 'TRIAL_EXPIRED', 'LIMIT_REACHED'
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    search_limit INTEGER NOT NULL DEFAULT 20,
    searches_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_search_usage_org_period UNIQUE (organization_id, period_type)
);

CREATE INDEX IF NOT EXISTS idx_search_usage_org_status ON search_usage(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_search_usage_user ON search_usage(user_id);

-- 3. ROW LEVEL SECURITY EM SEARCH_USAGE
ALTER TABLE search_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_read_search_usage ON search_usage;
CREATE POLICY tenant_read_search_usage ON search_usage
    FOR SELECT TO authenticated
    USING (organization_id IN (SELECT get_user_org_ids()));

-- Nenhuma inserção ou alteração direta por clientes: apenas via RPCs SECURITY DEFINER!

-- 4. RPC ATÔMICA: CONSUMIR PESQUISA DA COMUNIDADE (CONCORRÊNCIA E LIMITES)
CREATE OR REPLACE FUNCTION consume_community_search(p_org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_is_member BOOLEAN;
    v_org RECORD;
    v_usage RECORD;
    v_new_used INTEGER;
BEGIN
    -- 1. Validar usuário autenticado
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED', 'message', 'Usuário não autenticado.');
    END IF;

    -- 2. Validar tenant (usuário deve pertencer à organização)
    SELECT EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = p_org_id AND user_id = v_user_id
    ) INTO v_is_member;

    IF NOT v_is_member THEN
        RETURN jsonb_build_object('success', false, 'error', 'FORBIDDEN', 'message', 'Acesso negado a esta organização.');
    END IF;

    -- 3. Validar se a organização é do plano Community
    SELECT id, plan_slug, unlimited_credits INTO v_org
    FROM organizations
    WHERE id = p_org_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'ORG_NOT_FOUND', 'message', 'Organização não encontrada.');
    END IF;

    IF v_org.plan_slug != 'community' THEN
        RETURN jsonb_build_object('success', false, 'error', 'NOT_COMMUNITY', 'message', 'Esta organização não utiliza franquia Community.');
    END IF;

    -- 4. Bloqueio FOR UPDATE para garantir atomicidade rigorosa contra race conditions
    SELECT * INTO v_usage
    FROM search_usage
    WHERE organization_id = p_org_id
    ORDER BY created_at DESC
    LIMIT 1
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'NO_ACTIVE_ENTITLEMENT',
            'message', 'Nenhuma franquia de pesquisa ativa encontrada para esta organização.'
        );
    END IF;

    -- 5. Verificar expiração temporal do Trial (30 dias)
    IF v_usage.period_type = 'COMMUNITY_TRIAL' AND NOW() > v_usage.expires_at THEN
        UPDATE search_usage
        SET status = 'TRIAL_EXPIRED', updated_at = NOW()
        WHERE id = v_usage.id;

        INSERT INTO audit_logs (organization_id, user_id, action, details, created_at)
        VALUES (
            p_org_id,
            v_user_id,
            'COMMUNITY_TRIAL_EXPIRED',
            jsonb_build_object('expires_at', v_usage.expires_at, 'searches_used', v_usage.searches_used),
            NOW()
        );

        RETURN jsonb_build_object(
            'success', false,
            'error', 'TRIAL_EXPIRED',
            'message', 'Seu período gratuito da comunidade de 30 dias expirou. Continue utilizando o LEADFORGE por R$ 60/mês.',
            'searches_used', v_usage.searches_used,
            'search_limit', v_usage.search_limit,
            'remaining', 0
        );
    END IF;

    -- 6. Verificar limite de pesquisas (20 pesquisas totais)
    IF v_usage.searches_used >= v_usage.search_limit THEN
        UPDATE search_usage
        SET status = 'LIMIT_REACHED', updated_at = NOW()
        WHERE id = v_usage.id;

        INSERT INTO audit_logs (organization_id, user_id, action, details, created_at)
        VALUES (
            p_org_id,
            v_user_id,
            'COMMUNITY_SEARCH_LIMIT_REACHED',
            jsonb_build_object('limit', v_usage.search_limit, 'searches_used', v_usage.searches_used),
            NOW()
        );

        RETURN jsonb_build_object(
            'success', false,
            'error', 'LIMIT_REACHED',
            'message', 'Você utilizou todas as suas 20 pesquisas gratuitas. Continue utilizando o LEADFORGE por R$ 60/mês.',
            'searches_used', v_usage.searches_used,
            'search_limit', v_usage.search_limit,
            'remaining', 0
        );
    END IF;

    -- 7. Consumir 1 pesquisa de forma atômica
    v_new_used := v_usage.searches_used + 1;

    UPDATE search_usage
    SET searches_used = v_new_used,
        status = CASE WHEN v_new_used >= v_usage.search_limit THEN 'LIMIT_REACHED' ELSE v_usage.status END,
        updated_at = NOW()
    WHERE id = v_usage.id;

    -- 8. Registrar log de auditoria
    INSERT INTO audit_logs (organization_id, user_id, action, details, created_at)
    VALUES (
        p_org_id,
        v_user_id,
        'COMMUNITY_SEARCH_CONSUMED',
        jsonb_build_object(
            'searches_used', v_new_used,
            'search_limit', v_usage.search_limit,
            'remaining', v_usage.search_limit - v_new_used
        ),
        NOW()
    );

    RETURN jsonb_build_object(
        'success', true,
        'searches_used', v_new_used,
        'search_limit', v_usage.search_limit,
        'remaining', v_usage.search_limit - v_new_used,
        'expires_at', v_usage.expires_at
    );
END;
$$;

-- 5. ATUALIZAR RPC REDEEM_COMMUNITY_INVITATION
CREATE OR REPLACE FUNCTION redeem_community_invitation(
    p_code TEXT,
    p_org_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_inv RECORD;
    v_user RECORD;
    v_plan_id UUID;
    v_is_member BOOLEAN;
    v_membership_id UUID;
BEGIN
    -- 1. Validar usuário autenticado
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED', 'message', 'Usuário não autenticado.');
    END IF;

    -- 2. Validar tenant (usuário pertence à organização alvo)
    SELECT EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = p_org_id AND user_id = v_user_id
    ) INTO v_is_member;

    IF NOT v_is_member THEN
        RETURN jsonb_build_object('success', false, 'error', 'FORBIDDEN', 'message', 'Acesso negado: você não pertence a esta organização.');
    END IF;

    -- 3. Obter plano Community
    SELECT id INTO v_plan_id FROM plans WHERE slug = 'community' LIMIT 1;
    IF v_plan_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'PLAN_NOT_FOUND', 'message', 'Plano Community não encontrado.');
    END IF;

    -- 4. Carregar perfil do usuário
    SELECT id, email, name INTO v_user FROM profiles WHERE id = v_user_id;

    -- 5. Travar convite com FOR UPDATE para evitar concorrência/reutilização
    SELECT * INTO v_inv
    FROM invitation_codes
    WHERE code = UPPER(TRIM(p_code))
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'INVALID_CODE', 'message', 'Código de convite inexistente.');
    END IF;

    IF v_inv.status = 'USED' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_USED', 'message', 'Este convite já foi utilizado.');
    END IF;

    IF v_inv.status = 'REVOKED' THEN
        RETURN jsonb_build_object('success', false, 'error', 'REVOKED', 'message', 'Este convite foi revogado pela administração.');
    END IF;

    IF v_inv.expires_at IS NOT NULL AND v_inv.expires_at < NOW() THEN
        RETURN jsonb_build_object('success', false, 'error', 'EXPIRED', 'message', 'Este convite expirou.');
    END IF;

    -- 6. Marcar convite como UTILIZADO
    UPDATE invitation_codes
    SET status = 'USED',
        used_count = 1,
        used_by_user_id = v_user_id,
        used_by_email = v_user.email,
        used_at = NOW()
    WHERE id = v_inv.id;

    -- 7. Ativar membership
    INSERT INTO memberships (
        user_id,
        user_email,
        user_name,
        organization_id,
        plan_id,
        membership_type,
        status,
        community_member,
        invitation_code_id,
        activated_at,
        updated_at
    ) VALUES (
        v_user_id,
        COALESCE(v_user.email, 'membro@leadforge.com'),
        COALESCE(v_user.name, 'Membro da Comunidade'),
        p_org_id,
        v_plan_id,
        'COMMUNITY',
        'ACTIVE',
        TRUE,
        v_inv.id,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id, organization_id) DO UPDATE SET
        status = 'ACTIVE',
        community_member = TRUE,
        invitation_code_id = v_inv.id,
        activated_at = NOW(),
        suspended_at = NULL,
        revoked_at = NULL,
        updated_at = NOW()
    RETURNING id INTO v_membership_id;

    -- 8. Atualizar organização para Community COM CRÉDITOS ILIMITADOS = FALSE
    UPDATE organizations
    SET plan_slug = 'community',
        unlimited_credits = FALSE,
        updated_at = NOW()
    WHERE id = p_org_id;

    -- 9. Inicializar search_usage com franquia de 20 pesquisas e 30 dias de trial
    INSERT INTO search_usage (
        user_id,
        organization_id,
        membership_id,
        period_type,
        status,
        started_at,
        expires_at,
        search_limit,
        searches_used,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        p_org_id,
        v_membership_id,
        'COMMUNITY_TRIAL',
        'TRIALING',
        NOW(),
        NOW() + INTERVAL '30 days',
        20,
        0,
        NOW(),
        NOW()
    )
    ON CONFLICT (organization_id, period_type) DO UPDATE SET
        membership_id = EXCLUDED.membership_id,
        status = 'TRIALING',
        started_at = NOW(),
        expires_at = NOW() + INTERVAL '30 days',
        search_limit = 20,
        searches_used = 0,
        updated_at = NOW();

    -- 10. Registrar auditoria do início do trial
    INSERT INTO audit_logs (
        organization_id,
        user_id,
        user_email,
        action,
        details,
        created_at
    ) VALUES (
        p_org_id,
        v_user_id,
        v_user.email,
        'COMMUNITY_TRIAL_STARTED',
        jsonb_build_object(
            'code', v_inv.code,
            'community_name', v_inv.community_name,
            'search_limit', 20,
            'trial_days', 30,
            'price_after_trial_brl', 60.00
        ),
        NOW()
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Acesso da comunidade ativado com sucesso! 20 pesquisas gratuitas concedidas por 30 dias.',
        'search_limit', 20,
        'searches_used', 0,
        'remaining', 20
    );
END;
$$;

-- 6. RPC CONSULTA DE STATUS DE PESQUISAS DA COMUNIDADE
CREATE OR REPLACE FUNCTION get_community_search_status(p_org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_usage RECORD;
    v_org RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED');
    END IF;

    SELECT id, plan_slug INTO v_org FROM organizations WHERE id = p_org_id;
    IF NOT FOUND OR v_org.plan_slug != 'community' THEN
        RETURN jsonb_build_object('is_community', false);
    END IF;

    SELECT * INTO v_usage
    FROM search_usage
    WHERE organization_id = p_org_id
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'is_community', true,
            'status', 'NO_USAGE_RECORD',
            'searches_used', 0,
            'search_limit', 20,
            'remaining', 20
        );
    END IF;

    RETURN jsonb_build_object(
        'is_community', true,
        'period_type', v_usage.period_type,
        'status', v_usage.status,
        'started_at', v_usage.started_at,
        'expires_at', v_usage.expires_at,
        'search_limit', v_usage.search_limit,
        'searches_used', v_usage.searches_used,
        'remaining', GREATEST(0, v_usage.search_limit - v_usage.searches_used),
        'is_expired', (v_usage.period_type = 'COMMUNITY_TRIAL' AND NOW() > v_usage.expires_at),
        'is_limit_reached', (v_usage.searches_used >= v_usage.search_limit)
    );
END;
$$;