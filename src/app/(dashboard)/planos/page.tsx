'use client';

import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, Sparkles, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/context/AuthContext';
import { PLAN_CONFIG, PlanDefinition } from '@/lib/config/plans';
import { useRouter } from 'next/navigation';

export default function PlanosPage() {
  const router = useRouter();
  const { user, selectPlan, confirmPayment, currentPlanSlug } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<PlanDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('card');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

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
    setCheckoutUrl(null);
    setShowCheckoutModal(true);
  };

  const [customApiKey, setCustomApiKey] = useState('');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const handleProcessPayment = async () => {
    if (!selectedPlan || !user) return;
    setLoading(true);
    setApiKeyError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSlug: selectedPlan.slug,
          userEmail: user.email,
          apiKey: customApiKey.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        // Rule 4: Redirect directly to the REAL Asaas hosted checkout URL
        window.location.href = data.checkoutUrl;
      } else if (data.error === 'MISSING_API_KEY') {
        setApiKeyError(data.message || 'Chave do Asaas (ASAAS_API_KEY) pendente. Insira sua chave $aact_... abaixo.');
      } else {
        alert(data.error || 'Não foi possível criar o checkout de pagamento.');
      }
    } catch (e: any) {
      alert('Não foi possível criar o checkout de pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col">
      <Header title="Planos & Assinatura" />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Headline & Subheadline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Monetização por Pesquisas</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Encontre negócios que <span className="text-accent">precisam de sites</span>
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
                <h3 className="text-2xl font-extrabold text-white">Checkout Oficial Asaas Gateway</h3>
                <p className="text-xs text-gray-400">Cartão de Crédito ou PIX Instantâneo</p>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

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
                Forma de Pagamento Aceita
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-accent bg-accent/10 text-accent text-xs font-bold text-center">
                  💳 Cartão de Crédito
                </div>
                <div className="p-3 rounded-xl border border-accent bg-accent/10 text-accent text-xs font-bold text-center">
                  ⚡ PIX QR Code
                </div>
              </div>
            </div>

            {apiKeyError && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs space-y-3">
                <div className="font-extrabold flex items-center gap-2 text-amber-400">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Configuração de API Key Asaas Pendente</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Para gerar faturas e pagamentos reais no Asaas Sandbox, insira sua chave de API (<code className="text-amber-300">$aact_...</code>) gerada em <a href="https://sandbox.asaas.com" target="_blank" rel="noreferrer" className="underline font-bold text-accent">sandbox.asaas.com</a> no arquivo <code className="text-white bg-black/40 px-1 py-0.5 rounded">.env.local</code> ou cole-a abaixo:
                </p>
                <div className="space-y-1.5">
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="Cole sua ASAAS_API_KEY ($aact_...)"
                    className="w-full px-3 py-2 bg-black/60 border border-amber-500/40 rounded-xl text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}

            {checkoutUrl ? (
              <div className="space-y-3 pt-2">
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Abrir Tela de Pagamento Asaas</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <button
                onClick={handleProcessPayment}
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gerando Checkout Asaas...</span>
                  </>
                ) : (
                  <span>Ir para o Checkout de Pagamento (R$ {selectedPlan.price.toFixed(2).replace('.', ',')}) →</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
