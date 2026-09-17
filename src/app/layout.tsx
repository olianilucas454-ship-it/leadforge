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
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
