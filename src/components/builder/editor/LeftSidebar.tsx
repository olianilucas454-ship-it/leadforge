'use client';

import React, { useState } from 'react';
import { useSiteBuilder } from '../../../lib/context/SiteBuilderContext';
import { Layers, FileText, Component, Folder, Plus, Trash2, Eye, EyeOff, Film, Wand2 } from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { activeSite, activePageId, selectedComponentId, setSelectedComponentId, setActivePageId } = useSiteBuilder();
  const [activeTab, setActiveTab] = useState<'layers' | 'pages' | 'components' | 'assets'>('layers');

  if (!activeSite) return null;

  const currentPage = activeSite.pages.find((p) => p.id === activePageId) || activeSite.pages[0];

  return (
    <aside className="w-72 bg-[#0C0E17] border-r border-slate-800 flex flex-col h-full text-slate-200 select-none">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'layers' ? 'border-emerald-400 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
          title="Camadas & Estrutura"
        >
          <Layers className="w-3.5 h-3.5" />
          Camadas
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'pages' ? 'border-emerald-400 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
          title="Páginas do Site"
        >
          <FileText className="w-3.5 h-3.5" />
          Páginas
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'components' ? 'border-emerald-400 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
          title="Biblioteca de Componentes"
        >
          <Component className="w-3.5 h-3.5" />
          Blocos
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'layers' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 tracking-wider">
              ÁRVORE DE SEÇÕES ({currentPage?.sections.length || 0})
            </span>

            {currentPage?.sections.map((section) => (
              <div key={section.id} className="space-y-1">
                <div className="text-xs font-semibold text-slate-400 px-2 py-1 bg-slate-900/80 rounded flex justify-between items-center">
                  <span>{section.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">{section.variant}</span>
                </div>

                {section.components.map((cmp) => (
                  <div
                    key={cmp.id}
                    onClick={() => setSelectedComponentId(cmp.id)}
                    className={`pl-4 pr-2 py-2 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      selectedComponentId === cmp.id
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {cmp.variant.includes('Cinematic') ? <Film className="w-3.5 h-3.5 text-amber-400" /> : <Component className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="truncate">{cmp.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 tracking-wider">
              PÁGINAS DO PROJETO
            </span>
            {activeSite.pages.map((page) => (
              <div
                key={page.id}
                onClick={() => setActivePageId(page.id)}
                className={`p-2.5 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  activePageId === page.id ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{page.title}</span>
                <span className="text-[10px] font-mono text-slate-500">{page.slug}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 tracking-wider">
              BIBLIOTECA PRESETS
            </span>

            {[
              { name: 'Hero Cinematográfico', desc: 'Animação em frames por scroll' },
              { name: 'Hero Minimal Split', desc: 'Layout 50/50 com imagem' },
              { name: 'Horizon Navigator', desc: 'Scroll vertical -> horizontal' },
              { name: 'Menu & Rituais', desc: 'Lista interativa de alta precisão' },
              { name: 'CTA WhatsApp Minimal', desc: 'Conversão em 1 clique' },
            ].map((preset, idx) => (
              <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500/40 cursor-pointer transition-all">
                <h4 className="text-xs font-bold text-slate-200">{preset.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{preset.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
        LeadForge Experience Engine v2.0
      </div>
    </aside>
  );
};
