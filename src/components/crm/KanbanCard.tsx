'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@/lib/types/crm';
import { Phone } from 'lucide-react';

interface KanbanCardProps {
  lead: Lead;
  isOverlay?: boolean;
}

export function KanbanCard({ lead, isOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'Lead',
      lead,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[100px] w-full rounded-lg border-2 border-dashed border-border bg-surface/20 opacity-30"
      />
    );
  }

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      {...attributes}
      {...listeners}
      className={`relative flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 text-sm shadow-sm cursor-grab active:cursor-grabbing hover:border-accent/50 transition-colors ${
        isOverlay ? 'rotate-2 scale-105 shadow-xl ring-1 ring-accent' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-text">{lead.name}</span>
        <span
          className={`flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
            lead.score >= 80
              ? 'bg-green-500/10 text-green-500'
              : lead.score >= 50
              ? 'bg-yellow-500/10 text-yellow-500'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          {lead.score}
        </span>
      </div>

      <div className="text-xs text-text/60">{lead.category}</div>

      <div className="mt-1 flex items-center gap-1.5 text-xs text-text/80">
        <Phone className="h-3.5 w-3.5" />
        <span>{lead.phone}</span>
      </div>
    </div>
  );
}
