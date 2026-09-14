'use client';

import React, { useState, useEffect } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { CanvasPreview } from './CanvasPreview';
import { CommandBar } from './CommandBar';
import { FrameTimelineEditor } from './FrameTimelineEditor';
import { AssetManagerModal } from '../assets/AssetManagerModal';
import { NicheRecommendationModal } from './NicheRecommendationModal';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Save,
  Globe,
  Sparkles,
  Eye,
  CheckCircle2,
  FolderPlus,
  Sliders,
  PanelLeft,
  PanelRight,
  Check
} from 'lucide-react';
import Link from 'next/link';

export const BuilderLayout: React.FC = () => {
  const {
    activeSite,
    breakpoint,
    setBreakpoint,
    undo,
    redo,
    canUndo,
    canRedo,
    auditResult,
    saveSite,
  } = useSiteBuilder();

  // Responsive Drawer & Modal States
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isNicheModalOpen, setIsNicheModalOpen] = useState(false);
  const [publishedToast, setPublishedToast] = useState(false);
  const [assetCallback, setAssetCallback] = useState<((url: string) => void) | null>(null);

  // Auto-collapse sidebars on smaller laptop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsRightOpen(false);
      } else {
        setIsRightOpen(true);
      }
      if (window.innerWidth < 1024) {
        setIsLeftOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard Shortcuts (CTRL+Z Undo, CTRL+Y or CTRL+SHIFT+Z Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo) redo();
        } else {
          e.preventDefault();
          if (canUndo) undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  if (!activeSite) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Nenhum projeto selecionado.</p>
          <Link
            href="/sites"
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400"
          >
            Voltar para Meus Sites
          </Link>
        </div>
      </div>
    );
  }

  const handlePublish = () => {
    const updated = { ...activeSite, status: 'published' as const };
    saveSite(updated);
    setPublishedToast(true);
    setTimeout(() => setPublishedToast(false), 4000);
  };

  const handleOpenAssetManagerWithCallback = (cb?: (url: string) => void) => {
    if (cb) setAssetCallback(() => cb);
    setIsAssetModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden font-sans select-none relative">
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-40 flex-shrink-0">
        {/* Left: Back, Title & Sidebar Toggles */}
        <div className="flex items-center gap-3">
          <Link
            href="/sites"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Voltar aos Projetos"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsLeftOpen(!isLeftOpen)}
            className={`p-1.5 rounded transition-colors ${
              isLeftOpen ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Alternar Painel Esquerdo (Camadas & Presets)"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold text-white tracking-tight truncate max-w-[160px] sm:max-w-xs">
                {activeSite.name}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {activeSite.experienceLevel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{activeSite.clientName}</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> Salvo
              </span>
            </div>
          </div>
        </div>

        {/* Center: Undo/Redo, Breakpoints, Asset & Recommendation Modals */}
        <div className="flex items-center gap-3">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-colors"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-colors"
              title="Refazer (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Breakpoint Switcher */}
          <div className="hidden md:flex items-center bg-slate-950 rounded p-1 border border-slate-800 gap-1">
            <button
              onClick={() => setBreakpoint('desktop')}
              className={`p-1.5 rounded text-xs transition-all ${
                breakpoint === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBreakpoint('laptop')}
              className={`p-1.5 rounded text-xs transition-all ${
                breakpoint === 'laptop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Laptop (1280px)"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBreakpoint('tablet')}
              className={`p-1.5 rounded text-xs transition-all ${
                breakpoint === 'tablet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tablet (1024px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBreakpoint('mobile')}
              className={`p-1.5 rounded text-xs transition-all ${
                breakpoint === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Asset Manager Trigger */}
          <button
            onClick={() => handleOpenAssetManagerWithCallback()}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Gerenciador de Assets & Mídia"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Assets</span>
          </button>

          {/* AI Recommendation Modal Trigger */}
          <button
            onClick={() => setIsNicheModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Recomendação de Arquitetura IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">IA Niche</span>
          </button>
        </div>

        {/* Right: Score, Preview, Save & Right Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {/* Fullscreen Preview */}
          <Link
            href={`/sites/preview/${activeSite.id}`}
            target="_blank"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Apresentar</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={() => saveSite(activeSite)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salvar</span>
          </button>

          {/* Publish CTA */}
          <button
            onClick={handlePublish}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publicar</span>
          </button>

          {/* Right Inspector Toggle */}
          <button
            onClick={() => setIsRightOpen(!isRightOpen)}
            className={`p-1.5 rounded transition-colors ${
              isRightOpen ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Alternar Inspetor de Propriedades (Painel Direito)"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Published Toast */}
      {publishedToast && (
        <div className="absolute top-16 right-6 z-50 bg-emerald-950 border border-emerald-800 text-emerald-300 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold">Site Publicado com Sucesso!</div>
            <div className="text-[11px] text-emerald-400/80">
              Disponível em: <span className="underline font-mono">https://{activeSite.subdomain}.leadforge.app</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Shell */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Container */}
        {isLeftOpen && <LeftSidebar />}
        
        {/* Canvas & Scrubber */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <CanvasPreview />
          <FrameTimelineEditor />
        </div>

        {/* Right Sidebar Container */}
        <RightSidebar
          isOpen={isRightOpen}
          onCloseDrawer={() => setIsRightOpen(false)}
          onOpenAssetManager={(cb) => handleOpenAssetManagerWithCallback(cb)}
        />
      </div>

      {/* Floating AI Command Bar */}
      <CommandBar />

      {/* Modals */}
      <AssetManagerModal
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false);
          setAssetCallback(null);
        }}
        onSelectAsset={(url) => {
          if (assetCallback) assetCallback(url);
        }}
      />

      <NicheRecommendationModal
        isOpen={isNicheModalOpen}
        onClose={() => setIsNicheModalOpen(false)}
      />
    </div>
  );
};
