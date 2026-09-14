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
    </div>
  );
};
