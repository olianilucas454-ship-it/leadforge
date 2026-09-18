'use client';

// LeadForge SaaS Official Portal - Updated 2026
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Logo } from '@/components/layout/Logo';
import {
  ShieldCheck,
  Search,
  Kanban,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register, verifyEmailOtp, sendEmailVerificationOtp, isAuthenticated, isAdmin } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // OTP Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // If already authenticated and verified, redirect automatically
  useEffect(() => {
    if (isAuthenticated && user?.isEmailVerified) {
      if (isAdmin || user?.isPaidUser) {
        router.push('/search');
      } else {
        router.push('/planos');
      }
    }
  }, [isAuthenticated, isAdmin, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegisterMode) {
      const res = register(name, email, password);
      if (res.success) {
        if (res.requiresVerification) {
          setSimulatedOtp(res.otpCode || null);
          setShowOtpModal(true);
        } else {
          router.push('/planos');
        }
      } else {
        setErrorMsg(res.message || 'Erro ao realizar cadastro.');
      }
    } else {
      const res = login(email, password);
      if (res.success) {
        router.push('/search');
      } else if (res.requiresVerification) {
        setSimulatedOtp(res.otpCode || null);
        setShowOtpModal(true);
      } else {
        setErrorMsg(res.message || 'Falha no acesso. Verifique suas credenciais.');
      }
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    const res = verifyEmailOtp(email, otpCode);
    if (res.success) {
      setShowOtpModal(false);
      router.push('/planos');
    } else {
      setOtpError(res.message || 'Código de verificação incorreto.');
    }
  };

  const handleResendOtp = () => {
    const res = sendEmailVerificationOtp(email);
    if (res.success && res.otpCode) {
      setSimulatedOtp(res.otpCode);
      setOtpError(null);
      alert(`Novo código enviado para ${email}: ${res.otpCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col justify-between selection:bg-accent selection:text-black relative overflow-hidden">
      {/* Background Image Layer with leadforge-bg.jpg */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/leadforge-bg.jpg')" }}
      />
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60" />
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
      
      {/* Header Bar */}
      <header className="relative z-10 border-b border-border/80 bg-surface/70 backdrop-blur-md px-6 md:px-12 h-16 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg(null);
            }}
            className="text-xs font-bold text-text-secondary hover:text-accent transition-colors"
          >
            {isRegisterMode ? 'Já possui conta? Entrar' : 'Criar Conta Grátis'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: SaaS Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Plataforma Comercial de Prospecção B2B</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
              Encontre negócios que <span className="text-accent">precisam de sites</span> hoje.
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
              O LeadForge varre cidades inteiras, identifica empresas locais sem presença digital ou desatualizadas, extrai dados de contato e entrega a você um CRM de vendas completo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-accent">
                  <Search className="w-4 h-4" />
                  <span>Busca de Leads em 1-Clique</span>
                </div>
                <p className="text-xs text-text-muted">Filtre por qualquer cidade e nicho de mercado.</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-accent">
                  <Kanban className="w-4 h-4" />
                  <span>CRM Kanban Integrado</span>
                </div>
                <p className="text-xs text-text-muted">Gerencie o pipeline do primeiro contato à venda.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs text-text-muted font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                3 pesquisas gratuitas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Sem cartão de crédito
              </span>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6">
            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-extrabold text-text-primary">
                  {isRegisterMode ? 'Criar Nova Conta no LeadForge' : 'Acessar o LeadForge'}
                </h2>
                <p className="text-xs text-text-secondary">
                  {isRegisterMode
                    ? 'Preencha seus dados para iniciar seu teste com 3 pesquisas grátis'
                    : 'Entre com suas credenciais cadastradas para acessar a plataforma'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Seu Nome"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">
                    Seu E-mail de Acesso
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@empresa.com"
                      className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-xs text-text-primary focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">
                    Sua Senha
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-xs text-text-primary focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-accent/10 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                >
                  <span>{isRegisterMode ? 'VERIFICAR E-MAIL & CRIAR CONTA' : 'ENTRAR NO PAINEL AGORA'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Email Verification OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-surface border border-accent/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 text-accent mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Autenticação de E-mail</h3>
              <p className="text-xs text-text-secondary">
                Enviamos um código de verificação de 6 dígitos para <span className="text-accent font-bold">{email}</span>.
              </p>
            </div>

            {simulatedOtp && (
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-mono text-center space-y-1">
                <span className="block text-[10px] uppercase font-bold text-text-muted">Simulação de Envio de E-mail (Código de Teste):</span>
                <span className="text-lg font-black tracking-widest text-white">{simulatedOtp}</span>
              </div>
            )}

            {otpError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider text-center">
                  Digite o Código de 6 Dígitos
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full bg-background border border-accent/50 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white focus:border-accent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>CONFIRMAR E-MAIL & CONCLUIR CADASTRAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full text-xs text-text-muted hover:text-accent flex items-center justify-center gap-1.5 transition-colors pt-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reenviar código de verificação</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/80 bg-surface/50 backdrop-blur-md py-6 px-6 text-center text-xs text-text-muted font-mono">
        © {new Date().getFullYear()} LeadForge. Todos os direitos reservados.
      </footer>
    </div>
  );
}
