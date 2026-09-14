'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMStage, Lead } from '@/lib/types/crm';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  stage: CRMStage;
  leads: Lead[];
}

export function KanbanColumn({ stage, leads }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
    data: {
      type: 'Column',
      stage,
    },
  });

  const leadIds = leads.map((l) => l.id);

  const stageColorClass = stage.color.split(' ')[0]; // Gets the bg color part

  return (
    <div className="flex h-full min-w-[280px] flex-col rounded-xl border border-border bg-surface/50 overflow-hidden">
      {/* Column Header */}
      <div className={`h-1 w-full ${stageColorClass}`} />
      <div className="flex items-center justify-between border-b border-border p-3">
        <h3 className="font-semibold text-text">{stage.name}</h3>
        <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-surface-light px-2 text-xs font-medium text-text/70">
          {leads.length}
        </span>
      </div>

      {/* Column Content Area */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-3 min-h-[150px]"
      >
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
