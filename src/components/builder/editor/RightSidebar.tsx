'use client';

import React, { useState } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { AVAILABLE_FONTS, TYPOGRAPHY_PRESETS, loadGoogleFont } from '@/lib/utils/fontLoader';
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
  Maximize2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  MousePointer,
  Film,
  LayoutGrid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { SiteComponentSchema } from '@/lib/types/siteBuilder';

interface RightSidebarProps {
  isOpen?: boolean;
  onCloseDrawer?: () => void;
  onOpenAssetManager?: (callback: (url: string) => void) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen = true,
  onCloseDrawer,
  onOpenAssetManager,
}) => {
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
    breakpoint,
    setBreakpoint,
  } = useSiteBuilder();

  // Accordion Section Open States
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    positioning: true,
    typography: true,
    colors: false,
    spacing: false,
    border: false,
    animation: false,
    interactions: false,
    responsive: false,
    audit: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!activeSite || !isOpen) return null;

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

  const handleStyleOverride = (key: string, value: string) => {
    if (!selectedComponent || !selectedComponentId) return;
    const currentOverrides = selectedComponent.styleOverrides || {};
    updateComponentProps(selectedComponentId, {
      styleOverrides: {
        ...currentOverrides,
        [key]: value,
      },
    });
  };

  const handleTokenChange = (key: string, value: any) => {
    updateDesignSystem({ [key]: value });
    if (key === 'headingFont' || key === 'bodyFont') {
      loadGoogleFont(value);
    }
  };

  const handleApplyTypographyPreset = (presetId: string) => {
    const preset = TYPOGRAPHY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      updateDesignSystem({
        headingFont: preset.headingFont,
        bodyFont: preset.bodyFont,
      });
      loadGoogleFont(preset.headingFont);
      loadGoogleFont(preset.bodyFont);
    }
  };

  return (
    <aside className="w-[340px] xl:w-[360px] border-l border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col h-full overflow-hidden text-slate-200 shadow-2xl flex-shrink-0 z-30">
      {/* Inspector Header */}
      <div className="h-12 border-b border-slate-800 bg-slate-950/70 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Inspetor de Propriedades</span>
        </div>

        {selectedComponent && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-amber-400 border border-slate-700">
            #{selectedComponent.variant}
          </span>
        )}
      </div>

      {/* Accordion Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {/* Section 1: CONTENT */}
        {selectedComponent ? (
          <>
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
              <button
                onClick={() => toggleSection('content')}
                className="w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-xs font-semibold text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Conteúdo do Componente
                </span>
                {openSections.content ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>

            {openSections.content && (
              <div className="p-3 space-y-3 text-xs border-t border-slate-800/80">
                {selectedComponent.props.title !== undefined && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Título Principal</label>
                    <input
                      type="text"
                      value={selectedComponent.props.title || ''}
                      onChange={(e) => handlePropChange('title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {selectedComponent.props.subtitle !== undefined && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Subtítulo / Tagline</label>
                    <input
                      type="text"
                      value={selectedComponent.props.subtitle || ''}
                      onChange={(e) => handlePropChange('subtitle', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {selectedComponent.props.badge !== undefined && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Badge de Destaque</label>
                    <input
                      type="text"
                      value={selectedComponent.props.badge || ''}
                      onChange={(e) => handlePropChange('badge', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {selectedComponent.props.description !== undefined && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Descrição</label>
                    <textarea
                      rows={3}
                      value={selectedComponent.props.description || ''}
                      onChange={(e) => handlePropChange('description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                )}

                {selectedComponent.props.ctaText !== undefined && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-medium">Texto do CTA</label>
                      <input
                        type="text"
                        value={selectedComponent.props.ctaText || ''}
                        onChange={(e) => handlePropChange('ctaText', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-medium">Link do CTA</label>
                      <input
                        type="text"
                        value={selectedComponent.props.ctaLink || ''}
                        onChange={(e) => handlePropChange('ctaLink', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedComponent.props.image !== undefined && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium flex items-center justify-between">
                      <span>URL da Imagem</span>
                      {onOpenAssetManager && (
                        <button
                          onClick={() => onOpenAssetManager((url) => handlePropChange('image', url))}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" /> Biblioteca
                        </button>
                      )}
                    </label>
                    <input
                      type="text"
                      value={selectedComponent.props.image || ''}
                      onChange={(e) => handlePropChange('image', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: POSITIONING & ALIGNMENT */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
            <button
              onClick={() => toggleSection('positioning')}
              className="w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-xs font-semibold text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5 text-amber-400" /> Posicionamento & Alinhamento do Texto
              </span>
              {openSections.positioning ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openSections.positioning && (
              <div className="p-3 space-y-3 text-xs border-t border-slate-800/80">
                {/* Horizontal Alignment */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">Alinhamento Horizontal</label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded border border-slate-800">
                    <button
                      onClick={() => handleStyleOverride('textAlign', 'left')}
                      className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                        (selectedComponent.styleOverrides?.textAlign || 'left') === 'left' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Esquerda"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStyleOverride('textAlign', 'center')}
                      className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                        selectedComponent.styleOverrides?.textAlign === 'center' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Centralizado"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStyleOverride('textAlign', 'right')}
                      className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                        selectedComponent.styleOverrides?.textAlign === 'right' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Direita"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStyleOverride('textAlign', 'justify')}
                      className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                        selectedComponent.styleOverrides?.textAlign === 'justify' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Justificado"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Max Width */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">Largura Máxima do Bloco de Texto</label>
                  <select
                    value={selectedComponent.styleOverrides?.maxWidth || 'max-w-xl'}
                    onChange={(e) => handleStyleOverride('maxWidth', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="max-w-md">Compacto (max-w-md)</option>
                    <option value="max-w-xl">Médio (max-w-xl)</option>
                    <option value="max-w-3xl">Amplo (max-w-3xl)</option>
                    <option value="max-w-5xl">Extra Amplo (max-w-5xl)</option>
                    <option value="w-full">100% Largura Total (w-full)</option>
                  </select>
                </div>

                {/* Title Size Override */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">Escala do Título</label>
                  <select
                    value={selectedComponent.styleOverrides?.fontSize || 'default'}
                    onChange={(e) => handleStyleOverride('fontSize', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="default">Padrão do Tema</option>
                    <option value="text-2xl">Pequeno (24px)</option>
                    <option value="text-4xl">Médio (36px)</option>
                    <option value="text-6xl">Grande (60px)</option>
                    <option value="text-8xl">Display Ultra (96px)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg text-center text-slate-500 text-xs">
            Selecione um elemento no canvas para editar o conteúdo.
          </div>
        )}

        {/* Section 2: TYPOGRAPHY & FONTS */}
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
          <button
            onClick={() => toggleSection('typography')}
            className="w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-xs font-semibold text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-amber-400" /> Sistema Tipográfico
            </span>
            {openSections.typography ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.typography && (
            <div className="p-3 space-y-3 text-xs border-t border-slate-800/80">
              {/* Presets */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Presets Tipográficos</label>
                <select
                  onChange={(e) => handleApplyTypographyPreset(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Selecione uma combinação autoral...</option>
                  {TYPOGRAPHY_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.niche})
                    </option>
                  ))}
                </select>
              </div>

              {/* Global Fonts */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Fonte dos Títulos (Heading)</label>
                <select
                  value={activeSite.designSystem.headingFont}
                  onChange={(e) => handleTokenChange('headingFont', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font.family} value={font.family}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Fonte de Corpo (Body)</label>
                <select
                  value={activeSite.designSystem.bodyFont}
                  onChange={(e) => handleTokenChange('bodyFont', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font.family} value={font.family}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: COLORS & PALETTE */}
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
          <button
            onClick={() => toggleSection('colors')}
            className="w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-xs font-semibold text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-amber-400" /> Cores & Paleta
            </span>
            {openSections.colors ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.colors && (
            <div className="p-3 space-y-3 text-xs border-t border-slate-800/80">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
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

                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
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

                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
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

                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
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
          )}
        </div>

        {/* Section 4: BORDER & SHADOW */}
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
          <button
            onClick={() => toggleSection('border')}
            className="w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-xs font-semibold text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Borda & Geometria
            </span>
            {openSections.border ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.border && (
            <div className="p-3 space-y-3 text-xs border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Borda Arredondada (Radius)</label>
                <select
                  value={activeSite.designSystem.borderRadius}
                  onChange={(e) => handleTokenChange('borderRadius', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="0px">Reto (0px — Editorial Luxury)</option>
                  <option value="0.375rem">Suave (6px — Premium)</option>
                  <option value="0.75rem">Moderno (12px — SaaS)</option>
                  <option value="1.5rem">Arredondado (24px — Creative)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: ANIMATION & MOTION */}
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
          <button
            onClick={() => toggleSection('animation')}
            className="w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-xs font-semibold text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Animações Scroll-Driven
            </span>
            {openSections.animation ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.animation && (
            <div className="p-3 space-y-3 text-xs border-t border-slate-800/80">
              {selectedComponent ? (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">Efeito no Scroll</label>
                  <select
                    value={selectedComponent.animation?.type || 'fade-up'}
                    onChange={(e) => {
                      const updatedAnim = {
                        enabled: true,
                        type: e.target.value as any,
                        scrub: true,
                        start: 'top 85%',
                        end: 'bottom 15%',
                      };
                      handlePropChange('animation', updatedAnim);
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
              ) : (
                <p className="text-[11px] text-slate-500 text-center py-2">
                  Selecione um componente para ajustar animações individuais.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 6: AI AUDIT & QUALITY GATE */}
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
          <button
            onClick={() => toggleSection('audit')}
            className="w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-xs font-semibold text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Auditoria de Qualidade IA
            </span>
            {openSections.audit ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.audit && auditResult && (
            <div className="p-3 space-y-3 text-xs border-t border-slate-800/80">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {auditResult.overallScore} / 100
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Pontuação Geral de Qualidade Comercial</div>

                <button
                  onClick={() => autoFixIssues()}
                  disabled={isAiProcessing || auditResult.issues.length === 0}
                  className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Auto-Fix Todos os Problemas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
