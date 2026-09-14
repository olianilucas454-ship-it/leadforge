'use client';

import React, { useEffect, Suspense } from 'react';
import { SiteBuilderProvider, useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { BuilderLayout } from '@/components/builder/editor/BuilderLayout';
import { useSearchParams } from 'next/navigation';

function BuilderInitializer() {
  const { sites, selectSite, createNewSiteFromLead } = useSiteBuilder();
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId');
  const leadId = searchParams.get('leadId');

  useEffect(() => {
    if (siteId) {
      selectSite(siteId);
    } else if (leadId) {
      // Mock lead if leadId passed
      const mockLead = {
        name: 'Cliente Premium LeadForge',
        category: 'Atelier & Serviços de Alto Padrão',
        city: 'São Paulo',
        state: 'SP',
        phone: '(11) 99876-5432',
      };
      createNewSiteFromLead(mockLead, 'cinematic');
    }
  }, [siteId, leadId]);

  return <BuilderLayout />;
}

export default function SiteBuilderPage() {
  return (
    <SiteBuilderProvider>
      <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">Carregando Editor Visual...</div>}>
        <BuilderInitializer />
      </Suspense>
    </SiteBuilderProvider>
  );
}
