'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserPlan = 'free' | 'pro' | 'vip';
export type UserRole = 'admin' | 'user';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  isPaidUser: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPaidUser: boolean;
  freeSearchesRemaining: number;
  searchedNiches: string[];
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (name: string, email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  selectPlan: (plan: UserPlan) => void;
  confirmPayment: (plan: UserPlan) => void;
  recordSearch: (niche: string) => boolean; // Returns false if quota exceeded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'olianilucas454@gmail.com';
const ADMIN_PASS = 'lucas007';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [searchedNiches, setSearchedNiches] = useState<string[]>([]);

  useEffect(() => {
    // Load auth session from localStorage
    const savedSession = localStorage.getItem('leadforge_auth_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
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
        plan: 'vip',
        isPaidUser: true,
        createdAt: new Date().toISOString(),
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
        plan: existingPlan,
        isPaidUser: existingPaid,
        createdAt: new Date().toISOString(),
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
      plan: cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'vip' : 'free',
      isPaidUser: cleanEmail === ADMIN_EMAIL.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    saveUserSession(newSession);
    return { success: true };
  };

  const logout = () => {
    saveUserSession(null);
  };

  const selectPlan = (plan: UserPlan) => {
    if (!user) return;
    const isPaid = plan === 'pro' || plan === 'vip' || user.role === 'admin';
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

  const recordSearch = (niche: string): boolean => {
    if (!user) return false;

    // Admin or Paid Users have UNLIMITED access
    if (user.role === 'admin' || user.isPaidUser || user.plan === 'pro' || user.plan === 'vip') {
      return true;
    }

    // Free plan check: 5 searches in 5 different niches
    const cleanNiche = niche.trim().toLowerCase();
    const updatedNiches = Array.from(new Set([...searchedNiches, cleanNiche]));

    if (updatedNiches.length > 5) {
      // Quota exceeded!
      return false;
    }

    setSearchedNiches(updatedNiches);
    localStorage.setItem('leadforge_searched_niches', JSON.stringify(updatedNiches));
    return true;
  };

  const isAdmin = user?.role === 'admin' || user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isPaidUser = user?.isPaidUser || isAdmin || user?.plan === 'pro' || user?.plan === 'vip';
  const freeSearchesRemaining = Math.max(0, 5 - searchedNiches.length);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isPaidUser,
        freeSearchesRemaining,
        searchedNiches,
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
