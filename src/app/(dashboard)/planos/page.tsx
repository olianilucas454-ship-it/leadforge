'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/context/AuthContext';
import { PLAN_CONFIG, PlanDefinition } from '@/lib/config/plans';
import { useRouter } from 'next/navigation';

export default function PlanosPage() {
  const router = useRouter();
  const { user, selectPlan, currentPlanSlug } = useAuth();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const plans = [
    PLAN_CONFIG.free,
    PLAN_CONFIG.starter,
    PLAN_CONFIG.pro,
    PLAN_CONFIG.agency,
  ];

  const handleSelectPlan = async (plan: PlanDefinition) => {
    if (plan.slug === 'free') {
      selectPlan('free');
      router.push('/search');
      return;
    }

    if (!user) {
      router.push('/');
      return;
    }

    setLoadingSlug(plan.slug);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSlug: plan.slug,
          userEmail: user.email,
        }),
      });

      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        // Direct redirect to Asaas hosted checkout URL (No intermediate modals!)
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Não foi possível gerar o checkout de pagamento. Tente novamente.');
      }
    } catch (e: any) {
      alert('Não foi possível conectar ao servidor para gerar o pagamento.');
    } finally {
      setLoadingSlug(null);
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
            const isLoadingThis = loadingSlug === plan.slug;

            return (
              <div
                key={plan.id}
                className={`relative bg-surface/80 backdrop-blur-md border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'border-accent shadow-[0_0_30px_rgba(0,214,143,0.25)] ring-2 ring-accent scale-[1.02]'
                    : 'border-border/80 hover:border-accent/40'
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

                  <div className="p-4 rounded-2xl bg-background/60 border border-border/60">
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
                      disabled={loadingSlug !== null}
                      className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-accent hover:bg-accent-hover text-black shadow-accent/20'
                          : 'bg-background hover:bg-surface-hover border border-border text-text-primary hover:border-accent'
                      }`}
                    >
                      {isLoadingThis ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Redirecionando...</span>
                        </>
                      ) : (
                        <>
                          <span>{plan.ctaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
