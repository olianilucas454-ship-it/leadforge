'use client';

import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { useCRM } from '@/hooks/useCRM';
import { LayoutDashboard } from 'lucide-react';

export default function CRMPage() {
  const { stages, leads, isLoaded, moveLead } = useCRM();

  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.crmStageId === 'ganho').length;

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-[#0a0a0f] text-[#f0f0f5]">
        <p>Carregando CRM...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0f] text-[#f0f0f5]">
      <header className="flex items-center justify-between border-b border-[#2a2a3e] bg-[#12121a] px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00d68f]/10 text-[#00d68f]">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Pipeline de Vendas</h1>
            <p className="text-sm text-[#f0f0f5]/60">Gerencie seus leads e oportunidades</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#f0f0f5]/60">Total de Leads</span>
            <span className="text-lg font-semibold">{totalLeads}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#f0f0f5]/60">Ganhos</span>
            <span className="text-lg font-semibold text-[#00d68f]">{wonLeads}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6">
        <KanbanBoard
          stages={stages}
          initialLeads={leads}
          onLeadMove={(leadId, newStageId, newPosition) => {
            moveLead(leadId, newStageId, newPosition);
          }}
        />
      </main>
    </div>
  );
}
