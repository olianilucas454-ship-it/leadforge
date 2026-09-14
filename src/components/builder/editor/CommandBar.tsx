'use client';

import React, { useState, useEffect } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { Sparkles, Send, Command, Zap, Palette, Layout, ShieldCheck } from 'lucide-react';

export const CommandBar: React.FC = () => {
  const { executeAiCommand, isAiProcessing, aiActionLogs } = useSiteBuilder();
  const [isOpen, setIsOpen] = useState(false);
  const [commandText, setCommandText] = useState('');

  // Toggle Command Bar with CMD + K / CTRL + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandText.trim() || isAiProcessing) return;
    executeAiCommand(commandText);
    setCommandText('');
    setIsOpen(false);
  };

  const handleQuickCommand = (promptText: string) => {
    executeAiCommand(promptText);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (Always Visible) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 py-3 rounded-full font-bold text-xs shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-4 h-4" />
        <span>Copiloto IA</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-950/20 rounded text-[10px] font-mono text-slate-900 border border-slate-900/20 ml-1">
          ⌘K
        </kbd>
      </button>

      {/* Modal Command Bar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl shadow-black overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Command Input Header */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Instrua o Copiloto IA (ex: 'Transforme o site para aesthetic minimalista luxury' ou 'Adicione depoimentos')"
                value={commandText}
                onChange={(e) => setCommandText(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commandText.trim() || isAiProcessing}
                className="p-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Action Execution History */}
            {aiActionLogs && aiActionLogs.length > 0 && (
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider font-mono">
                  Histórico Recente de Ações da IA
                </div>
                {aiActionLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span className="text-amber-300">"{log.command}"</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-300">
                      {log.actionsExecuted.map((act, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Suggestions / Shortcuts */}
            <div className="p-4 space-y-3 bg-slate-900/60">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Comandos Rápidos Recomendados</span>
                <span className="text-[10px] text-slate-500 font-mono">Pressione ESC para fechar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickCommand('Tornar hero mais escuro com overlay de alto contraste')}
                  className="p-2.5 rounded border border-slate-800 bg-slate-950/40 hover:bg-amber-500/10 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-200 group-hover:text-amber-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hero Escuro & Contraste</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Aumenta opacidade do overlay e legibilidade do texto.</div>
                </button>

                <button
                  onClick={() => handleQuickCommand('Mudar fonte dos títulos para Space Grotesk modern tech')}
                  className="p-2.5 rounded border border-slate-800 bg-slate-950/40 hover:bg-amber-500/10 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-200 group-hover:text-amber-400">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fonte Space Grotesk</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Aplica tipografia técnica de alto impacto visual.</div>
                </button>

                <button
                  onClick={() => handleQuickCommand('Transformar hero em formato video em autoplay')}
                  className="p-2.5 rounded border border-slate-800 bg-slate-950/40 hover:bg-amber-500/10 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-200 group-hover:text-amber-400">
                    <Layout className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hero Video Background</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Insere vídeo de alta definição com fundo dinâmico.</div>
                </button>

                <button
                  onClick={() => handleQuickCommand('Aplicar paleta de destaque dourado luxury com fonte Cormorant')}
                  className="p-2.5 rounded border border-slate-800 bg-slate-950/40 hover:bg-amber-500/10 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-200 group-hover:text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Estética Dark Gold Luxury</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Aplica acentos dourados e fonte serifada de luxo.</div>
                </button>
              </div>
            </div>

            {/* Footer Close Tip */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>LeadForge Website Experience Copilot v2.0</span>
              <button onClick={() => setIsOpen(false)} className="hover:text-slate-300">
                Fechar [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
