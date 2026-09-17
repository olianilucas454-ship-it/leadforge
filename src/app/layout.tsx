import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadForge — Prospecção Inteligente & CRM de Leads',
  description: 'Plataforma SaaS comercial para encontrar empresas e fechar vendas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-background text-text-primary antialiased relative min-h-screen selection:bg-accent selection:text-black`}>
        {/* Global Visible Background Layer with leadforge-bg.jpg across all SaaS pages */}
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-75 scale-100"
          style={{ backgroundImage: "url('/leadforge-bg.jpg')" }}
        />
        {/* Soft Ambient Overlay for high contrast text readability while keeping image vivid */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background/50 via-background/25 to-background/65" />
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />

        <ClientProviders>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
