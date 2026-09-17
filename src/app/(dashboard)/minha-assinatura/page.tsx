'use client';

import React, { useState } from 'react';
import { CreditCard, Calendar, Zap, Shield, Crown, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/context/AuthContext';
import { getPlanBySlug } from '@/lib/config/plans';
import Link from 'next/link';

export default function MinhaAssinaturaPage() {
  const { user, isAdmin, creditsRemaining, monthlyAllowance, searchesUsed, currentPlanSlug, selectPlan } = useAuth();
  const plan = getPlanBySlug(currentPlanSlug);

  const [isCanceling, setIsCanceling] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const handleCancelSubscription = () => {
    if (confirm('Tem certeza de que deseja cancelar sua assinatura? Seus leads e dados salvos continuarão intactos.')) {
      setIsCanceling(true);
      setTimeout(() => {
        selectPlan('free');
        setIsCanceling(false);
        setCanceled(true);
      }, 1200);
    }
  };

  const renewalDate = new Date(Date.now() + 30 * 86400 * 1000).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Header title="Minha Assinatura" />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold">Minha Assinatura</h1>
          <p className="text-gray-400 text-sm">Gerencie seu plano, limite de pesquisas e renovações do Asaas.</p>
        </div>

        {canceled && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Assinatura cancelada com sucesso. Seu plano retornou para a versão Free. Seus leads salvos permanecem preservados.</span>
          </div>
        )}

        {/* Subscription Overview Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Plano Atual</span>
              <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                <span>Plano {plan.name}</span>
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                  {isAdmin ? 'ADMIN MASTER' : 'ATIVO'}
                </span>
              </h2>
            </div>

            <div className="text-right">
              <p className="text-2xl font-extrabold text-accent">
                R$ {plan.price.toFixed(2).replace('.', ',')}
                <span className="text-xs text-gray-400 font-normal">/mês</span>
              </p>
              <p className="text-xs text-gray-400 font-mono">Processado via Asaas Gateway</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <Zap className="w-4 h-4 text-accent" />
                <span>Pesquisas Disponíveis</span>
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">
                {isAdmin ? 'Ilimitadas' : `${creditsRemaining} / ${monthlyAllowance}`}
              </p>
              <p className="text-[11px] text-gray-400">{searchesUsed} pesquisas utilizadas este mês</p>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Próxima Renovação</span>
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">{renewalDate}</p>
              <p className="text-[11px] text-gray-400">Cobrança recorrente mensal</p>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <Shield className="w-4 h-4 text-accent" />
                <span>Status da Conta</span>
              </div>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">ATIVO</p>
              <p className="text-[11px] text-gray-400">Gateway Asaas Vinculado</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-border flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3">
              <Link
                href="/planos"
                className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Alterar Plano
              </Link>
              <Link
                href="/history"
                className="px-5 py-2.5 rounded-xl bg-background border border-border hover:border-accent text-text-primary font-bold text-xs uppercase tracking-wider transition-all"
              >
                Ver Histórico de Buscas
              </Link>
            </div>

            {!isAdmin && currentPlanSlug !== 'free' && (
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:underline transition-colors font-semibold"
              >
                {isCanceling ? 'Cancelando...' : 'Cancelar assinatura'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
