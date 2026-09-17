'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BillingSuccessPage() {
  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface/80 backdrop-blur-md border border-accent/40 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Pedido Registrado no Asaas</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Seu formulário de pagamento foi processado. Assim que a confirmação do pagamento (Pix ou Cartão) for enviada pelo Asaas via Webhook, seus créditos serão ativados automaticamente.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 text-xs text-accent flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Confirmação segura via Webhook Asaas (Rule 8)</span>
        </div>

        <div className="pt-2">
          <Link
            href="/search"
            className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Voltar ao Painel de Busca</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
