'use client';

import React, { useState, useEffect } from 'react';
import { Search, Clock, RotateCcw, Trash2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export interface HistoryItem {
  id: string;
  name?: string;
  query?: string;
  date: string;
  totalFound?: number;
  withoutWebsite?: number;
  hotCount?: number;
  warmCount?: number;
  result?: {
    total: number;
    noWebsite: number;
    hot: number;
    warm: number;
  };
  params?: {
    niche?: string;
    city?: string;
    state?: string;
    neighborhood?: string;
    radius?: number;
    quantity?: number;
    query?: string;
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('leadforge_search_history');
    if (raw) {
      try {
        setHistoryItems(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm('Tem certeza de que deseja apagar todo o histórico de pesquisas?')) {
      localStorage.removeItem('leadforge_search_history');
      setHistoryItems([]);
    }
  };

  const handleSearchAgain = (item: HistoryItem) => {
    const params = item.params;
    if (params && params.niche) {
      router.push(`/search`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col">
      <Header title="Histórico de Buscas" />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-accent/10 border border-accent/30 text-accent">
              <Clock size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Pesquisas Recentes</h1>
              <p className="text-text-secondary text-sm">Histórico de varreduras de mercado e parâmetros de busca salvos</p>
            </div>
          </div>

          {historyItems.length > 0 && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleClearHistory}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Histórico
            </Button>
          )}
        </div>

        {historyItems.length > 0 ? (
          <div className="space-y-4">
            {historyItems.map((item) => {
              const title = item.name || item.query || (item.params?.niche ? `${item.params.niche} em ${item.params.city || ''} - ${item.params.state || ''}` : 'Pesquisa de Leads');
              const total = item.result?.total ?? item.totalFound ?? 0;
              const noWebsite = item.result?.noWebsite ?? item.withoutWebsite ?? 0;
              const hot = item.result?.hot ?? item.hotCount ?? 0;
              const warm = item.result?.warm ?? item.warmCount ?? 0;

              let formattedDate = 'Data recente';
              try {
                if (item.date) formattedDate = new Date(item.date).toLocaleString('pt-BR');
              } catch {
                formattedDate = item.date;
              }

              return (
                <div 
                  key={item.id} 
                  className="bg-surface/80 backdrop-blur-md border border-border/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-accent/40 shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 p-3 rounded-xl text-accent border border-accent/20 mt-0.5 shrink-0">
                      <Search size={22} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">{title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                        <span className="font-mono text-text-muted">{formattedDate}</span>
                        <span>•</span>
                        <span className="text-white font-bold">{total} encontrados</span>
                        <span>•</span>
                        <span className="text-rose-400 font-semibold">{noWebsite} sem site</span>
                        <span>•</span>
                        <span className="text-amber-400 font-extrabold">{hot} HOT</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-extrabold">{warm} WARM</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSearchAgain(item)}
                    variant="secondary"
                    size="sm"
                    className="self-start md:self-auto hover:border-accent hover:text-accent shrink-0"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    <span>Refazer Busca</span>
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface/60 border border-border rounded-3xl p-16 text-center flex flex-col items-center justify-center space-y-4">
            <div className="text-text-muted bg-accent/10 p-6 rounded-full border border-accent/20">
              <Search size={40} className="text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white">Nenhuma pesquisa registrada ainda</h3>
            <p className="text-text-secondary max-w-md text-sm">
              Suas pesquisas recentes e parâmetros de busca aparecerão aqui automaticamente após a primeira varredura.
            </p>
            <Button onClick={() => router.push('/search')} className="mt-2">
              <span>Realizar Primeira Busca</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
