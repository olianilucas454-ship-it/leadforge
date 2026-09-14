'use client';

import { useState, useEffect } from 'react';
import { CRMStage, DEFAULT_PIPELINE } from '@/lib/types/crm';
import { Lead as FullLead } from '@/lib/types/lead';

export interface CRMLead {
  id: string;
  name: string;
  score: number;
  category: string;
  phone: string;
  crmStageId: string;
  position: number;
}

export function useCRM() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('crm_leads');
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse CRM leads', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    }
  }, [leads, isLoaded]);

  const addLead = (lead: FullLead | CRMLead | any) => {
    setLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) {
        return prev; // already in CRM
      }
      const newStageLeads = prev.filter((l) => l.crmStageId === 'novo');
      const position = newStageLeads.length;
      
      const newCrmLead: CRMLead = {
        id: lead.id,
        name: lead.name,
        score: lead.websiteOpportunityScore ?? lead.score ?? 50,
        category: lead.category || 'Geral',
        phone: lead.whatsapp || lead.phone || 'Não informado',
        crmStageId: 'novo',
        position,
      };

      return [...prev, newCrmLead];
    });
  };

  const moveLead = (leadId: string, newStageId: string, position: number) => {
    setLeads((prev) => {
      const updated = prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, crmStageId: newStageId, position };
        }
        return l;
      });
      return updated;
    });
  };

  const getLeadsByStage = (stageId: string) => {
    return leads
      .filter((l) => l.crmStageId === stageId)
      .sort((a, b) => a.position - b.position);
  };

  const getAllCRMLeads = () => leads;

  const removeLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  return {
    stages: DEFAULT_PIPELINE,
    leads,
    isLoaded,
    addLead,
    moveLead,
    getLeadsByStage,
    getAllCRMLeads,
    removeLead,
  };
}
