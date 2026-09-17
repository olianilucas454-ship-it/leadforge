'use client';

import { Bell, Crown, Search, UserCheck, Zap } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isPaidUser, creditsRemaining, monthlyAllowance } = useAuth();
  
  let pageTitle = title || 'Dashboard';
  if (!title) {
    if (pathname.includes('/search')) pageTitle = 'Buscar Leads';
    else if (pathname.includes('/results')) pageTitle = 'Resultados da Busca';
    else if (pathname.includes('/crm')) pageTitle = 'CRM de Vendas';
    else if (pathname.includes('/planos') || pathname.includes('/pricing')) pageTitle = 'Planos de Assinatura';
    else if (pathname.includes('/minha-assinatura')) pageTitle = 'Minha Assinatura';
    else if (pathname.includes('/favorites')) pageTitle = 'Leads Favoritos';
    else if (pathname.includes('/history')) pageTitle = 'Histórico de Buscas';
    else if (pathname.includes('/export')) pageTitle = 'Exportar Dados';
    else if (pathname.includes('/admin')) pageTitle = 'Painel Administrativo';
  }

  const initial = isAdmin ? 'ADM' : (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface/60 backdrop-blur-md border-b border-border/80 sticky top-0 z-10 w-full">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-text-primary leading-tight flex items-center gap-2">
          <span>{pageTitle}</span>
          {isAdmin && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase font-mono">
              Admin Master
            </span>
          )}
        </h1>
        {subtitle && <span className="text-xs text-text-secondary">{subtitle}</span>}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* HEADER RESEARCH CREDIT COUNTER (RULE 17) */}
        <Link
          href="/planos"
          className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent rounded-xl text-xs font-bold transition-all shadow-sm"
          title="Clique para ver os planos e comprar mais pesquisas"
        >
          <Search className="w-3.5 h-3.5" />
          <span>
            {isAdmin ? '🔎 Pesquisas Ilimitadas' : `🔎 ${creditsRemaining} pesquisas`}
          </span>
        </Link>

        {!isPaidUser && !isAdmin && (
          <Link
            href="/planos"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-accent/20 border border-accent/40 text-accent rounded-xl text-xs font-extrabold hover:scale-105 transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Planos</span>
          </Link>
        )}

        <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center font-extrabold text-xs shadow-md">
          {initial}
        </div>
      </div>
    </header>
  );
}
