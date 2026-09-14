import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
