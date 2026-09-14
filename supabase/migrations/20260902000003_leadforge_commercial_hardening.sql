-- ====================================================================
-- LEADFORGE COMMERCIAL LAYER HARDENING & PRODUCTION AUDIT MIGRATION
-- Migration: 20260902_leadforge_commercial_hardening.sql
-- Dependencies: 20260902_leadforge_init.sql, 20260902_leadforge_commercial.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM SYNCHRONIZATION (Idempotent)
DO $$ BEGIN
    ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'COMMUNITY_UNLIMITED';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. SCHEMA HARMONIZATION & COMPATIBILITY
-- Harmonize subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'STRIPE';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider_subscription_id VARCHAR(255);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Harmonize audit_logs table
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_hash VARCHAR(64);
DO $$ BEGIN
  ALTER TABLE audit_logs ALTER COLUMN entity_type DROP NOT NULL;
  ALTER TABLE audit_logs ALTER COLUMN entity_type SET DEFAULT 'COMMERCIAL';
EXCEPTION
  WHEN undefined_column THEN null;
END $$;

-- 4. CANONICAL COMMERCIAL PLANS SYNCHRONIZATION (Rule 2, 3, 4: Trial, Community, Pro, Agency)
INSERT INTO plans (name, slug, monthly_credits, price_cents, unlimited_credits, features) VALUES
('Trial', 'trial', 50, 0, FALSE, '["50 créditos para teste", "Busca básica", "CRM Kanban", "Visualização de contatos"]'::jsonb),
('Community', 'community', 0, 0, TRUE, '["Créditos Ilimitados para membros", "Busca em todo o Brasil", "Relevance Engine 2.0", "Lead Score 2.0", "CRM Kanban", "Website Analyzer", "Exportação CSV"]'::jsonb),
('Pro', 'pro', 2500, 14700, FALSE, '["2.500 créditos/mês", "Busca Multi-fonte", "OpenAI Copilot Comercial", "Geração ilimitada de propostas", "Website Analyzer Completo", "Exportação Excel/JSON/CSV", "Suporte prioritário"]'::jsonb),
('Agency', 'agency', 10000, 39700, FALSE, '["10.000 créditos/mês", "Multi-usuários ilimitados", "API e Webhooks", "Prioridade na fila de enriquecimento", "Automações de follow-up", "Gerente de contas dedicado"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    monthly_credits = EXCLUDED.monthly_credits,
    price_cents = EXCLUDED.price_cents,
    unlimited_credits = EXCLUDED.unlimited_credits,
    features = EXCLUDED.features;

-- Seed canonical feature entitlements for each plan
INSERT INTO feature_entitlements (plan_id, feature_key, is_enabled, usage_limit)
SELECT p.id, feat.key, feat.enabled, feat.usage_lim
FROM plans p
CROSS JOIN (
  VALUES
    ('leadSearch', true, NULL::INTEGER),
    ('aiCopilot', true, NULL::INTEGER),
    ('websiteAudit', true, NULL::INTEGER),
    ('proposalGenerator', true, NULL::INTEGER),
    ('crmKanban', true, NULL::INTEGER),
    ('exportCsv', true, NULL::INTEGER),
    ('exportExcel', true, NULL::INTEGER),
    ('apiWebhooks', false, NULL::INTEGER)
) AS feat(key, enabled, usage_lim)
WHERE p.slug = 'community'
ON CONFLICT (plan_id, feature_key) DO NOTHING;

INSERT INTO feature_entitlements (plan_id, feature_key, is_enabled, usage_limit)
SELECT p.id, feat.key, feat.enabled, feat.usage_lim
FROM plans p
CROSS JOIN (
  VALUES
    ('leadSearch', true, 50::INTEGER),
    ('aiCopilot', false, NULL::INTEGER),
    ('websiteAudit', false, NULL::INTEGER),
    ('proposalGenerator', false, NULL::INTEGER),
    ('crmKanban', true, NULL::INTEGER),
    ('exportCsv', false, NULL::INTEGER),
    ('exportExcel', false, NULL::INTEGER),
    ('apiWebhooks', false, NULL::INTEGER)
) AS feat(key, enabled, usage_lim)
WHERE p.slug = 'trial'
ON CONFLICT (plan_id, feature_key) DO NOTHING;

-- 5. SECURE INVITATION GENERATOR (64-bit entropy, search_path = public, admin check)
CREATE OR REPLACE FUNCTION generate_secure_invitation_code(
  p_community_name TEXT DEFAULT 'Comunidade Oficial LEADFORGE',
  p_expires_days INT DEFAULT 90
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_part1 TEXT;
  v_part2 TEXT;
  v_part3 TEXT;
  v_code TEXT;
  v_inv_id UUID;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Apenas usuários autenticados podem gerar códigos de convite.';
  END IF;

  -- Verify caller is OWNER or ADMIN
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE user_id = v_user_id AND role IN ('OWNER', 'ADMIN')
  ) INTO v_is_admin;

  IF NOT v_is_admin AND current_user != 'postgres' AND current_setting('role', true) != 'service_role' THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem emitir convites.';
  END IF;

  -- 64 bits of true cryptographic entropy (8 random bytes formatted in hex)
  v_part1 := UPPER(SUBSTRING(ENCODE(gen_random_bytes(8), 'hex') FROM 1 FOR 4));
  v_part2 := UPPER(SUBSTRING(ENCODE(gen_random_bytes(8), 'hex') FROM 5 FOR 4));
  v_part3 := UPPER(SUBSTRING(ENCODE(gen_random_bytes(8), 'hex') FROM 9 FOR 4));
  v_code := 'LF-' || v_part1 || '-' || v_part2 || '-' || v_part3;

  INSERT INTO invitation_codes (
    code,
    community_name,
    status,
    max_uses,
    used_count,
    expires_at,
    created_by,
    created_at
  ) VALUES (
    v_code,
    p_community_name,
    'AVAILABLE',
    1,
    0,
    NOW() + (p_expires_days || ' days')::INTERVAL,
    v_user_id,
    NOW()
  ) RETURNING id INTO v_inv_id;

  INSERT INTO audit_logs (
    user_id,
    action,
    details,
    created_at
  ) VALUES (
    v_user_id,
    'INVITATION_CREATED',
    jsonb_build_object('code', v_code, 'community_name', p_community_name, 'expires_days', p_expires_days),
    NOW()
  );

  RETURN v_code;
END;
$$;

-- 6. ATOMIC INVITATION REDEMPTION PROCEDURE (Anti-Race Condition, Tenant Validated)
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
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Usuário não autenticado.');
  END IF;

  -- Tenant boundary validation: caller must belong to p_org_id
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = p_org_id AND user_id = v_user_id
  ) INTO v_is_member;

  IF NOT v_is_member AND current_user != 'postgres' AND current_setting('role', true) != 'service_role' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso negado: o usuário não pertence a esta organização.');
  END IF;

  -- 1. Lock invitation row with FOR UPDATE
  SELECT * INTO v_inv
  FROM invitation_codes
  WHERE UPPER(code) = UPPER(TRIM(p_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Código de convite não encontrado.');
  END IF;

  IF v_inv.status = 'USED' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este código de convite já foi utilizado.');
  END IF;

  IF v_inv.status = 'REVOKED' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este código de convite foi revogado.');
  END IF;

  IF v_inv.expires_at IS NOT NULL AND v_inv.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este código de convite expirou.');
  END IF;

  -- Get user and plan details
  SELECT * INTO v_user FROM profiles WHERE id = v_user_id;
  SELECT id INTO v_plan_id FROM plans WHERE slug = 'community' LIMIT 1;

  -- 2. Mark code as USED atomically
  UPDATE invitation_codes
  SET status = 'USED',
      used_count = 1,
      used_by_user_id = v_user_id,
      used_by_email = v_user.email,
      used_at = NOW()
  WHERE id = v_inv.id;

  -- 3. Upsert active community membership
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
    updated_at = NOW();

  -- 4. Update organization to Community unlimited plan
  UPDATE organizations
  SET plan_slug = 'community',
      unlimited_credits = TRUE,
      updated_at = NOW()
  WHERE id = p_org_id;

  -- 5. Audit Log
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
    'COMMUNITY_ACTIVATED',
    jsonb_build_object('code', v_inv.code, 'community_name', v_inv.community_name),
    NOW()
  );

  RETURN jsonb_build_object('success', true, 'message', 'Acesso da comunidade ativado com sucesso!');
END;
$$;

-- 7. ATOMIC CREDIT DEDUCTION PROCEDURE (Concurrency Protection, Anti-Negative Balance)
CREATE OR REPLACE FUNCTION deduct_organization_credits(
  p_org_id UUID,
  p_amount INT,
  p_operation TEXT,
  p_reference_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_is_member BOOLEAN;
  v_org RECORD;
  v_credits RECORD;
  v_new_balance INT;
BEGIN
  v_user_id := auth.uid();

  -- Verify caller belongs to organization (or service_role)
  IF current_setting('role', true) != 'service_role' AND current_user != 'postgres' THEN
    IF v_user_id IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'Usuário não autenticado.');
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = p_org_id AND user_id = v_user_id
    ) INTO v_is_member;

    IF NOT v_is_member THEN
      RETURN jsonb_build_object('success', false, 'error', 'Acesso negado à organização.');
    END IF;
  END IF;

  -- 1. Check if organization has unlimited credits
  SELECT * INTO v_org FROM organizations WHERE id = p_org_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Organização não encontrada.');
  END IF;

  IF v_org.unlimited_credits = TRUE OR v_org.plan_slug = 'community' THEN
    -- Community member: log transaction with 0 debit, never block
    INSERT INTO credit_transactions (
      organization_id,
      amount,
      previous_balance,
      new_balance,
      type,
      operation,
      reference_id,
      metadata,
      created_at
    ) VALUES (
      p_org_id,
      0,
      0,
      0,
      'COMMUNITY_UNLIMITED'::credit_transaction_type,
      p_operation,
      p_reference_id,
      '{"unlimited": true}'::jsonb,
      NOW()
    );
    RETURN jsonb_build_object('success', true, 'unlimited', true, 'balance', 0);
  END IF;

  -- 2. Finite plan: Lock credits row FOR UPDATE
  SELECT * INTO v_credits FROM credits WHERE organization_id = p_org_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registro de créditos não encontrado.');
  END IF;

  IF v_credits.balance < p_amount THEN
    -- Insufficient balance
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Créditos insuficientes.',
      'current_balance', v_credits.balance,
      'required_amount', p_amount
    );
  END IF;

  -- 3. Atomic deduction (guaranteed balance >= 0)
  v_new_balance := v_credits.balance - p_amount;
  UPDATE credits SET balance = v_new_balance, updated_at = NOW() WHERE organization_id = p_org_id;

  INSERT INTO credit_transactions (
    organization_id,
    amount,
    previous_balance,
    new_balance,
    type,
    operation,
    reference_id,
    created_at
  ) VALUES (
    p_org_id,
    -p_amount,
    v_credits.balance,
    v_new_balance,
    'SEARCH'::credit_transaction_type,
    p_operation,
    p_reference_id,
    NOW()
  );

  RETURN jsonb_build_object('success', true, 'unlimited', false, 'new_balance', v_new_balance);
END;
$$;

-- 8. PRIVILEGE ESCALATION PROTECTION TRIGGER (Rule 6)
CREATE OR REPLACE FUNCTION protect_organization_plan_elevation()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- If client tries to directly elevate unlimited_credits or plan_slug without admin/service_role
  IF (NEW.unlimited_credits IS DISTINCT FROM OLD.unlimited_credits OR NEW.plan_slug IS DISTINCT FROM OLD.plan_slug) THEN
    IF current_user != 'postgres' AND current_setting('role', true) != 'service_role' THEN
      RAISE EXCEPTION 'A alteração do plano e de créditos ilimitados deve ser realizada através do canal oficial de convites ou gateway.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_org_plan ON organizations;
CREATE TRIGGER trg_protect_org_plan
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION protect_organization_plan_elevation();

-- 9. COMPREHENSIVE RLS POLICIES WITH "WITH CHECK" (Rule 9 & 10)

-- ORGANIZATIONS
DROP POLICY IF EXISTS tenant_read_organizations ON organizations;
CREATE POLICY tenant_read_organizations ON organizations
  FOR SELECT TO authenticated
  USING (id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS admin_update_organizations ON organizations;
CREATE POLICY admin_update_organizations ON organizations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  );

-- ORGANIZATION MEMBERS
DROP POLICY IF EXISTS tenant_read_organization_members ON organization_members;
CREATE POLICY tenant_read_organization_members ON organization_members
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS admin_manage_organization_members ON organization_members;
CREATE POLICY admin_manage_organization_members ON organization_members
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  );

-- CREDITS
DROP POLICY IF EXISTS tenant_isolation_credits ON credits;
CREATE POLICY tenant_isolation_credits ON credits
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

-- CREDIT TRANSACTIONS
DROP POLICY IF EXISTS tenant_isolation_credit_transactions ON credit_transactions;
CREATE POLICY tenant_isolation_credit_transactions ON credit_transactions
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

-- LEADS
DROP POLICY IF EXISTS tenant_isolation_leads ON leads;
CREATE POLICY tenant_isolation_leads ON leads
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

-- LEAD SOURCES
DROP POLICY IF EXISTS tenant_isolation_lead_sources ON lead_sources;
CREATE POLICY tenant_isolation_lead_sources ON lead_sources
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_sources.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_sources.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  );

-- LEAD ENRICHMENTS
DROP POLICY IF EXISTS tenant_isolation_lead_enrichments ON lead_enrichments;
CREATE POLICY tenant_isolation_lead_enrichments ON lead_enrichments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_enrichments.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_enrichments.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  );

-- LEAD SCORES
DROP POLICY IF EXISTS tenant_isolation_lead_scores ON lead_scores;
CREATE POLICY tenant_isolation_lead_scores ON lead_scores
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_scores.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_scores.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  );

-- WEBSITE ANALYSES
DROP POLICY IF EXISTS tenant_isolation_website_analyses ON website_analyses;
CREATE POLICY tenant_isolation_website_analyses ON website_analyses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = website_analyses.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = website_analyses.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  );

-- SEARCHES & SEARCH JOBS
DROP POLICY IF EXISTS tenant_isolation_searches ON searches;
CREATE POLICY tenant_isolation_searches ON searches
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_isolation_search_jobs ON search_jobs;
CREATE POLICY tenant_isolation_search_jobs ON search_jobs
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

-- LEAD LISTS & ITEMS
DROP POLICY IF EXISTS tenant_isolation_lead_lists ON lead_lists;
CREATE POLICY tenant_isolation_lead_lists ON lead_lists
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_isolation_lead_list_items ON lead_list_items;
CREATE POLICY tenant_isolation_lead_list_items ON lead_list_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lead_lists ll
      WHERE ll.id = lead_list_items.list_id
        AND ll.organization_id IN (SELECT get_user_org_ids())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lead_lists ll
      WHERE ll.id = lead_list_items.list_id
        AND ll.organization_id IN (SELECT get_user_org_ids())
    )
  );

-- NOTES, ACTIVITIES & TASKS
DROP POLICY IF EXISTS tenant_isolation_lead_notes ON lead_notes;
CREATE POLICY tenant_isolation_lead_notes ON lead_notes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_notes.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_notes.lead_id
        AND l.organization_id IN (SELECT get_user_org_ids())
    )
  );

DROP POLICY IF EXISTS tenant_isolation_lead_activities ON lead_activities;
CREATE POLICY tenant_isolation_lead_activities ON lead_activities
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_isolation_lead_tasks ON lead_tasks;
CREATE POLICY tenant_isolation_lead_tasks ON lead_tasks
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

-- PROPOSALS & AI
DROP POLICY IF EXISTS tenant_isolation_proposals ON proposals;
CREATE POLICY tenant_isolation_proposals ON proposals
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_isolation_ai_generations ON ai_generations;
CREATE POLICY tenant_isolation_ai_generations ON ai_generations
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_isolation_provider_usage ON provider_usage;
CREATE POLICY tenant_isolation_provider_usage ON provider_usage
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_isolation_lead_feedback ON lead_feedback;
CREATE POLICY tenant_isolation_lead_feedback ON lead_feedback
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS tenant_isolation_notifications ON notifications;
CREATE POLICY tenant_isolation_notifications ON notifications
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()) AND (user_id IS NULL OR user_id = auth.uid()))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

-- COMMERCIAL ENTITIES
DROP POLICY IF EXISTS admin_manage_invitations ON invitation_codes;
CREATE POLICY admin_manage_invitations ON invitation_codes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS tenant_isolation_memberships ON memberships;
DROP POLICY IF EXISTS read_own_membership ON memberships;
CREATE POLICY read_own_membership ON memberships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS admin_manage_memberships ON memberships;
CREATE POLICY admin_manage_memberships ON memberships
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = memberships.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = memberships.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS tenant_isolation_user_sessions ON user_sessions;
DROP POLICY IF EXISTS manage_own_sessions ON user_sessions;
CREATE POLICY manage_own_sessions ON user_sessions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS tenant_isolation_audit_logs ON audit_logs;
DROP POLICY IF EXISTS read_audit_logs ON audit_logs;
CREATE POLICY read_audit_logs ON audit_logs
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    organization_id IN (
      SELECT om.organization_id FROM organization_members om
      WHERE om.user_id = auth.uid() AND om.role IN ('OWNER', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS read_feature_entitlements ON feature_entitlements;
CREATE POLICY read_feature_entitlements ON feature_entitlements
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS tenant_isolation_subscriptions ON subscriptions;
CREATE POLICY tenant_isolation_subscriptions ON subscriptions
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));