'use client';

import React from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { SiteRenderer } from '../renderers/SiteRenderer';
import { Monitor, Laptop, Tablet, Smartphone, Sparkles } from 'lucide-react';

export const CanvasPreview: React.FC = () => {
  const { activeSite, activePageId, breakpoint, isAiProcessing, selectedComponentId, setSelectedComponentId, updateComponentProps } = useSiteBuilder();

  if (!activeSite) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-500">
        Nenhum site ativo selecionado.
      </div>
    );
  }

  const getBreakpointWidth = () => {
    switch (breakpoint) {
      case 'desktop':
        return 'w-full max-w-[1440px]';
      case 'laptop':
        return 'w-[1280px]';
      case 'tablet':
        return 'w-[1024px]';
      case 'mobile':
        return 'w-[390px]';
      default:
        return 'w-full';
    }
  };

  const currentPage = activeSite.pages.find((p) => p.id === activePageId) || activeSite.pages[0];

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto relative flex flex-col items-center py-6 px-4 custom-scrollbar">
      {/* AI Processing Overlay */}
      {isAiProcessing && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
            <Sparkles className="w-5 h-5 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-sm font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            O Copiloto IA está refatorando o site...
          </p>
        </div>
      )}

      {/* Breakpoint Viewport Wrapper */}
      <div
        className={`transition-all duration-300 bg-black rounded-lg border border-slate-800 shadow-2xl shadow-black/80 overflow-hidden min-h-[800px] ${getBreakpointWidth()}`}
      >
        <SiteRenderer
          site={activeSite}
          activePageId={activePageId}
          isEditable={true}
          selectedComponentId={selectedComponentId}
          onSelectComponent={setSelectedComponentId}
          onUpdateComponentProps={updateComponentProps}
        />
      </div>

      {/* Floating Section Jump Navigation Bar */}
      {currentPage?.sections && currentPage.sections.length > 0 && (
        <div className="sticky bottom-4 mt-6 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-4 py-2 shadow-2xl flex items-center gap-2 text-xs font-semibold max-w-full overflow-x-auto">
          <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider whitespace-nowrap mr-1">
            Seções ({currentPage.sections.length}):
          </span>
          {currentPage.sections.map((sec, idx) => {
            const isSecSelected = sec.components.some((c) => c.id === selectedComponentId);
            return (
              <button
                key={sec.id}
                onClick={() => {
                  const firstCmpId = sec.components[0]?.id;
                  if (firstCmpId) {
                    setSelectedComponentId(firstCmpId);
                  }
                }}
                className={`px-3 py-1 rounded-full transition-all text-xs whitespace-nowrap ${
                  isSecSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {idx + 1}. {sec.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
