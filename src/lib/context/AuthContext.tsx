'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlanBySlug } from '@/lib/config/plans';

export type UserPlan = 'free' | 'starter' | 'pro' | 'agency' | 'vip';
export type UserRole = 'admin' | 'user';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  isPaidUser: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  searchesUsed?: number;
}

export interface RegisteredUserRecord extends UserSession {
  passwordHash: string;
  verificationOtp?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPaidUser: boolean;
  creditsRemaining: number;
  monthlyAllowance: number;
  searchesUsed: number;
  searchedNiches: string[];
  currentPlanSlug: UserPlan;
  login: (email: string, pass: string) => { success: boolean; requiresVerification?: boolean; otpCode?: string; message?: string };
  register: (name: string, email: string, pass: string) => { success: boolean; requiresVerification?: boolean; otpCode?: string; message?: string };
  sendEmailVerificationOtp: (email: string) => { success: boolean; otpCode?: string; message?: string };
  verifyEmailOtp: (email: string, code: string) => { success: boolean; message?: string };
  logout: () => void;
  selectPlan: (plan: UserPlan) => void;
  confirmPayment: (plan: UserPlan) => void;
  recordSearch: (niche?: string) => boolean; // Returns false if credit quota exceeded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'olianilucas454@gmail.com';
const ADMIN_PASS = 'lucas007';
const FREE_TRIAL_LIMIT = 3;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [searchedNiches, setSearchedNiches] = useState<string[]>([]);
  const [searchesUsed, setSearchesUsed] = useState<number>(0);

  // Helper to load user DB
  const getUsersDb = (): Record<string, RegisteredUserRecord> => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem('leadforge_registered_users_db');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveUsersDb = (db: Record<string, RegisteredUserRecord>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadforge_registered_users_db', JSON.stringify(db));
    }
  };

  useEffect(() => {
    // Load auth session from localStorage
    const savedSession = localStorage.getItem('leadforge_auth_session');
    if (savedSession) {
      try {
        const parsed: UserSession = JSON.parse(savedSession);
        
        // Sync with DB
        const db = getUsersDb();
        const dbRecord = db[parsed.email.toLowerCase()];
        if (dbRecord) {
          parsed.plan = dbRecord.plan;
          parsed.isPaidUser = dbRecord.isPaidUser;
          parsed.isEmailVerified = dbRecord.isEmailVerified;
        }

        setUser(parsed);
        setSearchesUsed(parsed.searchesUsed || 0);
      } catch (e) {
        console.error('Failed to parse saved auth session', e);
      }
    }

    const savedNiches = localStorage.getItem('leadforge_searched_niches');
    if (savedNiches) {
      try {
        setSearchedNiches(JSON.parse(savedNiches));
      } catch (e) {
        console.error('Failed to parse searched niches', e);
      }
    }

    // Load device searches count
    const deviceSearches = localStorage.getItem('leadforge_device_searches_count');
    if (deviceSearches) {
      const count = Number(deviceSearches) || 0;
      setSearchesUsed(count);
    }
  }, []);

  const saveUserSession = (session: UserSession | null) => {
    setUser(session);
    if (session) {
      localStorage.setItem('leadforge_auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('leadforge_auth_session');
    }
  };

  const sendEmailVerificationOtp = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { success: false, message: 'Informe um e-mail válido.' };

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const db = getUsersDb();
    
    if (db[cleanEmail]) {
      db[cleanEmail].verificationOtp = otpCode;
      saveUsersDb(db);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`leadforge_otp_${cleanEmail}`, JSON.stringify({ code: otpCode, expiresAt: Date.now() + 15 * 60 * 1000 }));
      }
    }

    console.log(`[Email Verification Service] OTP Code for ${cleanEmail}: ${otpCode}`);

    return {
      success: true,
      otpCode,
      message: `Código de verificação enviado para ${cleanEmail}.`
    };
  };

  const verifyEmailOtp = (email: string, code: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const db = getUsersDb();
    const dbRecord = db[cleanEmail];

    let storedCode: string | undefined = dbRecord?.verificationOtp;

    if (!storedCode && typeof window !== 'undefined') {
      const rawOtp = localStorage.getItem(`leadforge_otp_${cleanEmail}`);
      if (rawOtp) {
        try {
          const parsed = JSON.parse(rawOtp);
          storedCode = parsed.code;
        } catch {
          // ignore
        }
      }
    }

    if (!storedCode || storedCode !== cleanCode) {
      return { success: false, message: 'Código de verificação incorreto ou expirado. Tente novamente.' };
    }

    if (dbRecord) {
      dbRecord.isEmailVerified = true;
      dbRecord.verificationOtp = undefined;
      saveUsersDb(dbRecord ? { ...db, [cleanEmail]: dbRecord } : db);

      const verifiedSession: UserSession = {
        email: dbRecord.email,
        name: dbRecord.name,
        role: dbRecord.role,
        plan: dbRecord.plan,
        isPaidUser: dbRecord.isPaidUser,
        isEmailVerified: true,
        createdAt: dbRecord.createdAt,
        searchesUsed: dbRecord.searchesUsed || 0,
      };

      saveUserSession(verifiedSession);
    } else if (user) {
      const updated = { ...user, isEmailVerified: true };
      saveUserSession(updated);
    }

    return { success: true, message: 'E-mail verificado com sucesso!' };
  };

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      return { success: false, message: 'Por favor, informe seu e-mail e sua senha.' };
    }

    // Check Admin Master Credentials
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASS) {
      const adminSession: UserSession = {
        email: ADMIN_EMAIL,
        name: 'Administrador Master',
        role: 'admin',
        plan: 'agency',
        isPaidUser: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        searchesUsed: 0,
      };

      const db = getUsersDb();
      db[cleanEmail] = { ...adminSession, passwordHash: ADMIN_PASS, isEmailVerified: true };
      saveUsersDb(db);

      saveUserSession(adminSession);
      return { success: true };
    }

    // Check registered user accounts DB
    const db = getUsersDb();
    const existing = db[cleanEmail];

    if (!existing) {
      return { 
        success: false, 
        message: 'Conta não encontrada com este e-mail. Por favor, clique em "Criar Conta Grátis" para se cadastrar.' 
      };
    }

    if (existing.passwordHash !== pass) {
      return { success: false, message: 'Senha incorreta. Verifique sua senha e tente novamente.' };
    }

    if (!existing.isEmailVerified && existing.role !== 'admin') {
      const sendRes = sendEmailVerificationOtp(cleanEmail);
      return { 
        success: false, 
        requiresVerification: true,
        otpCode: sendRes.otpCode,
        message: 'Por favor, confirme a verificação de e-mail enviada para concluir o acesso.' 
      };
    }

    const userSession: UserSession = {
      email: existing.email,
      name: existing.name,
      role: existing.role,
      plan: existing.plan,
      isPaidUser: existing.isPaidUser,
      isEmailVerified: true,
      createdAt: existing.createdAt,
      searchesUsed: existing.searchesUsed || 0,
    };

    saveUserSession(userSession);
    return { success: true };
  };

  const register = (name: string, email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || pass.length < 4) {
      return { success: false, message: 'Informe um e-mail válido e uma senha com pelo menos 4 caracteres.' };
    }

    const db = getUsersDb();
    if (db[cleanEmail]) {
      return { success: false, message: 'Este e-mail já está cadastrado. Faça login para acessar sua conta.' };
    }

    const isAdminEmail = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const otpRes = sendEmailVerificationOtp(cleanEmail);

    const newRecord: RegisteredUserRecord = {
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      passwordHash: pass,
      role: isAdminEmail ? 'admin' : 'user',
      plan: isAdminEmail ? 'agency' : 'free',
      isPaidUser: isAdminEmail,
      isEmailVerified: isAdminEmail,
      verificationOtp: otpRes.otpCode,
      createdAt: new Date().toISOString(),
      searchesUsed: 0,
    };

    db[cleanEmail] = newRecord;
    saveUsersDb(db);

    if (isAdminEmail) {
      const adminSession: UserSession = {
        email: newRecord.email,
        name: newRecord.name,
        role: newRecord.role,
        plan: newRecord.plan,
        isPaidUser: true,
        isEmailVerified: true,
        createdAt: newRecord.createdAt,
        searchesUsed: 0,
      };
      saveUserSession(adminSession);
      return { success: true };
    }

    return { 
      success: true, 
      requiresVerification: true, 
      otpCode: otpRes.otpCode,
      message: `Código de verificação de 6 dígitos enviado para ${cleanEmail}.`
    };
  };

  const logout = () => {
    saveUserSession(null);
  };

  const selectPlan = (plan: UserPlan) => {
    if (!user) return;
    if (plan === 'free') {
      const updated = { ...user, plan: 'free' as UserPlan, isPaidUser: false };
      saveUserSession(updated);

      const db = getUsersDb();
      if (db[user.email.toLowerCase()]) {
        db[user.email.toLowerCase()].plan = 'free';
        db[user.email.toLowerCase()].isPaidUser = false;
        saveUsersDb(db);
      }
    }
  };

  const confirmPayment = (plan: UserPlan) => {
    if (!user) return;
    const updated: UserSession = {
      ...user,
      plan,
      isPaidUser: true,
    };
    saveUserSession(updated);

    const db = getUsersDb();
    if (db[user.email.toLowerCase()]) {
      db[user.email.toLowerCase()].plan = plan;
      db[user.email.toLowerCase()].isPaidUser = true;
      saveUsersDb(db);
    }
  };

  const recordSearch = (niche?: string): boolean => {
    if (!user) return false;

    const isAdmin = user.role === 'admin' || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // Admin has UNLIMITED access
    if (isAdmin) {
      return true;
    }

    const isPaid = user.isPaidUser && user.plan !== 'free';
    const planDef = getPlanBySlug(user.plan);
    const allowance = isPaid ? planDef.researchCredits : FREE_TRIAL_LIMIT; // Free trial = 3 searches MAX

    // Check device-level global searches to prevent creating new free emails to bypass quota
    const deviceSearches = Number(localStorage.getItem('leadforge_device_searches_count') || '0');
    const effectiveSearchesUsed = Math.max(searchesUsed, isPaid ? searchesUsed : deviceSearches);

    if (effectiveSearchesUsed >= allowance) {
      return false; // Quota / Trial limit reached! Must upgrade!
    }

    const newUsed = effectiveSearchesUsed + 1;
    setSearchesUsed(newUsed);

    localStorage.setItem('leadforge_device_searches_count', String(newUsed));
    localStorage.setItem('leadforge_searches_used_count', String(newUsed));

    // Update in user DB
    const db = getUsersDb();
    if (db[user.email.toLowerCase()]) {
      db[user.email.toLowerCase()].searchesUsed = newUsed;
      saveUsersDb(db);
    }

    if (niche) {
      const cleanNiche = niche.trim().toLowerCase();
      const updatedNiches = Array.from(new Set([...searchedNiches, cleanNiche]));
      setSearchedNiches(updatedNiches);
      localStorage.setItem('leadforge_searched_niches', JSON.stringify(updatedNiches));
    }

    return true;
  };

  const isAdmin = user?.role === 'admin' || user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const currentPlanSlug = (user?.plan as UserPlan) || 'free';
  const planDef = getPlanBySlug(currentPlanSlug);
  const isPaidUser = user?.isPaidUser === true || isAdmin;

  const monthlyAllowance = isPaidUser ? planDef.researchCredits : FREE_TRIAL_LIMIT;
  
  // Calculate remaining searches accurately
  const deviceSearches = typeof window !== 'undefined' ? Number(localStorage.getItem('leadforge_device_searches_count') || '0') : 0;
  const effectiveUsed = isPaidUser ? searchesUsed : Math.max(searchesUsed, deviceSearches);
  const creditsRemaining = isAdmin ? 999999 : Math.max(0, monthlyAllowance - effectiveUsed);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isPaidUser,
        creditsRemaining,
        monthlyAllowance,
        searchesUsed: effectiveUsed,
        searchedNiches,
        currentPlanSlug,
        login,
        register,
        sendEmailVerificationOtp,
        verifyEmailOtp,
        logout,
        selectPlan,
        confirmPayment,
        recordSearch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
