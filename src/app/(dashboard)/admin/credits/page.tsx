'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, Minus, Search, User, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/context/AuthContext';

interface AdjustmentLog {
  id: string;
  adminEmail: string;
  targetEmail: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export default function AdminCreditsPage() {
  const { user, isAdmin } = useAuth();
  
  const [targetEmail, setTargetEmail] = useState('');
  const [amount, setAmount] = useState<number>(50);
  const [reason, setReason] = useState('Bônus comercial');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [logs, setLogs] = useState<AdjustmentLog[]>([
    {
      id: 'log_1',
      adminEmail: 'olianilucas454@gmail.com',
      targetEmail: 'cliente_demo@empresa.com',
      amount: 100,
      reason: 'Bônus de renovação contratual',
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail || !amount) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: user?.email || 'olianilucas454@gmail.com',
          targetEmail,
          amount: Number(amount),
          reason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const newLog: AdjustmentLog = {
          id: `log_${Date.now()}`,
          adminEmail: user?.email || 'olianilucas454@gmail.com',
          targetEmail,
          amount: Number(amount),
          reason,
          timestamp: new Date().toISOString(),
        };
        setLogs([newLog, ...logs]);
        setMessage(`Créditos ajustados com sucesso para ${targetEmail}! (${amount > 0 ? '+' : ''}${amount} pesquisas)`);
        setTargetEmail('');
      } else {
        setMessage(data.error || 'Falha ao ajustar créditos');
      }
    } catch (e: any) {
      setMessage('Erro na requisição ao servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-transparent text-text-primary p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-400">Acesso Negado</h1>
        <p className="text-gray-400">Apenas o Administrador da plataforma possui acesso a esta ferramenta.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col">
      <Header title="Gestão de Créditos Admin Master" />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <span>Gestão de Créditos</span>
              <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase font-mono">
                ADMIN MASTER
              </span>
            </h1>
            <p className="text-gray-400 text-sm">Adicione ou remova pesquisas manualmente com log auditável de ADMIN_ADJUSTMENT.</p>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Adjustment Form */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span>Ajuste Manual de Pesquisas</span>
          </h2>

          <form onSubmit={handleAdjust} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">E-mail do Usuário Afetado</label>
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="cliente@empresa.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Quantidade (+ ou -)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Ex: 50 ou -10"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Motivo do Ajuste</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Bônus comercial, estorno manual..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-accent hover:bg-accent-hover text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                {loading ? 'Processando Ajuste...' : 'Aplicar Ajuste de Crédito (ADMIN_ADJUSTMENT)'}
              </button>
            </div>
          </form>
        </div>

        {/* Audit Log Table */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Histórico Auditável de Ajustes</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-gray-400">
                  <th className="p-3">Data/Hora</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Usuário Afetado</th>
                  <th className="p-3">Quantidade</th>
                  <th className="p-3">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-gray-300">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                    <td className="p-3 text-amber-400">{log.adminEmail}</td>
                    <td className="p-3 text-white font-bold">{log.targetEmail}</td>
                    <td className={`p-3 font-bold ${log.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {log.amount > 0 ? `+${log.amount}` : log.amount}
                    </td>
                    <td className="p-3 text-gray-400">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
