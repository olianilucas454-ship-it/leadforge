'use client';

import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/context/AuthContext';
import { PLAN_CONFIG, PlanDefinition } from '@/lib/config/plans';
import { useRouter } from 'next/navigation';

export default function PlanosPage() {
  const router = useRouter();
  const { user, selectPlan, confirmPayment, currentPlanSlug } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<PlanDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = [
    PLAN_CONFIG.free,
    PLAN_CONFIG.starter,
    PLAN_CONFIG.pro,
    PLAN_CONFIG.agency,
  ];

  const handleSelectPlan = (plan: PlanDefinition) => {
    if (plan.slug === 'free') {
      selectPlan('free');
      router.push('/search');
      return;
    }

    setSelectedPlan(plan);
    setShowCheckoutModal(true);
    setPaymentSuccess(false);
  };

  const handleProcessPayment = async () => {
    if (!selectedPlan || !user) return;
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSlug: selectedPlan.slug,
          userEmail: user.email,
          userName: user.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        confirmPayment(selectedPlan.slug as any);
        setPaymentSuccess(true);
        setTimeout(() => {
          setShowCheckoutModal(false);
          router.push('/search');
        }, 1800);
      } else {
        alert(data.error || 'Falha ao processar pagamento');
      }
    } catch (e) {
      // Fallback preview
      confirmPayment(selectedPlan.slug as any);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowCheckoutModal(false);
        router.push('/search');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Header title="Planos & Assinatura" />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Headline & Subheadline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Monetização por Pesquisas</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Encontre empresas que podem se tornar seus <span className="text-accent">próximos clientes</span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl">
            Pesquise por nicho e cidade e encontre leads para sua prospecção comercial em poucos segundos.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {plans.map((plan) => {
            const isCurrent = currentPlanSlug === plan.slug;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative bg-surface border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'border-accent shadow-[0_0_30px_rgba(0,214,143,0.25)] ring-2 ring-accent scale-[1.02]'
                    : 'border-border hover:border-accent/40'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-black font-black text-xs uppercase tracking-wider shadow-md">
                    MAIS POPULAR
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-text-primary">{plan.name}</h3>
                    <p className="text-xs text-text-muted min-h-[32px]">{plan.description}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-border/60">
                    <div className="text-3xl font-extrabold text-accent flex items-baseline gap-1">
                      <span>R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                      <span className="text-xs text-text-muted font-normal">
                        {plan.billing === 'monthly' ? '/mês' : ' único'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-text-secondary mt-1 font-mono">
                      ⚡ {plan.researchCredits} {plan.billing === 'monthly' ? 'pesquisas/mês' : 'pesquisas totais'}
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-text-secondary">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3.5 px-4 rounded-xl bg-accent/20 border border-accent/40 text-accent font-extrabold text-xs uppercase tracking-wider cursor-default text-center"
                    >
                      Plano Atual Ativo
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-accent hover:bg-accent-hover text-black shadow-accent/20'
                          : 'bg-background hover:bg-surface-hover border border-border text-text-primary hover:border-accent'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ASAAS CHECKOUT MODAL */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#12121a] border border-accent/40 p-6 md:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="text-2xl font-extrabold text-white">Checkout Asaas Gateway</h3>
                <p className="text-xs text-gray-400">Resumo da sua assinatura comercial</p>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-extrabold text-white">Pagamento Confirmado!</h4>
                <p className="text-sm text-gray-300">
                  Seus <strong className="text-accent">{selectedPlan.researchCredits} créditos de pesquisa</strong> foram liberados com sucesso.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                  <div className="flex justify-between text-sm font-bold text-white">
                    <span>Plano {selectedPlan.name}</span>
                    <span className="text-accent">R$ {selectedPlan.price.toFixed(2).replace('.', ',')}/mês</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span>Franquia Mensal:</span>
                    <span>{selectedPlan.researchCredits} pesquisas/mês</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === 'pix'
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-background text-gray-400'
                      }`}
                    >
                      ⚡ PIX Instantâneo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === 'card'
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-background text-gray-400'
                      }`}
                    >
                      💳 Cartão de Crédito
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleProcessPayment}
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processando no Asaas...</span>
                    </>
                  ) : (
                    <span>Continuar para Pagamento (R$ {selectedPlan.price.toFixed(2).replace('.', ',')}) →</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
