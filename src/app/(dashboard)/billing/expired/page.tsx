'use client';

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BillingExpiredPage() {
  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface/80 backdrop-blur-md border border-amber-500/40 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
          <Clock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Link Expirado</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            O tempo limite para concluir o checkout no Asaas expirou. Gere um novo link de pagamento para continuar.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/planos"
            className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Gerar Novo Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
