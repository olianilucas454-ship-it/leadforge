'use client';

import React, { useState } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { AISiteAgent } from '@/lib/engines/AISiteAgent';
import {
  X,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Wand2,
  CheckCircle2,
  Layers,
  Palette,
  Type
} from 'lucide-react';

interface ReferenceStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceStyleModal: React.FC<ReferenceStyleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeSite, saveSite, setIsAiProcessing } = useSiteBuilder();

  const [promptText, setPromptText] = useState('');
  const [referenceImageDataUrl, setReferenceImageDataUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  if (!isOpen || !activeSite) return null;

  const PRESETS = [
    {
      id: 'ecodream-architecture',
      title: 'EcoDream Glass (Arquitetura Futurista)',
      tag: 'Arquitetura & Vidro Organico',
      desc: 'Cards de vidro fosco flutuantes, fundo de mansão ecológica futurista, tags de sustentabilidade e estatísticas em pill.',
      accent: '#10B981',
      headingFont: 'Outfit, sans-serif',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'archevo-editorial',
      title: 'Archevo Luxury (Arquitetura Monumental)',
      tag: 'Design de Interiores & Luxo',
      desc: 'Títulos monumentais em Bodoni Moda, iluminação warm cinema, botão Play Showreel e fita horizontal de métricas na base.',
      accent: '#D4AF37',
      headingFont: 'Bodoni Moda, serif',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'lavilla-realestate',
      title: 'Lavilla Luxury Villa (Imobiliária Balneário)',
      tag: 'Real Estate & Balneários',
      desc: 'Overlay gigante no canto inferior esquerdo, fundo tropical com piscina iluminada e faixa de dados e metragens.',
      accent: '#38BDF8',
      headingFont: 'Outfit, sans-serif',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'haute-barbier',
      title: 'Haute Barbier Imperial (Ouro & Serifas)',
      tag: 'Alta Barbearia & Luxo',
      desc: 'Fundo negro absoluto, títulos com degradê dourado imperial (Cinzel / Cormorant) e badges em vidro fosco.',
      accent: '#C5A059',
      headingFont: 'Cinzel, serif',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'gastronomy-michelin',
      title: 'Gastronomia Estrelada (Vinho & Gold)',
      tag: 'Restaurantes Autorais',
      desc: 'Detalhes em Burgundy/Vinho e ouro, fontes Playfair Display e atmosfera aconchegante.',
      accent: '#D4AF37',
      headingFont: 'Playfair Display, serif',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'syne-futuristic',
      title: 'Syne Creative Studio (Agência Awwwards)',
      tag: 'Next-Gen & Design',
      desc: 'Tipografia futurista Syne, contraste extremo e cards flutuantes.',
      accent: '#6366F1',
      headingFont: 'Syne, sans-serif',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cyber-neon',
      title: 'Cyberpunk SaaS (Cyan Neon)',
      tag: 'Tech & Plataformas',
      desc: 'Gradientes azuis cyan elétricos, fonte Space Grotesk e vidro fosco neon.',
      accent: '#0EA5E9',
      headingFont: 'Space Grotesk, sans-serif',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setReferenceImageDataUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyRedesign = () => {
    setIsAiProcessing(true);

    setTimeout(() => {
      const updatedSite = AISiteAgent.applyReferenceRedesign(
        activeSite,
        promptText,
        referenceImageDataUrl,
        selectedPresetId
      );

      saveSite(updatedSite);
      setIsAiProcessing(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Reconstruir Estilo por Referência IA</h2>
              <p className="text-xs text-slate-400">Suba um print de site referência ou informe um prompt estético</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
          {/* Section 1: Image Reference Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
              1. Imagem de Referência do Site Desejado (Print / Mockup)
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 bg-slate-950/60 transition-colors text-center relative group">
              {referenceImageDataUrl ? (
                <div className="relative aspect-[16/9] max-h-[160px] mx-auto rounded-lg overflow-hidden border border-slate-700">
                  <img src={referenceImageDataUrl} alt="Referência" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setReferenceImageDataUrl(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-full hover:bg-red-950 text-xs"
                  >
                    ✕ Remover
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                  <Upload className="w-8 h-8 text-amber-400 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">Clique para enviar imagem de referência</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, WebP — Prints de sites de premiação</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Section 2: Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
              2. Ou Selecione um Preset de Estilo de Agência Internacional
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESETS.map((p) => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPresetId(isSelected ? null : p.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={p.image} alt={p.title} className="w-14 h-14 rounded object-cover flex-shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span className="truncate">{p.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 ml-1" />}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">{p.tag}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Prompt Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Descreva o Estilo ou Instruções Específicas em Texto (Prompt IA)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Criar um site com estilo Haute Barbier em tom Ouro Imperial e Cinzel, fundo negro absoluto, degradês metálicos nos títulos e badges em vidro fosco com borda dourada..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">A IA irá re-estruturar a identidade estética de todo o site.</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-xs"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyRedesign}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Reconstruir Todo o Site Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
