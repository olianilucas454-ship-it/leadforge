'use client';

import {
  LayoutDashboard,
  Search,
  Users,
  Kanban,
  Crown,
  Star,
  History,
  Download,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { useAuth } from '@/lib/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout, freeSearchesRemaining } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Search, label: 'Buscar Leads', href: '/search' },
    { icon: Users, label: 'Resultados', href: '/results' },
    { icon: Kanban, label: 'CRM de Vendas', href: '/crm' },
    { icon: Crown, label: 'Planos & Assinatura', href: '/pricing' },
    { icon: Star, label: 'Favoritos', href: '/favorites' },
    { icon: History, label: 'Histórico', href: '/history' },
    { icon: Download, label: 'Exportar', href: '/export' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-border fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <Logo />
      </div>

      {/* Quota Counter for Free Users */}
      {user && !user.isPaidUser && !isAdmin && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-accent/10 border border-accent/20 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-accent">
            <span>Quota Grátis:</span>
            <span className="font-mono">{freeSearchesRemaining}/5 buscas</span>
          </div>
          <p className="text-[10px] text-text-muted">5 nichos em qualquer cidade</p>
          <Link
            href="/pricing"
            className="block text-[10px] font-extrabold text-black bg-accent hover:bg-accent-hover text-center py-1 rounded mt-1.5 transition-all uppercase tracking-wider"
          >
            Fazer Upgrade →
          </Link>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent border-l-2 border-accent font-bold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border-l-2 border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Footer Profile & Admin Badge */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-background border border-border">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 text-accent shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-primary truncate">
              {user?.name || user?.email || 'Usuário'}
            </p>
            <p className="text-[10px] text-text-muted truncate font-mono">
              {user?.email || 'visitante@leadforge.com'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
            title="Sair da Conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {isAdmin ? (
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>👑 ADMIN MASTER (ILIMITADO)</span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 text-[10px] font-mono text-text-muted">
            <span>Plano: {user?.plan === 'pro' ? 'R$ 59,90' : user?.plan === 'vip' ? 'R$ 99,99' : 'Grátis'}</span>
            <Link href="/pricing" className="text-accent hover:underline font-bold">
              Alterar
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}