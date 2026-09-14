'use client';

import React, { useState } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { Play, Pause, RotateCcw, Sliders, Film, Layers } from 'lucide-react';

export const FrameTimelineEditor: React.FC = () => {
  const { activeSite, activePageId, selectedComponentId } = useSiteBuilder();
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  if (!activeSite) return null;

  const activePage = activeSite.pages.find((p) => p.id === activePageId) || activeSite.pages[0];
  let selectedComponent = null;

  if (selectedComponentId && activePage) {
    for (const sec of activePage.sections) {
      const cmp = sec.components.find((c) => c.id === selectedComponentId);
      if (cmp) {
        selectedComponent = cmp;
        break;
      }
    }
  }

  // Only show timeline if active component or site has frameSequence / scroll animation
  const isSequenceComponent =
    selectedComponent?.category === 'frame-sequence' ||
    selectedComponent?.category === 'horizontal-scroll' ||
    selectedComponent?.animation?.type === 'frame-sequence';

  if (!isSequenceComponent) return null;

  return (
    <div className="h-24 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md flex flex-col px-4 py-2 text-slate-200 select-none">
      {/* Controls Header */}
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-white">Timeline Keyframes</span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            {selectedComponent?.name || 'Scroll Scrub'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScrollProgress(0)}
            className="p-1 hover:text-amber-400 text-slate-400 transition-colors"
            title="Reset Scrubber"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:text-amber-400 text-slate-400 transition-colors"
            title={isPlaying ? 'Pausar' : 'Simular Scroll'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <span className="font-mono text-xs text-amber-400 w-12 text-right">{scrollProgress}%</span>
        </div>
      </div>

      {/* Scrubber Track */}
      <div className="flex-1 flex flex-col justify-center relative mt-1">
        {/* Keyframe Markers */}
        <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
          <span>0% (Hero Entry)</span>
          <span>25%</span>
          <span>50% (Frame Pin)</span>
          <span>75%</span>
          <span>100% (Exit)</span>
        </div>

        {/* Track Line & Slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={scrollProgress}
            onChange={(e) => setScrollProgress(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />

          {/* Preset Keyframe Dots */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[0%] w-2 h-2 rounded-full bg-amber-500 pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[25%] w-2 h-2 rounded-full bg-slate-600 pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/30 pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[75%] w-2 h-2 rounded-full bg-slate-600 pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[100%] w-2 h-2 rounded-full bg-amber-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
