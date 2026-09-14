'use client';

import { LeadClassification } from '@/lib/types/lead';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import { Globe, AlertTriangle, MessageCircle, Phone, Star, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export type FiltersState = {
  classification: 'all' | 'hot' | 'warm' | 'cold';
  noWebsite: boolean;
  hasWebsite: boolean;
  badWebsite: boolean;
  hasWhatsapp: boolean;
  hasPhone: boolean;
  highRating: boolean;
  sortBy: string;
};

interface LeadFiltersProps {
  filters: FiltersState;
  counts: { total: number; hot: number; warm: number; cold: number };
  onChange: (filters: FiltersState) => void;
}

export function LeadFilters({ filters, counts, onChange }: LeadFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClassificationChange = (classification: FiltersState['classification']) => {
    onChange({ ...filters, classification });
  };

  const toggleFilter = (key: keyof Omit<FiltersState, 'classification' | 'sortBy'>) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
      {/* Classification Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filters.classification === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleClassificationChange('all')}
          className="rounded-full"
        >
          Todos ({counts.total})
        </Button>
        <Button
          variant={filters.classification === 'hot' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleClassificationChange('hot')}
          className={cn("rounded-full", filters.classification !== 'hot' && "border-hot/30 text-hot hover:bg-hot/10")}
        >
          🔥 Hot ({counts.hot})
        </Button>
        <Button
          variant={filters.classification === 'warm' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleClassificationChange('warm')}
          className={cn("rounded-full", filters.classification !== 'warm' && "border-warm/30 text-warm hover:bg-warm/10")}
        >
          🟠 Warm ({counts.warm})
        </Button>
        <Button
          variant={filters.classification === 'cold' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleClassificationChange('cold')}
          className={cn("rounded-full", filters.classification !== 'cold' && "border-cold/30 text-cold hover:bg-cold/10")}
        >
          🟢 Cold ({counts.cold})
        </Button>
        <div className="ml-auto sm:hidden">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setIsOpen(!isOpen)}>
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className={cn("space-y-4", !isOpen && "hidden sm:block")}>
        {/* Toggle Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="default"
            className={cn(
              "cursor-pointer select-none py-1.5 px-3 transition-all",
              filters.noWebsite ? "bg-accent text-black font-semibold border-accent" : "bg-surface-hover text-text-secondary border-border hover:border-accent/40"
            )}
            onClick={() => toggleFilter('noWebsite')}
          >
            <Globe className="h-4 w-4 mr-1.5 opacity-70" />
            <span className="relative">
              Sem site
              <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-current -rotate-45 transform -translate-y-1/2"></span>
            </span>
          </Badge>

          <Badge
            variant="default"
            className={cn(
              "cursor-pointer select-none py-1.5 px-3 transition-all",
              filters.hasWebsite ? "bg-accent text-black font-semibold border-accent" : "bg-surface-hover text-text-secondary border-border hover:border-accent/40"
            )}
            onClick={() => toggleFilter('hasWebsite')}
          >
            <Globe className="h-4 w-4 mr-1.5" />
            Com site
          </Badge>

          <Badge
            variant="default"
            className={cn(
              "cursor-pointer select-none py-1.5 px-3 transition-all",
              filters.badWebsite ? "bg-hot text-white font-semibold border-hot" : "bg-surface-hover text-text-secondary border-border hover:border-hot/40"
            )}
            onClick={() => toggleFilter('badWebsite')}
          >
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            Site ruim
          </Badge>

          <Badge
            variant="default"
            className={cn(
              "cursor-pointer select-none py-1.5 px-3 transition-all",
              filters.hasWhatsapp ? "bg-[#25D366] text-black font-semibold border-[#25D366]" : "bg-surface-hover text-text-secondary border-border hover:border-[#25D366]/40"
            )}
            onClick={() => toggleFilter('hasWhatsapp')}
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            WhatsApp
          </Badge>

          <Badge
            variant="default"
            className={cn(
              "cursor-pointer select-none py-1.5 px-3 transition-all",
              filters.hasPhone ? "bg-accent text-black font-semibold border-accent" : "bg-surface-hover text-text-secondary border-border hover:border-accent/40"
            )}
            onClick={() => toggleFilter('hasPhone')}
          >
            <Phone className="h-4 w-4 mr-1.5" />
            Telefone
          </Badge>

          <Badge
            variant="default"
            className={cn(
              "cursor-pointer select-none py-1.5 px-3 transition-all",
              filters.highRating ? "bg-yellow-500 text-black font-semibold border-yellow-500" : "bg-surface-hover text-text-secondary border-border hover:border-yellow-500/40"
            )}
            onClick={() => toggleFilter('highRating')}
          >
            <Star className="h-4 w-4 mr-1.5 text-yellow-500" />
            Alta avaliação
          </Badge>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary shrink-0">Ordenar por:</span>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="bg-surface-hover border border-border rounded-lg text-sm px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="opportunity_desc">Maior oportunidade</option>
            <option value="rating_desc">Maior avaliação</option>
            <option value="reviews_desc">Mais avaliações</option>
            <option value="score_desc">Score</option>
            <option value="no_website_first">Sem website primeiro</option>
          </select>
        </div>
      </div>
    </div>
  );
}
