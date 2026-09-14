'use client';

import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const pathname = usePathname();
  
  // Default titles based on pathname if not provided
  let pageTitle = title || 'Dashboard';
  if (!title) {
    if (pathname.includes('/search')) pageTitle = 'Buscar Leads';
    else if (pathname.includes('/results')) pageTitle = 'Resultados da Busca';
    else if (pathname.includes('/crm')) pageTitle = 'CRM de Vendas';
    else if (pathname.includes('/favorites')) pageTitle = 'Leads Favoritos';
    else if (pathname.includes('/history')) pageTitle = 'Histórico de Buscas';
    else if (pathname.includes('/export')) pageTitle = 'Exportar Dados';
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10 w-full">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-text-primary leading-tight">{pageTitle}</h1>
        {subtitle && <span className="text-xs text-text-secondary">{subtitle}</span>}
      </div>

      <div className="flex items-center gap-4">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-text-primary relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border border-background"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-bold text-sm">
          UT
        </div>
      </div>
    </header>
  );
}
