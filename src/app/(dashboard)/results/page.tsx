'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lead } from '@/lib/types/lead';
import { LeadFilters, FiltersState } from '@/components/leads/LeadFilters';
import { LeadList } from '@/components/leads/LeadList';
import { useCRM } from '@/hooks/useCRM';
import { Search, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ResultsPage() {
  const router = useRouter();
  const { addLead } = useCRM();
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [displayedLeads, setDisplayedLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInfo, setSearchInfo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<FiltersState>({
    classification: 'all',
    noWebsite: false,
    hasWebsite: false,
    badWebsite: false,
    hasWhatsapp: false,
    hasPhone: false,
    highRating: false,
    sortBy: 'opportunity_desc',
  });

  const [counts, setCounts] = useState({ total: 0, hot: 0, warm: 0, cold: 0 });

  useEffect(() => {
    // Load search query info
    try {
      const storedSearch = localStorage.getItem('leadforge_latest_search');
      if (storedSearch) {
        const parsed = JSON.parse(storedSearch);
        if (parsed.params?.niche) {
          setSearchInfo(`${parsed.params.niche} em ${parsed.params.city} - ${parsed.params.state}`);
        }
      }
    } catch {}

    // Load leads from localStorage
    const storedLeads = localStorage.getItem('leadforge_search_results');
    if (storedLeads) {
      try {
        const parsedLeads = JSON.parse(storedLeads);
        setAllLeads(parsedLeads);
        
        // Calculate counts
        const t = parsedLeads.length;
        const h = parsedLeads.filter((l: Lead) => l.classification === 'hot').length;
        const w = parsedLeads.filter((l: Lead) => l.classification === 'warm').length;
        const c = parsedLeads.filter((l: Lead) => l.classification === 'cold').length;
        setCounts({ total: t, hot: h, warm: w, cold: c });
      } catch (e) {
        console.error('Failed to parse leads', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = [...allLeads];

    // Apply Classification
    if (filters.classification !== 'all') {
      result = result.filter(l => l.classification === filters.classification);
    }

    // Apply Toggles
    if (filters.noWebsite) {
      result = result.filter(l => !l.digitalPresence.hasWebsite);
    }
    if (filters.hasWebsite) {
      result = result.filter(l => l.digitalPresence.hasWebsite);
    }
    if (filters.badWebsite) {
      result = result.filter(l => l.websiteAnalysis && l.websiteAnalysis.overallQuality < 60);
    }
    if (filters.hasWhatsapp) {
      result = result.filter(l => !!l.whatsapp);
    }
    if (filters.hasPhone) {
      result = result.filter(l => !!l.phone);
    }
    if (filters.highRating) {
      result = result.filter(l => l.rating && l.rating >= 4.0);
    }

    // Apply Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'opportunity_desc':
          return (b.websiteOpportunityScore || 0) - (a.websiteOpportunityScore || 0);
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews_desc':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'score_desc':
          return (b.websiteOpportunityScore || 0) - (a.websiteOpportunityScore || 0);
        case 'no_website_first':
          if (!a.digitalPresence.hasWebsite && b.digitalPresence.hasWebsite) return -1;
          if (a.digitalPresence.hasWebsite && !b.digitalPresence.hasWebsite) return 1;
          return (b.websiteOpportunityScore || 0) - (a.websiteOpportunityScore || 0);
        default:
          return 0;
      }
    });

    setFilteredLeads(result);
    setPage(1);
    setDisplayedLeads(result.slice(0, itemsPerPage));
  }, [allLeads, filters]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setDisplayedLeads(filteredLeads.slice(0, nextPage * itemsPerPage));
  };

  const handleFavoriteToggle = (id: string, isFavorite: boolean) => {
    const updatedLeads = allLeads.map(l => l.id === id ? { ...l, isFavorite } : l);
    setAllLeads(updatedLeads);
    localStorage.setItem('leadforge_search_results', JSON.stringify(updatedLeads));
  };

  const handleAddToCRM = (id: string) => {
    const lead = allLeads.find(l => l.id === id);
    if (lead) {
      addLead(lead);
      setToastMessage(`"${lead.name}" adicionado ao CRM!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-accent text-black font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-3">
            <span>{filteredLeads.length} leads encontrados</span>
            {searchInfo && (
              <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
                {searchInfo}
              </span>
            )}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Empresas ordenadas por potencial comercial para venda de websites
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => router.push('/search')}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Nova Pesquisa
          </Button>
        </div>
      </div>

      {allLeads.length > 0 ? (
        <>
          <LeadFilters 
            filters={filters} 
            counts={counts} 
            onChange={setFilters} 
          />

          <LeadList 
            leads={displayedLeads} 
            loading={loading} 
            onLoadMore={handleLoadMore}
            hasMore={displayedLeads.length < filteredLeads.length}
            onFavoriteToggle={handleFavoriteToggle}
            onAddToCRM={handleAddToCRM}
          />
        </>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center my-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Nenhum resultado na pesquisa atual</h3>
          <p className="text-text-secondary max-w-md mb-6 text-sm">
            Faça uma busca por nicho e localização para encontrar empresas reais analisadas por inteligência comercial.
          </p>
          <Button 
            variant="primary"
            size="lg"
            onClick={() => router.push('/search')}
            className="flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Começar Nova Busca
          </Button>
        </div>
      )}
    </div>
  );
}
