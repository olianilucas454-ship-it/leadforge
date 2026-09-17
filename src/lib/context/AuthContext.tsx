'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PLAN_CONFIG, getPlanBySlug } from '@/lib/config/plans';

export type UserPlan = 'free' | 'starter' | 'pro' | 'agency' | 'vip';
export type UserRole = 'admin' | 'user';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  isPaidUser: boolean;
  createdAt: string;
  searchesUsed?: number;
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
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (name: string, email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  selectPlan: (plan: UserPlan) => void;
  confirmPayment: (plan: UserPlan) => void;
  recordSearch: (niche?: string) => boolean; // Returns false if credit quota exceeded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'olianilucas454@gmail.com';
const ADMIN_PASS = 'lucas007';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [searchedNiches, setSearchedNiches] = useState<string[]>([]);
  const [searchesUsed, setSearchesUsed] = useState<number>(0);

  useEffect(() => {
    // Load auth session from localStorage
    const savedSession = localStorage.getItem('leadforge_auth_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        if (typeof parsed.searchesUsed === 'number') {
          setSearchesUsed(parsed.searchesUsed);
        }
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

    const savedCount = localStorage.getItem('leadforge_searches_used_count');
    if (savedCount) {
      setSearchesUsed(Number(savedCount) || 0);
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

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check Admin Master Credentials
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASS) {
      const adminSession: UserSession = {
        email: ADMIN_EMAIL,
        name: 'Administrador Master',
        role: 'admin',
        plan: 'agency',
        isPaidUser: true,
        createdAt: new Date().toISOString(),
        searchesUsed: 0,
      };
      saveUserSession(adminSession);
      return { success: true };
    }

    // Generic / Demo User Login
    if (cleanEmail && pass.length >= 4) {
      const existingPlan = (user?.email === cleanEmail && user?.plan) || 'free';
      const existingPaid = (user?.email === cleanEmail && user?.isPaidUser) || false;

      const userSession: UserSession = {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'user',
        plan: existingPlan as UserPlan,
        isPaidUser: existingPaid,
        createdAt: new Date().toISOString(),
        searchesUsed: searchesUsed || 0,
      };
      saveUserSession(userSession);
      return { success: true };
    }

    return { success: false, message: 'E-mail ou senha incorretos. Tente novamente.' };
  };

  const register = (name: string, email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || pass.length < 4) {
      return { success: false, message: 'Preencha um e-mail válido e senha de no mínimo 4 caracteres.' };
    }

    const newSession: UserSession = {
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      role: cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
      plan: cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'agency' : 'free',
      isPaidUser: cleanEmail === ADMIN_EMAIL.toLowerCase(),
      createdAt: new Date().toISOString(),
      searchesUsed: 0,
    };

    saveUserSession(newSession);
    return { success: true };
  };

  const logout = () => {
    saveUserSession(null);
  };

  const selectPlan = (plan: UserPlan) => {
    if (!user) return;
    const isPaid = plan === 'starter' || plan === 'pro' || plan === 'agency' || plan === 'vip' || user.role === 'admin';
    const updated = { ...user, plan, isPaidUser: isPaid };
    saveUserSession(updated);
  };

  const confirmPayment = (plan: UserPlan) => {
    if (!user) return;
    const updated: UserSession = {
      ...user,
      plan,
      isPaidUser: true,
    };
    saveUserSession(updated);
  };

  const recordSearch = (niche?: string): boolean => {
    if (!user) return false;

    const isAdmin = user.role === 'admin' || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // Admin has UNLIMITED access
    if (isAdmin) {
      return true;
    }

    // Determine current plan definition & monthly allowance
    const planDef = getPlanBySlug(user.plan);
    const allowance = planDef.researchCredits;

    // Check if limit reached
    if (searchesUsed >= allowance) {
      return false; // Quota exceeded!
    }

    const newUsed = searchesUsed + 1;
    setSearchesUsed(newUsed);
    localStorage.setItem('leadforge_searches_used_count', String(newUsed));

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
  const monthlyAllowance = planDef.researchCredits;
  
  const isPaidUser = user?.isPaidUser || isAdmin || currentPlanSlug === 'starter' || currentPlanSlug === 'pro' || currentPlanSlug === 'agency' || currentPlanSlug === 'vip';
  const creditsRemaining = isAdmin ? 999999 : Math.max(0, monthlyAllowance - searchesUsed);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isPaidUser,
        creditsRemaining,
        monthlyAllowance,
        searchesUsed,
        searchedNiches,
        currentPlanSlug,
        login,
        register,
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
