'use client';

import React, { use } from 'react';
import { SiteBuilderProvider, useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { SiteRenderer } from '@/components/builder/renderers/SiteRenderer';
import Link from 'next/link';
import { Edit3, Globe, Sparkles } from 'lucide-react';

function SitePreviewContent({ siteId }: { siteId: string }) {
  const { sites } = useSiteBuilder();
  const site = sites.find((s) => s.id === siteId) || sites[0];

  if (!site) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Site não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Floating Presentation Badge */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-lg shadow-2xl">
        <span className="flex items-center gap-1.5 text-xs text-slate-300 px-2 py-1 bg-slate-950 rounded font-medium">
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>Apresentação Comercial LeadForge</span>
        </span>

        <Link
          href={`/sites/builder?siteId=${site.id}`}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded flex items-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editar no Builder</span>
        </Link>
      </div>

      <SiteRenderer site={site} isEditable={false} />
    </div>
  );
}

export default function SitePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <SiteBuilderProvider>
      <SitePreviewContent siteId={resolvedParams.id} />
    </SiteBuilderProvider>
  );
}
