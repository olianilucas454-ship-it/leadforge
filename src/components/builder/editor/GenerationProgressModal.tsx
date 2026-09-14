'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  detail: string;
}

const CREATION_STEPS: Step[] = [
  { id: 1, label: 'Análise de Nicho & Posicionamento', detail: 'Identificando categoria, público-alvo e objetivo de conversão...' },
  { id: 2, label: 'Direção de Arte & Tipografia Autoral', detail: 'Selecionando paleta de cores e fontes para o nicho...' },
  { id: 3, label: 'Composição de Hero & Mídia', detail: 'Gerando fundo cinematográfico e ajustando contraste...' },
  { id: 4, label: 'Estruturação de 7 Páginas Completas', detail: 'Criando Home, Sobre, Serviços, Equipe, Galeria, Depoimentos e Contato...' },
  { id: 5, label: 'Animações Scroll-Driven & Interação', detail: 'Configurando transições de scroll, parallax e efeitos hover...' },
  { id: 6, label: 'Auditoria de Qualidade UX & Mobile', detail: 'Verificando responsividade, contraste e CTAs de conversão...' },
];

interface GenerationProgressModalProps {
  isOpen: boolean;
  onComplete: () => void;
  clientName?: string;
  category?: string;
}

export const GenerationProgressModal: React.FC<GenerationProgressModalProps> = ({
  isOpen,
  onComplete,
  clientName = 'Empresa',
  category = 'Serviços',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < CREATION_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((currentStepIndex + 1) / CREATION_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/25 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Agente Diretor de Arte IA
            </h2>
            <p className="text-xs text-slate-400">
              Criando site autoral para <span className="text-amber-400 font-semibold">{clientName}</span> ({category})
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Progresso de Criação</span>
            <span className="text-amber-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps Checklist */}
        <div className="space-y-3 pt-2">
          {CREATION_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  isDone
                    ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                    : isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-md'
                    : 'bg-slate-950/20 border-slate-900/60 text-slate-600'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isCurrent && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                  {isPending && (
                    <div className="w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-600">
                      {step.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span className={isCurrent ? 'text-amber-300' : isDone ? 'text-slate-200' : 'text-slate-500'}>
                      {step.label}
                    </span>
                    {isDone && <span className="text-[10px] font-mono text-emerald-400 uppercase">Concluído</span>}
                    {isCurrent && <span className="text-[10px] font-mono text-amber-400 uppercase animate-pulse">Em Processo</span>}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-500 text-center font-mono pt-2 border-t border-slate-800">
          LeadForge Website Experience Engine • Lovable & Antigravity Quality Standard
        </div>
      </div>
    </div>
  );
};
