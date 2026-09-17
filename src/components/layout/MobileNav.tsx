'use client';

import { Search, Users, Kanban, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Search, label: 'Buscar', href: '/search' },
    { icon: Users, label: 'Resultados', href: '/results' },
    { icon: Kanban, label: 'CRM', href: '/crm' },
    { icon: Crown, label: 'Planos', href: '/pricing' },
    { icon: Star, label: 'Favoritos', href: '/favorites' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-surface border-t border-border flex items-center justify-around z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/pricing' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
              isActive ? 'text-accent font-bold' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
