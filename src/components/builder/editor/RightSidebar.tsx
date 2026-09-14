'use client';

import React, { useState } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import {
  Sliders,
  Palette,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Wand2,
  Layers,
  Type,
  Maximize2
} from 'lucide-react';
import { SiteComponentSchema } from '@/lib/types/siteBuilder';

export const RightSidebar: React.FC = () => {
  const {
    activeSite,
    activePageId,
    selectedComponentId,
    updateComponentProps,
    updateDesignSystem,
    auditResult,
    autoFixIssues,
    runAudit,
    isAiProcessing,
  } = useSiteBuilder();

  const [activeTab, setActiveTab] = useState<'inspector' | 'design' | 'animation' | 'audit'>('inspector');

  if (!activeSite) return null;

  // Find active page and selected component
  const activePage = activeSite.pages.find((p) => p.id === activePageId) || activeSite.pages[0];
  
  let selectedComponent: SiteComponentSchema | null = null;
  if (selectedComponentId && activePage) {
    for (const sec of activePage.sections) {
      const cmp = sec.components.find((c) => c.id === selectedComponentId);
      if (cmp) {
        selectedComponent = cmp;
        break;
      }
    }
  }

  const handlePropChange = (key: string, value: any) => {
    if (!selectedComponentId) return;
    updateComponentProps(selectedComponentId, { [key]: value });
  };

  const handleTokenChange = (key: string, value: any) => {
    updateDesignSystem({ [key]: value });
  };

  return (
    <aside className="w-80 border-l border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col h-full overflow-hidden text-slate-200">
      {/* Header Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1">
        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex-1 py-2 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'inspector'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Inspetor de Propriedades"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Props</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-2 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'design'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Design System & Cores"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design</span>
        </button>

        <button
          onClick={() => setActiveTab('animation')}
          className={`flex-1 py-2 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'animation'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Animações Scroll-Driven"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Motion</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all relative ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Auditoria de Qualidade IA"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Audit</span>
          {auditResult && auditResult.issues.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 animate-pulse" />
          )}
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* Tab 1: Component Inspector */}
        {activeTab === 'inspector' && (
          <div>
            {selectedComponent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{selectedComponent.name}</h3>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                      {selectedComponent.variant}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    #{selectedComponent.id.slice(-4)}
                  </span>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  {selectedComponent.props.title !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Título Principal</label>
                      <input
                        type="text"
                        value={selectedComponent.props.title || ''}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {selectedComponent.props.subtitle !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Subtítulo / Tagline</label>
                      <input
                        type="text"
                        value={selectedComponent.props.subtitle || ''}
                        onChange={(e) => handlePropChange('subtitle', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {selectedComponent.props.badge !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Badge de Destaque</label>
                      <input
                        type="text"
                        value={selectedComponent.props.badge || ''}
                        onChange={(e) => handlePropChange('badge', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {selectedComponent.props.description !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Descrição</label>
                      <textarea
                        rows={3}
                        value={selectedComponent.props.description || ''}
                        onChange={(e) => handlePropChange('description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  )}

                  {selectedComponent.props.ctaText !== undefined && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Texto do CTA</label>
                        <input
                          type="text"
                          value={selectedComponent.props.ctaText || ''}
                          onChange={(e) => handlePropChange('ctaText', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Link do CTA</label>
                        <input
                          type="text"
                          value={selectedComponent.props.ctaLink || ''}
                          onChange={(e) => handlePropChange('ctaLink', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {selectedComponent.props.image !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">URL da Imagem</label>
                      <input
                        type="text"
                        value={selectedComponent.props.image || ''}
                        onChange={(e) => handlePropChange('image', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  )}

                  {selectedComponent.props.whatsappNumber !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Número do WhatsApp</label>
                      <input
                        type="text"
                        value={selectedComponent.props.whatsappNumber || ''}
                        onChange={(e) => handlePropChange('whatsappNumber', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <Layers className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
                <p className="text-xs font-medium">Nenhum componente selecionado</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
                  Clique em qualquer elemento na preview ou na lista de camadas para editar suas propriedades.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Design System Tokens */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Design Tokens do Site</h3>

            {/* Colors */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">Paleta de Cores</label>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <input
                    type="color"
                    value={activeSite.designSystem.primaryColor}
                    onChange={(e) => handleTokenChange('primaryColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <div className="text-[11px] font-medium text-slate-300">Primária</div>
                    <div className="text-[10px] font-mono text-slate-500">{activeSite.designSystem.primaryColor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <input
                    type="color"
                    value={activeSite.designSystem.accentColor}
                    onChange={(e) => handleTokenChange('accentColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <div className="text-[11px] font-medium text-slate-300">Accent</div>
                    <div className="text-[10px] font-mono text-slate-500">{activeSite.designSystem.accentColor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <input
                    type="color"
                    value={activeSite.designSystem.backgroundColor}
                    onChange={(e) => handleTokenChange('backgroundColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <div className="text-[11px] font-medium text-slate-300">Fundo</div>
                    <div className="text-[10px] font-mono text-slate-500">{activeSite.designSystem.backgroundColor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <input
                    type="color"
                    value={activeSite.designSystem.textColor}
                    onChange={(e) => handleTokenChange('textColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <div className="text-[11px] font-medium text-slate-300">Texto</div>
                    <div className="text-[10px] font-mono text-slate-500">{activeSite.designSystem.textColor}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" /> Tipografia
              </label>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Fonte de Títulos</label>
                <select
                  value={activeSite.designSystem.headingFont}
                  onChange={(e) => handleTokenChange('headingFont', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Inter, sans-serif">Inter (Modern Clean)</option>
                  <option value="Cormorant Garamond, serif">Cormorant Garamond (Haute Elegance)</option>
                  <option value="Playfair Display, serif">Playfair Display (Editorial)</option>
                  <option value="Montserrat, sans-serif">Montserrat (Geometric Tech)</option>
                  <option value="Space Grotesk, sans-serif">Space Grotesk (Modern Tech)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Fonte de Corpo</label>
                <select
                  value={activeSite.designSystem.bodyFont}
                  onChange={(e) => handleTokenChange('bodyFont', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Inter, sans-serif">Inter (Clean Neutral)</option>
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (SaaS)</option>
                  <option value="Roboto, sans-serif">Roboto (Standard)</option>
                </select>
              </div>
            </div>

            {/* Layout Geometry */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Geometria & Bordas
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Borda (Radius)</label>
                  <select
                    value={activeSite.designSystem.borderRadius}
                    onChange={(e) => handleTokenChange('borderRadius', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="0px">Reto (0px - Luxe)</option>
                    <option value="0.375rem">Suave (6px)</option>
                    <option value="0.75rem">Moderno (12px)</option>
                    <option value="1.5rem">Arredondado (24px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Espaçamento</label>
                  <select
                    value={activeSite.designSystem.spacingScale}
                    onChange={(e) => handleTokenChange('spacingScale', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="compact">Compacto</option>
                    <option value="normal">Normal</option>
                    <option value="spacious">Amplo / Editorial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Motion & Scroll Animations */}
        {activeTab === 'animation' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Animações Scroll-Driven</h3>

            {selectedComponent ? (
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Efeito ao Rolar</span>
                    <span className="text-[10px] font-mono text-amber-400">GSAP / ScrollTrigger</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tipo de Animação</label>
                    <select
                      value={selectedComponent.animation?.type || 'fade-up'}
                      onChange={(e) => {
                        const newAnim = {
                          enabled: true,
                          type: e.target.value as any,
                          scrub: true,
                          start: 'top 85%',
                          end: 'bottom 15%',
                        };
                        updateComponentProps(selectedComponent!.id, {
                          animation: newAnim,
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="fade-up">Fade Up Smooth</option>
                      <option value="scale-in">Scale In Cinematic</option>
                      <option value="parallax">Parallax Scroll Depth</option>
                      <option value="sticky-pin">Sticky Pin Section</option>
                      <option value="frame-sequence">Scroll Frame Sequence (Video Scrub)</option>
                      <option value="horizontal-scroll">Horizontal Scroll Progression</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-300">Scrub (Sincronizado ao Scroll)</span>
                    <input
                      type="checkbox"
                      checked={selectedComponent.animation?.scrub !== false}
                      onChange={(e) => {
                        if (selectedComponent?.animation) {
                          const updatedAnim = { ...selectedComponent.animation, scrub: e.target.checked };
                          updateComponentProps(selectedComponent.id, { animation: updatedAnim });
                        }
                      }}
                      className="rounded accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                Selecione um componente para configurar animações customizadas.
              </p>
            )}
          </div>
        )}

        {/* Tab 4: AI Quality Audit */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Quality Gate IA
                </h3>
                <span className="text-[11px] text-slate-400">Auditoria automatizada em 7 dimensões</span>
              </div>

              <button
                onClick={() => runAudit()}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded border border-slate-700 transition-colors"
              >
                Reanalisar
              </button>
            </div>

            {/* Score Metric */}
            {auditResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
                <div className="text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {auditResult.overallScore} / 100
                </div>
                <div className="text-xs font-medium text-slate-400 mt-1">Pontuação Geral de Qualidade</div>

                {/* Score Grid Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-left">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Design & Luxe</span>
                    <span className="font-mono font-semibold text-amber-400">{auditResult.scores.design}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">UX & Fluição</span>
                    <span className="font-mono font-semibold text-amber-400">{auditResult.scores.ux}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Responsivo</span>
                    <span className="font-mono font-semibold text-amber-400">{auditResult.scores.mobile}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Conversão</span>
                    <span className="font-mono font-semibold text-amber-400">{auditResult.scores.conversion}</span>
                  </div>
                </div>

                {/* Auto Fix Button */}
                <button
                  onClick={() => autoFixIssues()}
                  disabled={isAiProcessing || auditResult.issues.length === 0}
                  className="w-full mt-4 py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Auto-Fix Todos os Problemas com IA
                </button>
              </div>
            )}

            {/* Issue List */}
            {auditResult && auditResult.issues.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Problemas Detectados ({auditResult.issues.length})
                </div>
                {auditResult.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-2.5 bg-slate-950/70 border border-slate-800 rounded flex gap-2.5 text-xs"
                  >
                    {issue.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                    {issue.severity === 'warning' && <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                    {issue.severity === 'suggestion' && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />}
                    <div>
                      <div className="font-semibold text-slate-200">{issue.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{issue.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-center text-emerald-400 text-xs">
                ✨ Nenhum problema encontrado! O site está pronto para publicação comercial.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
