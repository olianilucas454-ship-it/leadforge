'use client';

import { useState } from 'react';
import { Search, MapPin, Target, ChevronRight } from 'lucide-react';
import { SearchProgress } from '@/components/search/SearchProgress';
import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';

const NICHES = [
  'Barbearias', 'Restaurantes', 'Clínicas', 'Academias',
  'Salões', 'Oficinas', 'Pizzarias', 'Imobiliárias',
  'Veterinárias', 'Advocacia', 'Padarias', 'Hotéis'
];

const RADIUS_OPTIONS = [5, 10, 25, 50];

export default function SearchPage() {
  const router = useRouter();
  const [niche, setNiche] = useState('');
  const [city, setCity] = useState('Goiânia');
  const [state, setState] = useState('GO');
  const [neighborhood, setNeighborhood] = useState('');
  const [radius, setRadius] = useState(25);
  const [quantity, setQuantity] = useState(100);
  
  // Default to Google Maps automatically in background
  const searchSource = 'google_maps';
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !city || !state) return;
    setIsSearching(true);
  };

  const handleSearchComplete = () => {
    try {
      localStorage.setItem('leadforge_latest_search', JSON.stringify({
        params: { niche, city, state, neighborhood, radius, quantity, searchSource },
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save search to localStorage', error);
    }
  };

  const handleViewResults = () => {
    router.push('/results');
  };

  return (
    <div className="min-h-full flex flex-col bg-background">
      <Header title="Nova Busca" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-10 w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Encontre empresas que <span className="text-accent relative inline-block">
              precisam
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,10 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span> de um site
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Prospecção inteligente para venda de sites e serviços digitais
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full space-y-8 bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-xl">
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-secondary block">
              Qual tipo de empresa você quer encontrar?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-text-muted" />
              </div>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Clínicas Odontológicas, Restaurantes..."
                className="w-full pl-12 pr-4 h-14 bg-background border border-border rounded-xl text-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted"
                required
              />
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {NICHES.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNiche(item)}
                  className="px-3 py-1.5 text-sm bg-background border border-border rounded-full hover:border-accent/50 hover:text-accent transition-colors text-text-secondary"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" /> Localização
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-text-muted mb-1 block">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Estado</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent text-center uppercase"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-text-muted mb-1 block">Bairro (Opcional)</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Opcional"
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-text-primary flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-accent" /> Raio de Busca
                </h3>
                <div className="flex gap-2">
                  {RADIUS_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRadius(opt)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                        radius === opt 
                          ? 'bg-accent border-accent text-black' 
                          : 'bg-background border-border text-text-secondary hover:border-text-muted'
                      }`}
                    >
                      {opt}km
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm font-medium text-text-primary">Quantidade de leads</label>
                  <span className="text-lg font-bold text-accent">{quantity} leads</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="200"
                  step="25"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-xs text-text-muted mt-2">
                  <span>25</span>
                  <span>200</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={!niche || !city || !state}
              className="group relative w-full max-w-md h-14 bg-accent hover:bg-accent-hover text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(0,214,143,0.3)]"
            >
              ENCONTRAR LEADS
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
          </div>
        </form>
      </div>

      {isSearching && (
        <SearchProgress
          isOpen={isSearching}
          searchParams={{ niche, city, state, neighborhood, radius, quantity, searchSource } as any}
          onComplete={handleSearchComplete}
          onViewResults={handleViewResults}
        />
      )}
    </div>
  );
}
