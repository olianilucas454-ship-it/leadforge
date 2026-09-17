'use client';

import React from 'react';
import { AlertTriangle, Crown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CreditExhaustedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditExhaustedModal({ isOpen, onClose }: CreditExhaustedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12121a] border border-red-500/40 p-6 md:p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Você ficou sem pesquisas</h2>
          <p className="text-gray-300 text-sm">
            Você utilizou todas as pesquisas disponíveis no seu plano. Escolha um plano para continuar encontrando novos leads para prospecção comercial.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-background/80 border border-border text-xs text-left space-y-2 font-mono text-gray-400">
          <p className="flex justify-between text-gray-300 font-semibold">
            <span>🔎 Saldo atual:</span>
            <span className="text-red-400">0 pesquisas restantes</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            Seus leads salvos, histórico de pesquisas e CRM permanecem 100% acessíveis na sua conta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border border-border text-gray-300 hover:text-white hover:bg-surface-hover font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          
          <Link
            href="/planos"
            className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            <span>Ver Planos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
