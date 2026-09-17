'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Zap,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Search,
  Kanban
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register, isAuthenticated, isAdmin } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already authenticated, redirect automatically
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin || user?.isPaidUser) {
        router.push('/search');
      } else {
        router.push('/pricing');
      }
    }
  }, [isAuthenticated, isAdmin, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegisterMode) {
      const res = register(name, email, password);
      if (res.success) {
        router.push('/pricing');
      } else {
        setErrorMsg(res.message || 'Erro ao realizar cadastro.');
      }
    } else {
      const res = login(email, password);
      if (res.success) {
        router.push('/search');
      } else {
        setErrorMsg(res.message || 'Falha no acesso. Verifique suas credenciais.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-sm">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            LEAD<span className="text-amber-400">FORGE</span>
          </span>
          <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            PROSPECTING SAAS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors"
          >
            {isRegisterMode ? 'Já possui conta? Entrar' : 'Criar Conta Grátis'}
          </button>
        </div>
      </header>

      {/* Main Form Center Shell */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: SaaS Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Plataforma Comercial de Prospecção B2B</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Encontre clientes que <span className="text-amber-400">precisam de vendas</span> hoje.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
              O LeadForge varre cidades inteiras, identifica empresas locais sem presença digital ou desatualizadas, extrai dados de contato e entrega a você um CRM de vendas completo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Search className="w-4 h-4" />
                  <span>Busca de Leads em 1-Clique</span>
                </div>
                <p className="text-xs text-slate-400">Filtre por qualquer cidade e nicho de mercado.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Kanban className="w-4 h-4" />
                  <span>CRM Kanban Integrado</span>
                </div>
                <p className="text-xs text-slate-400">Gerencie o pipeline do primeiro contato à venda.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-black text-white">
                  {isRegisterMode ? 'Criar Nova Conta no LeadForge' : 'Acessar o LeadForge SaaS'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isRegisterMode
                    ? 'Preencha seus dados para iniciar seu teste com 5 pesquisas grátis'
                    : 'Entre com suas credenciais de acesso para entrar na plataforma'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                      Seu Nome Completo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Seu Nome"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Seu E-mail de Acesso
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@empresa.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Sua Senha
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
                >
                  <span>{isRegisterMode ? 'CRIAR CONTA & ESCOLHER PLANO' : 'ENTRAR NO PAINEL AGORA'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} LeadForge Prospecting SaaS Engine. Todos os direitos reservados.
      </footer>
    </div>
  );
}
