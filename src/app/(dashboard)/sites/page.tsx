'use client';

import React, { useState } from 'react';
import { SiteBuilderProvider, useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import {
  Globe,
  Plus,
  Sparkles,
  Edit3,
  Eye,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SitesDashboardContent() {
  const { sites, selectSite, deleteSite, createNewSiteFromLead } = useSiteBuilder();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');

  const filteredSites = sites.filter((site) => {
    if (activeTab === 'published') return site.status === 'published';
    if (activeTab === 'draft') return site.status === 'draft';
    return true;
  });

  const handleEditSite = (siteId: string) => {
    selectSite(siteId);
    router.push(`/sites/builder?siteId=${siteId}`);
  };

  const handleCreateDemo = () => {
    const mockLead = {
      name: 'Corvo & Co. Barbearia Premium',
      category: 'Barbearia de Luxo & Atelier',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 99876-5432',
      whatsapp: '5511998765432',
      address: 'Rua Oscar Freire, 1200 - Jardins, SP',
      rating: 4.9,
      reviewCount: 342,
    };
    const newSite = createNewSiteFromLead(mockLead, 'cinematic');
    router.push(`/sites/builder?siteId=${newSite.id}`);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Website Experience Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
              PRO R$5k-R$10k+
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Plataforma premium para transformar leads em experiências web cinematográficas com scroll-driven animations e copiloto IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateDemo}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ Criar Novo Site com IA</span>
          </button>
        </div>
      </div>

      {/* Tabs & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos os Sites ({sites.length})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'published'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Publicados ({sites.filter((s) => s.status === 'published').length})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'draft'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rascunhos ({sites.filter((s) => s.status === 'draft').length})
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Quality Gate Audit Ativo
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-400" /> Domínio Personalizado
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col"
          >
            {/* Card Mockup Preview Header */}
            <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center p-4 border-b border-slate-800">
              <div
                className="w-full h-full rounded border border-slate-800/80 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${
                    site.pages[0]?.sections[0]?.components[0]?.props?.image ||
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800'
                  })`,
                }}
              >
                <div className="inset-0 bg-slate-950/70 backdrop-blur-[2px] w-full h-full p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {site.experienceLevel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        site.status === 'published'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {site.status === 'published' ? '● Publicado' : 'Rascunho'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      {site.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">{site.clientName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Páginas no site:</span>
                  <span className="font-mono text-slate-200 font-semibold">{site.pages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subdomínio:</span>
                  <span className="font-mono text-amber-400">{site.subdomain}.leadforge.app</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Design Token Base:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-700"
                      style={{ backgroundColor: site.designSystem.primaryColor }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-slate-700"
                      style={{ backgroundColor: site.designSystem.accentColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleEditSite(site.id)}
                  className="flex-1 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs rounded border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor Visual</span>
                </button>

                <Link
                  href={`/sites/preview/${site.id}`}
                  target="_blank"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                  title="Apresentação do Cliente"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => deleteSite(site.id)}
                  className="p-2 bg-slate-800/50 hover:bg-red-950/50 text-slate-500 hover:text-red-400 rounded border border-slate-800 transition-colors"
                  title="Excluir Site"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SitesDashboardPage() {
  return (
    <SiteBuilderProvider>
      <SitesDashboardContent />
    </SiteBuilderProvider>
  );
}
