'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lead } from '@/lib/types/lead';

export function useLeads() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('leadforge_search_results') || localStorage.getItem('leadforge_last_results');
    if (stored) {
      try {
        setAllLeads(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse leads from localStorage', e);
      }
    }
  }, []);

  const getLeadById = useCallback((id: string) => {
    return allLeads.find(l => l.id === id) || null;
  }, [allLeads]);

  return { getLeadById, allLeads };
}

export type { Lead };
