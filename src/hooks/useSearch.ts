'use client';
import { useState, useEffect } from 'react';
import { Lead } from './useLeads';

export interface SearchParams {
  query?: string;
  niche?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
}

export interface SearchResult {
  total: number;
  noWebsite: number;
  hot: number;
  warm: number;
}

export interface SavedSearch {
  id: string;
  name?: string;
  query?: string;
  params?: SearchParams;
  result?: SearchResult;
  totalFound?: number;
  withoutWebsite?: number;
  hotCount?: number;
  warmCount?: number;
  date: string;
}

export function useSearch() {
  const [searchHistory, setSearchHistory] = useState<SavedSearch[]>([]);
  const [lastResults, setLastResults] = useState<Lead[] | null>(null);

  useEffect(() => {
    const history = localStorage.getItem('leadforge_search_history');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (e) {
        console.error(e);
      }
    }

    const results = localStorage.getItem('leadforge_last_results');
    if (results) {
      try {
        setLastResults(JSON.parse(results));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveSearch = (params: SearchParams, result: SearchResult) => {
    const queryName = params.query || `${params.niche || ''} em ${params.city || ''} - ${params.state || ''}`;
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: queryName,
      query: queryName,
      params,
      result,
      totalFound: result.total,
      withoutWebsite: result.noWebsite,
      hotCount: result.hot,
      warmCount: result.warm,
      date: new Date().toISOString(),
    };

    setSearchHistory(prev => {
      const next = [newSearch, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem('leadforge_search_history', JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('leadforge_search_history');
    setSearchHistory([]);
  };

  const saveResults = (leads: Lead[]) => {
    setLastResults(leads);
    localStorage.setItem('leadforge_last_results', JSON.stringify(leads));
  };

  const getSearchHistory = () => searchHistory;
  const getLastResults = () => lastResults;

  return { saveSearch, searchHistory, getSearchHistory, lastResults, getLastResults, saveResults, clearHistory };
}
