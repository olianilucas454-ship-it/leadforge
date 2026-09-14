'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Lead, CRMStage } from '@/lib/types/crm';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  stages: CRMStage[];
  initialLeads: Lead[];
  onLeadMove: (leadId: string, newStageId: string, newPosition: number) => void;
}

export function KanbanBoard({ stages, initialLeads, onLeadMove }: KanbanBoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Sync leads from props if they change
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { data } = active;
    if (data.current?.type === 'Lead') {
      setActiveLead(data.current.lead);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveLead = active.data.current?.type === 'Lead';
    const isOverLead = over.data.current?.type === 'Lead';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveLead) return;

    // Dropping a lead over another lead
    if (isActiveLead && isOverLead) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((t) => t.id === activeId);
        const overIndex = leads.findIndex((t) => t.id === overId);

        if (leads[activeIndex].crmStageId !== leads[overIndex].crmStageId) {
          const updated = [...leads];
          updated[activeIndex] = {
            ...updated[activeIndex],
            crmStageId: leads[overIndex].crmStageId,
          };
          return arrayMove(updated, activeIndex, overIndex);
        }

        return arrayMove(leads, activeIndex, overIndex);
      });
    }

    // Dropping a lead over an empty column
    if (isActiveLead && isOverColumn) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((t) => t.id === activeId);
        const updated = [...leads];
        updated[activeIndex] = {
          ...updated[activeIndex],
          crmStageId: overId as string,
        };
        return arrayMove(updated, activeIndex, activeIndex); // Just change column, keep position at bottom for now
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      const activeIndex = leads.findIndex((t) => t.id === activeId);
      const activeLead = leads[activeIndex];
      // Propagate the save
      onLeadMove(activeLead.id, activeLead.crmStageId, activeIndex); // Position logic might need refinement in a real app (fractional ordering)
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = leads
            .filter((l) => l.crmStageId === stage.id)
            .sort((a, b) => {
              // Internal order is mostly handled by arrayMove now, but fallback to position
              return 0;
            });

          return (
            <KanbanColumn key={stage.id} stage={stage} leads={stageLeads} />
          );
        })}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeLead ? <KanbanCard lead={activeLead} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
