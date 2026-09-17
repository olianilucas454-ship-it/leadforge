'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Loader2, Circle, ArrowRight, AlertCircle } from 'lucide-react';
import { LeadDiscoveryEngine } from '@/lib/engines/LeadDiscoveryEngine';
import { HybridBusinessDataProvider } from '@/lib/providers';
import { SearchResult } from '@/lib/types/search';

interface SearchProgressProps {
  isOpen: boolean;
  searchParams: {
    niche: string;
    city: string;
    state: string;
    neighborhood?: string;
    radius: number;
    quantity: number;
  };
  onComplete: (results: SearchResult) => void;
  onViewResults: () => void;
}

const STEPS = [
  'Buscando empresas em tempo real...',
  'Removendo registros duplicados...',
  'Validando relevância do nicho...',
  'Analisando presença digital e websites...',
  'Calculando Website Opportunity Score...',
  'Priorizando leads por potencial comercial...'
];

export function SearchProgress({ isOpen, searchParams, onComplete, onViewResults }: SearchProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [summary, setSummary] = useState({ total: 0, noWebsite: 0, hot: 0, warm: 0 });
  const searchStarted = useRef(false);

  useEffect(() => {
    if (!isOpen || searchStarted.current) return;
    searchStarted.current = true;

    let isMounted = true;

    // Advance steps smoothly and swiftly
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 280);

    const executeRealSearch = async () => {
      try {
        let result: SearchResult | null = null;

        // 1. First attempt: call Next.js API route /api/search (server-side, avoids CORS)
        try {
          const apiRes = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              niche: searchParams.niche,
              city: searchParams.city,
              state: searchParams.state,
              neighborhood: searchParams.neighborhood,
              radiusKm: searchParams.radius,
              limit: searchParams.quantity,
            }),
          });

          if (apiRes.ok) {
            result = await apiRes.json();
          }
        } catch (apiErr) {
          console.warn('[SearchProgress] /api/search failed, using client-side discovery engine:', apiErr);
        }

        // 2. Fallback: Client-side LeadDiscoveryEngine
        if (!result || !result.leads || result.leads.length === 0) {
          const provider = new HybridBusinessDataProvider();
          const engine = new LeadDiscoveryEngine(provider);
          result = await engine.discover({
            niche: searchParams.niche,
            city: searchParams.city,
            state: searchParams.state,
            neighborhood: searchParams.neighborhood,
            radiusKm: searchParams.radius,
            limit: searchParams.quantity,
          });
        }

        if (!isMounted) return;

        if (result && result.leads) {
          // Save leads in localStorage for results, CRM, favorites and detail pages
          localStorage.setItem('leadforge_search_results', JSON.stringify(result.leads));
          localStorage.setItem('leadforge_last_results', JSON.stringify(result.leads));

          // Save search history
          try {
            const rawHistory = localStorage.getItem('leadforge_search_history');
            const history = rawHistory ? JSON.parse(rawHistory) : [];
            const queryName = `${searchParams.niche} em ${searchParams.city} - ${searchParams.state}`;
            const historyItem = {
              id: `search-${Date.now()}`,
              name: queryName,
              query: queryName,
              date: new Date().toISOString(),
              totalFound: result.totalFound,
              withoutWebsite: result.withoutWebsite,
              hotCount: result.hotCount,
              warmCount: result.warmCount,
              result: {
                total: result.totalFound,
                noWebsite: result.withoutWebsite,
                hot: result.hotCount,
                warm: result.warmCount,
              },
              params: searchParams,
            };
            history.unshift(historyItem);
            localStorage.setItem('leadforge_search_history', JSON.stringify(history.slice(0, 30)));
          } catch (histErr) {
            console.warn('Failed to save search history', histErr);
          }

          setSummary({
            total: result.leads.length,
            noWebsite: result.withoutWebsite,
            hot: result.hotCount,
            warm: result.warmCount,
          });

          setCurrentStepIndex(STEPS.length);
          setIsFinished(true);
          onComplete(result);
        } else {
          throw new Error('Nenhum resultado retornado pelo motor de busca.');
        }
      } catch (err: any) {
        console.error('[SearchProgress] Error during search:', err);
        if (isMounted) {
          setErrorMsg(err?.message || 'Erro ao consultar a base de dados de empresas.');
        }
      } finally {
        clearInterval(stepInterval);
      }
    };

    executeRealSearch();

    return () => {
      isMounted = false;
      searchStarted.current = false;
      clearInterval(stepInterval);
    };
  }, [isOpen, searchParams, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.min(((currentStepIndex + 0.5) / STEPS.length) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg p-8 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          OpenStreetMap &amp; Auditoria Web em Tempo Real
        </div>

        <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
          Buscando <span className="text-accent">&quot;{searchParams.niche}&quot;</span> em {searchParams.city} - {searchParams.state}...
        </h3>

        {errorMsg ? (
          <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Erro na busca</p>
              <p className="text-xs mt-1">{errorMsg}</p>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 mb-10">
            {STEPS.map((step, index) => {
              const isCompleted = isFinished || index < currentStepIndex;
              const isActive = !isFinished && index === currentStepIndex;

              return (
                <div 
                  key={step} 
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    isCompleted ? 'text-text-primary' :
                    isActive ? 'text-accent' : 'text-text-muted'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-accent animate-in zoom-in" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    ) : (
                      <Circle className="w-5 h-5 opacity-40 text-text-muted" />
                    )}
                  </div>
                  <span className={`text-sm md:text-base font-medium ${isActive ? 'animate-pulse text-accent' : ''}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="w-full h-2 bg-surface rounded-full overflow-hidden mb-8 border border-border">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${isFinished ? 100 : progressPercent}%` }}
          />
        </div>

        {isFinished && (
          <div className="w-full flex flex-col items-center animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="bg-surface border border-border rounded-xl p-5 w-full mb-6 text-center shadow-lg">
              <p className="text-xs uppercase font-semibold text-text-secondary tracking-wider mb-2">Resultado da Prospecção</p>
              <p className="font-bold text-lg text-text-primary">
                {summary.total} empresas <span className="text-text-muted font-normal">|</span> <span className="text-hot font-bold">{summary.noWebsite} sem website</span> <span className="text-text-muted font-normal">|</span> <span className="text-accent font-bold">{summary.hot} 🔥 HOT</span>
              </p>
            </div>
            
            <button
              onClick={onViewResults}
              className="h-14 w-full bg-accent hover:bg-accent-hover text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/20"
            >
              VER LEADS ENCONTRADOS
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
