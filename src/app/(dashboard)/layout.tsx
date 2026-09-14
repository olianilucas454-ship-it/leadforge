'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullscreenRoute = pathname.startsWith('/sites/builder') || pathname.startsWith('/sites/preview');

  if (isFullscreenRoute) {
    return <div className="h-screen w-screen bg-slate-950 overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 relative min-w-0">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative scroll-smooth">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
