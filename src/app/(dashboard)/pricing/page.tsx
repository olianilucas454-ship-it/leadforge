'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Header } from '@/components/layout/Header';
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Crown,
  ArrowRight,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const { user, selectPlan, confirmPayment, freeSearchesRemaining, isAdmin, isPaidUser } = useAuth();

  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<'pro' | 'vip' | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  const handleChoosePlan = (plan: 'free' | 'pro' | 'vip') => {
    if (plan === 'free') {
      selectPlan('free');
      router.push('/search');
    } else {
      setSelectedPlanForPayment(plan);
      setPaymentStep('select');
    }
  };

  const handleSimulatePayment = () => {
    if (!selectedPlanForPayment) return;
    setPaymentStep('processing');

    setTimeout(() => {
      confirmPayment(selectedPlanForPayment);
      setPaymentStep('success');

      setTimeout(() => {
        setSelectedPlanForPayment(null);
        router.push('/search');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-full flex flex-col bg-background text-text-primary">
      <Header title="Planos & Assinatura" />

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-12">
        {/* Top Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
            <Crown className="w-4 h-4" />
            <span>Assinaturas Flexíveis para Prospecção Comercial</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Escolha o plano ideal para a sua <span className="text-accent">operação de vendas</span>
          </h1>

          <p className="text-text-secondary text-base sm:text-lg">
            Liberte a busca de clientes e alcance resultados comerciais em qualquer cidade do Brasil.
          </p>

          {user && (
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-surface border border-border text-text-secondary">
                Plano Atual: <span className="text-accent uppercase font-black">{user.plan === 'free' ? 'Grátis (5 Pesquisas/Nichos)' : user.plan === 'pro' ? 'Pro R$ 59,90' : 'VIP R$ 99,99'}</span>
                {isAdmin && <span className="ml-2 text-amber-400 font-extrabold">(👑 ADMIN MASTER ILIMITADO)</span>}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* 1. PLANO GRÁTIS */}
          <div className={`bg-surface border rounded-3xl p-8 flex flex-col justify-between space-y-6 relative transition-all ${
            user?.plan === 'free' ? 'border-accent shadow-[0_0_25px_rgba(0,214,143,0.15)]' : 'border-border hover:border-border-hover'
          }`}>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Iniciante</span>
                <h3 className="text-2xl font-black text-text-primary mt-1">Plano Grátis</h3>
                <p className="text-xs text-text-secondary mt-1">Ideal para experimentar o motor de busca</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-text-primary">R$ 0</span>
                <span className="text-xs text-text-muted">/ mês</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-background border border-border space-y-1">
                <div className="text-xs font-bold text-accent">Quota Incluída:</div>
                <div className="text-xs text-text-secondary font-mono">
                  • <strong className="text-text-primary">5 pesquisas de leads</strong><br />
                  • Em <strong className="text-text-primary">5 nichos diferentes</strong><br />
                  • Para <strong className="text-text-primary">qualquer cidade</strong>
                </div>
                <div className="text-[11px] text-accent font-bold pt-1">
                  Saldo Restante: {freeSearchesRemaining} de 5 pesquisas
                </div>
              </div>

              <ul className="space-y-3 text-xs text-text-secondary">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Busca de negócios locais</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Identificação de falta de site</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Qualquer cidade e estado</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoosePlan('free')}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                user?.plan === 'free'
                  ? 'bg-accent/20 text-accent border border-accent/40 cursor-default'
                  : 'bg-background hover:bg-surface-hover text-text-primary border border-border'
              }`}
            >
              {user?.plan === 'free' ? 'Plano Ativo' : 'Usar Grátis'}
            </button>
          </div>

          {/* 2. PLANO PRO (R$ 59,90) */}
          <div className="bg-surface border-2 border-accent rounded-3xl p-8 flex flex-col justify-between space-y-6 relative shadow-[0_0_30px_rgba(0,214,143,0.2)] transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-black font-extrabold text-[11px] uppercase tracking-wider shadow-lg">
              ✨ MAIS POPULAR PARA PROSPECTAR
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">Profissional</span>
                <h3 className="text-2xl font-black text-text-primary mt-1">Plano Pro</h3>
                <p className="text-xs text-text-secondary mt-1">Para quem vende sites e serviços mensalmente</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-accent">R$ 59,90</span>
                <span className="text-xs text-text-muted">/ mês</span>
              </div>

              <ul className="space-y-3.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-text-primary font-semibold">Pesquisas de Leads Ilimitadas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Extração de WhatsApp Direct & Telefone</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Instagram & Redes Sociais do Negócio</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Exportação em CSV & Excel sem limites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>CRM Kanban para Organização de Vendas</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoosePlan('pro')}
              className="w-full py-4 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-accent/25 flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
            >
              <span>ASSINAR PRO POR R$ 59,90</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. PLANO AGÊNCIA VIP (R$ 99,99) */}
          <div className="bg-surface border border-border hover:border-accent/60 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative transition-all">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">Escala Máxima</span>
                <h3 className="text-2xl font-black text-text-primary mt-1">Agência VIP</h3>
                <p className="text-xs text-text-secondary mt-1">Para agências e equipes comerciais exigentes</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-400">R$ 99,99</span>
                <span className="text-xs text-text-muted">/ mês</span>
              </div>

              <ul className="space-y-3.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-text-primary font-semibold">Tudo do Plano Pro Incluído</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Inteligência Comercial & Abordagem IA</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Qualificador Automático de Score de Leads</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Acesso Multi-usuário & CRM Avançado</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Suporte Prioritário 24/7 VIP</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoosePlan('vip')}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
            >
              <span>ASSINAR VIP POR R$ 99,99</span>
              <Crown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Payment Checkout Modal */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedPlanForPayment(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentStep === 'select' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-text-primary">
                    Finalizar Assinatura {selectedPlanForPayment === 'pro' ? 'Pro (R$ 59,90)' : 'Agência VIP (R$ 99,99)'}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Escolha a forma de pagamento para liberar o acesso imediato:
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'pix' ? 'bg-accent/20 border-accent text-accent' : 'bg-background border-border text-text-secondary'
                    }`}
                  >
                    ⚡ PIX (Aprovação Instantânea)
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'card' ? 'bg-accent/20 border-accent text-accent' : 'bg-background border-border text-text-secondary'
                    }`}
                  >
                    💳 Cartão de Crédito
                  </button>
                </div>

                <div className="p-4 bg-background border border-border rounded-xl space-y-3">
                  {paymentMethod === 'pix' ? (
                    <div className="text-center space-y-2">
                      <div className="text-xs font-bold text-accent">Chave PIX Gerada com Sucesso</div>
                      <div className="p-2 bg-surface rounded text-[11px] font-mono text-text-muted truncate select-all">
                        00020126580014BR.GOV.BCB.PIX0136leadforge-pagamentos-key
                      </div>
                      <p className="text-[10px] text-text-muted">Clique em confirmar para concluir a liberação.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Número do Cartão (4532 •••• •••• 8890)"
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Validade (MM/AA)"
                          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSimulatePayment}
                  className="w-full py-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <span>CONFIRMAR PAGAMENTO & LIBERAR ACESSO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin mx-auto" />
                <h4 className="text-base font-bold text-text-primary">Processando Pagamento...</h4>
                <p className="text-xs text-text-muted">Verificando confirmação e ativando seu plano SaaS.</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-accent">Acesso Liberado com Sucesso!</h4>
                <p className="text-xs text-text-secondary">Redirecionando você para o buscador de leads...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
