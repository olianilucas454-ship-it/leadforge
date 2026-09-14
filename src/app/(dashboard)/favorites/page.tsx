'use client';

import React, { useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { LeadCard } from '@/components/leads/LeadCard'; 

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [activeFilter, setActiveFilter] = useState('⭐ Todos');

  const filters = ['⭐ Todos', '🔥 Hot Leads', '🌐 Sem site', '📱 WhatsApp', '💰 Alta oportunidade'];

  const filteredFavorites = favorites.filter(lead => {
    if (activeFilter === '🔥 Hot Leads') return lead.classification === 'hot';
    if (activeFilter === '🌐 Sem site') return !lead.digitalPresence?.hasWebsite && !lead.website;
    if (activeFilter === '📱 WhatsApp') return Boolean(lead.whatsapp);
    if (activeFilter === '💰 Alta oportunidade') return (lead.websiteOpportunityScore || 0) >= 80;
    return true; // '⭐ Todos'
  });

  return (
    <div className="p-6 md:p-8 min-h-screen bg-background text-text-primary">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Favoritos</h1>
        <p className="text-text-secondary text-sm mt-1">Leads salvos para contato e acompanhamento prioritário</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              activeFilter === filter
                ? 'bg-accent text-black border-accent font-semibold shadow-lg shadow-accent/20'
                : 'bg-surface text-text-secondary border-border hover:border-border-hover'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map(lead => (
            <div key={lead.id} className="relative">
              <LeadCard 
                lead={lead} 
                onFavoriteToggle={(id) => toggleFavorite(id)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="text-xl font-medium text-text-primary mb-2">Nenhum favorito encontrado</h3>
          <p className="text-text-secondary max-w-md text-center text-sm">
            Nenhum favorito ainda. Marque leads como favoritos para acessá-los rapidamente nesta tela.
          </p>
        </div>
      )}
    </div>
  );
}
