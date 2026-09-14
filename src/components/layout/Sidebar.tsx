'use client';

import {
  LayoutDashboard,
  Search,
  Users,
  Kanban,
  Globe,
  Star,
  History,
  Download,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Search, label: 'Buscar Leads', href: '/search' },
    { icon: Users, label: 'Resultados', href: '/results' },
    { icon: Kanban, label: 'CRM', href: '/crm' },
    { icon: Globe, label: 'Meus Sites (Builder)', href: '/sites' },
    { icon: Star, label: 'Favoritos', href: '/favorites' },
    { icon: History, label: 'Histórico', href: '/history' },
    { icon: Download, label: 'Exportar', href: '/export' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-border fixed left-0 top-0">
      <div className="p-6 border-b border-border/50">
        <Logo />
      </div>
      
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
                      ? 'bg-accent/10 text-accent border-l-2 border-accent'
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

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 text-accent">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Usuário Teste</p>
            <p className="text-xs text-text-muted truncate">usuario@leadforge.com</p>
          </div>
          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent text-background uppercase tracking-wider">
            Pro
          </div>
        </div>
      </div>
    </aside>
  );
}