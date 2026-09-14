'use client';

import React from 'react';
import { Search, Clock, RotateCcw } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { searchHistory } = useSearch();
  const router = useRouter();

  const handleSearchAgain = (query: string) => {
    // Navigates to search page with the query
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">
      <div className="mb-8 flex items-center space-x-3">
        <Clock className="text-[#00d68f]" size={28} />
        <div>
          <h1 className="text-3xl font-bold mb-1">Pesquisas Salvas</h1>
          <p className="text-gray-400">Histórico de buscas realizadas e resultados salvos</p>
        </div>
      </div>

      {searchHistory.length > 0 ? (
        <div className="space-y-4">
          {searchHistory.map((item) => (
            <div key={item.id} className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:border-gray-600">
              <div className="flex items-start space-x-4">
                <div className="bg-[#2a2a3e] p-3 rounded-lg text-gray-300 mt-1">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f0f0f5]">{item.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                    <span>{new Date(item.date).toLocaleString('pt-BR')}</span>
                    <span>•</span>
                    <span className="text-[#f0f0f5] font-medium">{item.result.total} encontrados</span>
                    <span>•</span>
                    <span className="text-red-400">{item.result.noWebsite} sem site</span>
                    <span>•</span>
                    <span className="text-orange-500 font-medium">{item.result.hot} HOT</span>
                    <span>•</span>
                    <span className="text-yellow-500 font-medium">{item.result.warm} WARM</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleSearchAgain(item.params.query)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#2a2a3e] hover:bg-gray-700 text-[#f0f0f5] rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
              >
                <RotateCcw size={16} />
                <span>Pesquisar novamente</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-16 text-center flex flex-col items-center justify-center">
          <div className="text-gray-500 mb-4 bg-[#2a2a3e] p-6 rounded-full">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-medium text-gray-200 mb-2">Nenhuma pesquisa realizada ainda.</h3>
          <p className="text-gray-400 max-w-md text-center">
            Suas pesquisas recentes e parâmetros de busca aparecerão aqui para fácil acesso.
          </p>
        </div>
      )}
    </div>
  );
}
