'use client';

import React from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { AISiteAgent } from '@/lib/engines/AISiteAgent';
import { Sparkles, CheckCircle2, Wand2, X, Palette, Type, Layers, Film } from 'lucide-react';

interface NicheRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NicheRecommendationModal: React.FC<NicheRecommendationModalProps> = ({ isOpen, onClose }) => {
  const { activeSite, saveSite } = useSiteBuilder();

  if (!isOpen || !activeSite) return null;

  const leadData = activeSite.leadData || {
    name: activeSite.clientName,
    category: 'Barbearia de Luxo & Atelier',
    city: 'São Paulo',
    state: 'SP',
  };

  const analysis = AISiteAgent.analyzeBusiness(leadData);

  const handleApplyRecommendation = () => {
    const regenerated = AISiteAgent.generateFromLead(leadData, 'cinematic');
    saveSite({
      ...regenerated,
      id: activeSite.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Recomendação IA de Arquitetura Comercial</h2>
              <p className="text-xs text-slate-400">Direção criativa personalizada para {activeSite.clientName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-200 overflow-y-auto max-h-[75vh] custom-scrollbar">
          {/* Identified Sector Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Segmento Identificado</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5 capitalize">{analysis.sector} — {leadData.category}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Score Comercial: 98%
            </span>
          </div>

          {/* Recommendation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Style & Vibe */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Wand2 className="w-4 h-4" /> Estilo & Posicionamento
              </div>
              <div className="text-sm font-bold text-white">Cinematic Editorial Luxury</div>
              <p className="text-[11px] text-slate-400">{analysis.tagline}</p>
            </div>

            {/* Typography */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Type className="w-4 h-4" /> Tipografia Recomendada
              </div>
              <div className="text-sm font-bold text-white">{analysis.headingFont.split(',')[0]}</div>
              <p className="text-[11px] text-slate-400">Títulos em {analysis.headingFont.split(',')[0]} + Corpo em {analysis.bodyFont.split(',')[0]}</p>
            </div>

            {/* Color Palette */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Palette className="w-4 h-4" /> Paleta de Cores Exclusiva
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-6 h-6 rounded border border-slate-700" style={{ backgroundColor: analysis.primaryColor }} title="Primária" />
                <span className="w-6 h-6 rounded border border-slate-700" style={{ backgroundColor: analysis.accentColor }} title="Accent" />
                <span className="w-6 h-6 rounded border border-slate-700" style={{ backgroundColor: analysis.backgroundColor }} title="Fundo" />
                <span className="text-xs font-mono text-slate-400">{analysis.accentColor}</span>
              </div>
            </div>

            {/* Hero Motion */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Film className="w-4 h-4" /> Animação de Entrada
              </div>
              <div className="text-sm font-bold text-white">Scroll-Driven Frame Sequence</div>
              <p className="text-[11px] text-slate-400">Video scrubbing a 60fps sincronizado à rolagem.</p>
            </div>
          </div>

          {/* Recommended Sections List */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Estrutura de Páginas & Seções Recomendadas</span>
              <span className="text-amber-400 font-mono">7 Bloco de Alta Conversão</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hero Cinematic com Badge
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Filosofia & Métricas de Avaliação
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Menu de Serviços Autorais
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Galeria Mosaico do Ambiente
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded border border-slate-700 transition-colors"
          >
            Manter Configuração Atual
          </button>

          <button
            onClick={handleApplyRecommendation}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ Aplicar Recomendação IA no Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
