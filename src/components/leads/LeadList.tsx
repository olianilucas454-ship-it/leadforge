'use client';

import { Lead } from '@/lib/types/lead';
import { LeadCard } from './LeadCard';
import { Button } from '@/components/ui/Button';
import { SearchX } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface LeadListProps {
  leads: Lead[];
  loading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onAddToCRM?: (id: string) => void;
}

export function LeadList({ leads, loading, onLoadMore, hasMore, onFavoriteToggle, onAddToCRM }: LeadListProps) {
  if (!loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-surface p-4 rounded-full mb-4 border border-border">
          <SearchX className="h-10 w-10 text-text-secondary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhum lead encontrado</h3>
        <p className="text-text-secondary max-w-md">
          Tente ajustar seus filtros ou faça uma nova busca com parâmetros diferentes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onFavoriteToggle={onFavoriteToggle}
            onAddToCRM={onAddToCRM}
          />
        ))}
        
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="bg-surface border border-border rounded-lg p-4 h-[280px] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <div className="space-y-3 flex-grow">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </div>
        ))}
      </div>

      {!loading && hasMore && onLoadMore && (
        <div className="flex justify-center pt-6">
          <Button variant="secondary" onClick={onLoadMore} className="w-full sm:w-auto min-w-[200px]">
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  );
}
