-- LEADFORGE COMMERCIAL & COMMUNITY EXTENSION MIGRATION
-- Migration: 20260902_leadforge_commercial.sql

-- 1. ENUMS FOR COMMERCIAL & ACCESS CONTROL
DO $$ BEGIN
    CREATE TYPE access_type AS ENUM ('COMMUNITY', 'CUSTOMER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REVOKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE commercial_subscription_status AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED', 'PAYMENT_PENDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invitation_status AS ENUM ('AVAILABLE', 'USED', 'EXPIRED', 'REVOKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. INVITATION CODES (Individual, Single-Use, Auditable)
CREATE TABLE IF NOT EXISTS invitation_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    community_name VARCHAR(100) NOT NULL DEFAULT 'Comunidade Oficial LEADFORGE',
    status invitation_status NOT NULL DEFAULT 'AVAILABLE',
    max_uses INTEGER NOT NULL DEFAULT 1,
    used_count INTEGER NOT NULL DEFAULT 0,
    used_by_user_id UUID REFERENCES profiles(id),
    used_by_email VARCHAR(255),
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON invitation_codes(code);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_status ON invitation_codes(status);

-- 3. MEMBERSHIPS (Community Members Access Control)
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    membership_type VARCHAR(50) NOT NULL DEFAULT 'COMMUNITY',
    status membership_status NOT NULL DEFAULT 'ACTIVE',
    community_member BOOLEAN NOT NULL DEFAULT TRUE,
    invitation_code_id UUID REFERENCES invitation_codes(id),
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org_id ON memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);

-- 4. USER SESSIONS & CONCURRENT LIMITS (Anti-Account Sharing)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    device_info VARCHAR(100),
    is_current BOOLEAN DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

-- 5. AUDIT LOGS (Security, Admin & Telemetry)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 6. FEATURE ENTITLEMENTS PER PLAN
CREATE TABLE IF NOT EXISTS feature_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    feature_key VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    usage_limit INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (plan_id, feature_key)
);

-- 7. RLS POLICIES FOR NEW COMMERCIAL TABLES
ALTER TABLE invitation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_memberships ON memberships
  FOR ALL
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY tenant_isolation_user_sessions ON user_sessions
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
  FOR SELECT
  USING (organization_id IN (SELECT get_user_org_ids()));