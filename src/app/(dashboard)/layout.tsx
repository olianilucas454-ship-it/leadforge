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
    <div className="flex h-screen bg-transparent overflow-hidden text-text-primary relative">
      {/* Active leadforge-bg.jpg background layer for all Dashboard pages */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/leadforge-bg.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />

      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 relative min-w-0 z-10">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative scroll-smooth">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
