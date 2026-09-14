'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { SiteBuilderProvider, useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { BuilderLayout } from '@/components/builder/editor/BuilderLayout';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, AlertTriangle, RefreshCw, ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';

function BuilderInitializer() {
  const { sites, selectSite, createNewSiteFromLead, findLeadAndCreateSite, activeSite } = useSiteBuilder();
  const searchParams = useSearchParams();
  const router = useRouter();

  const siteId = searchParams.get('siteId');
  const leadId = searchParams.get('leadId');

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initializeBuilder = () => {
    try {
      setStatus('loading');
      setErrorMessage(null);

      if (leadId) {
        findLeadAndCreateSite(leadId);
      } else if (siteId) {
        const found = sites.find((s) => s.id === siteId);
        if (found) {
          selectSite(siteId);
        } else if (sites.length > 0) {
          selectSite(sites[0].id);
        } else {
          createNewSiteFromLead({ name: 'Empresa Exemplo', category: 'Serviços' });
        }
      } else if (sites.length > 0) {
        selectSite(sites[0].id);
      } else {
        createNewSiteFromLead({ name: 'Empresa Exemplo', category: 'Serviços' });
      }

      setStatus('ready');
    } catch (err: any) {
      console.error('Failed to initialize builder:', err);
      setErrorMessage(err?.message || 'Ocorreu um erro ao carregar os dados do site.');
      setStatus('error');
    }
  };

  useEffect(() => {
    initializeBuilder();
  }, [siteId, leadId]);

  // Render Error State
  if (status === 'error' || (status === 'ready' && !activeSite)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Não foi possível carregar o Editor Visual</h2>
            <p className="text-xs text-slate-400 mt-1">
              {errorMessage || 'Não encontramos as informações do projeto selecionado para renderização.'}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={initializeBuilder}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar Novamente</span>
            </button>

            {leadId && (
              <button
                onClick={() => router.push(`/leads/${leadId}`)}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Lead</span>
              </button>
            )}

            <Link
              href="/sites"
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-2 border border-slate-800 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Ver Meus Sites</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Loading State
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Analisando Perfil do Lead & Construindo Site com IA...
            </h3>
            <p className="text-xs text-slate-500 mt-1">Carregando editor visual e aplicando design system exclusivo</p>
          </div>
        </div>
      </div>
    );
  }

  return <BuilderLayout />;
}

export default function SiteBuilderPage() {
  return (
    <SiteBuilderProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
            Iniciando Editor...
          </div>
        }
      >
        <BuilderInitializer />
      </Suspense>
    </SiteBuilderProvider>
  );
}
