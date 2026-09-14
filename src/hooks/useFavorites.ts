'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/types/lead';
import { useLeads } from './useLeads';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Lead[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { allLeads, getLeadById } = useLeads();

  useEffect(() => {
    const stored = localStorage.getItem('leadforge_favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        setFavoriteIds(parsed.map((l: Lead) => l.id));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const toggleFavorite = (leadId: string) => {
    setFavorites(prev => {
      const exists = prev.some(l => l.id === leadId);
      let nextFavorites: Lead[];

      if (exists) {
        nextFavorites = prev.filter(l => l.id !== leadId);
      } else {
        const leadToAdd = prev.find(l => l.id === leadId) || getLeadById(leadId) || allLeads.find(l => l.id === leadId);
        if (!leadToAdd) {
          console.warn('Lead not found to add to favorites:', leadId);
          return prev;
        }
        nextFavorites = [...prev, { ...leadToAdd, isFavorite: true }];
      }

      localStorage.setItem('leadforge_favorites', JSON.stringify(nextFavorites));
      setFavoriteIds(nextFavorites.map(l => l.id));
      return nextFavorites;
    });
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const getFavorites = () => favorites;

  return { toggleFavorite, isFavorite, favorites, favoriteIds, getFavorites };
}
