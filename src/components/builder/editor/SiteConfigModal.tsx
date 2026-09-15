'use client';

import React, { useState, useEffect } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import { AISiteAgent } from '@/lib/engines/AISiteAgent';
import { CompositionEngine } from '@/lib/engines/CompositionEngine';
import { CreativeDirectorEngine } from '@/lib/engines/CreativeDirectorEngine';
import { AIImagePromptEngine } from '@/lib/engines/AIImagePromptEngine';
import {
  X,
  Settings,
  Sparkles,
  Upload,
  Globe,
  MapPin,
  Phone,
  MessageSquare,
  Palette,
  Type,
  Wand2,
  CheckCircle2,
  Building2,
  Scissors,
  UtensilsCrossed,
  Building,
  Home,
  Stethoscope,
  Scale,
  Laptop
} from 'lucide-react';

interface SiteConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteConfigModal: React.FC<SiteConfigModalProps> = ({ isOpen, onClose }) => {
  const { activeSite, saveSite, setIsAiProcessing } = useSiteBuilder();

  // Form State initialized from activeSite
  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [category, setCategory] = useState('barbershop');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [promptText, setPromptText] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('haute-barbier');

  useEffect(() => {
    if (activeSite) {
      setSiteName(activeSite.name || '');
      setClientName(activeSite.clientName || '');
      setSubdomain(activeSite.subdomain || '');
      const lead = (activeSite.leadData as any) || {};
      setCity(lead.city || 'São Paulo');
      setState(lead.state || 'SP');
      setPhone(lead.phone || '(11) 99876-5432');
      setWhatsapp(lead.whatsapp || '5511998765432');
      setAddress(lead.address || 'Av. Paulista, 1500 - Jardins, São Paulo - SP');
      setOpeningHours('Segunda a Sábado: 09:00 - 20:00');

      const catStr = (lead.category || activeSite.name || '').toLowerCase();
      if (catStr.includes('barb')) setCategory('barbershop');
      else if (catStr.includes('gastron') || catStr.includes('restaur')) setCategory('gastronomy');
      else if (catStr.includes('arq')) setCategory('architecture');
      else if (catStr.includes('imóv') || catStr.includes('imobiliá')) setCategory('realestate');
      else if (catStr.includes('saúde') || catStr.includes('clínic')) setCategory('health');
      else if (catStr.includes('advoc') || catStr.includes('juríd')) setCategory('legal');
      else setCategory('general');
    }
  }, [activeSite, isOpen]);

  if (!isOpen || !activeSite) return null;

  const SECTORS = [
    { id: 'barbershop', name: 'Barbearia & Estética Masculina', icon: Scissors },
    { id: 'gastronomy', name: 'Gastronomia & Restaurante Autoral', icon: UtensilsCrossed },
    { id: 'architecture', name: 'Arquitetura & Design de Interiores', icon: Building },
    { id: 'realestate', name: 'Imobiliária & Real Estate de Luxo', icon: Home },
    { id: 'health', name: 'Clínica, Odontologia & Saúde', icon: Stethoscope },
    { id: 'legal', name: 'Advocacia & Consultoria Empresarial', icon: Scale },
    { id: 'tech', name: 'Tech, SaaS & Agência Digital', icon: Laptop },
    { id: 'general', name: 'Geral / Serviços Exclusivos', icon: Building2 },
  ];

  const PRESETS = [
    {
      id: 'haute-barbier',
      title: 'Haute Barbier Imperial',
      desc: 'Fundo negro, detalhes em Ouro Bronze, fontes Cormorant Garamond / Cinzel e badges em vidro fosco.',
      accent: '#C5A059',
      bg: '#070709',
    },
    {
      id: 'ecodream-architecture',
      title: 'EcoDream Glass',
      desc: 'Vidro fosco orgânico, verde esmeralda, fundo sustentável e tags de difusão de luz.',
      accent: '#10B981',
      bg: '#06130D',
    },
    {
      id: 'archevo-editorial',
      title: 'Archevo Luxury',
      desc: 'Títulos em Bodoni Moda, iluminação warm cinema e fita horizontal de métricas na base.',
      accent: '#D4AF37',
      bg: '#0B0A08',
    },
    {
      id: 'lavilla-realestate',
      title: 'Lavilla Luxury Villa',
      desc: 'Layout com imagem de mansão tropical, tipografia Outfit e faixa de metragens.',
      accent: '#38BDF8',
      bg: '#030A14',
    },
    {
      id: 'gastronomy-michelin',
      title: 'Gastronomia Estrelada',
      desc: 'Menu autoral, detalhes em vinho burgundy/dourado e atmosfera michelin.',
      accent: '#D4AF37',
      bg: '#090505',
    },
    {
      id: 'cyber-neon',
      title: 'Cyberpunk SaaS',
      desc: 'Gradiente Cyan elétrico, fonte Space Grotesk e vidro neon.',
      accent: '#0EA5E9',
      bg: '#030816',
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setReferenceImage(reader.result as string);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  const handleApplyConfiguration = () => {
    setIsAiProcessing(true);

    setTimeout(() => {
      // 1. Prepare Lead Data Payload
      const updatedLeadData = {
        name: siteName || activeSite.name,
        clientName: clientName || siteName,
        category: category === 'barbershop' ? 'Barbearia & Estética Masculina' :
                  category === 'gastronomy' ? 'Gastronomia & Restaurante' :
                  category === 'architecture' ? 'Arquitetura & Interiores' :
                  category === 'realestate' ? 'Imobiliária & Real Estate' :
                  category === 'health' ? 'Clínica & Saúde' :
                  category === 'legal' ? 'Advocacia & Consultoria' : 'Serviços Exclusivos',
        city: city || 'São Paulo',
        state: state || 'SP',
        phone: phone || '(11) 99876-5432',
        whatsapp: whatsapp || '5511998765432',
        address: address || 'Av. Paulista, 1500 - Jardins, São Paulo - SP',
      };

      // 2. Resolve Art Direction & Business Analysis
      const analysis = AISiteAgent.analyzeBusiness(updatedLeadData);
      const direction = CreativeDirectorEngine.generateCreativeDirection(updatedLeadData);

      // 3. Rebuild Composition with Google Maps & Niche Content
      const imageStrategy = AIImagePromptEngine.generateStrategy(updatedLeadData.category, updatedLeadData.name, updatedLeadData.city);
      const newSections = CompositionEngine.buildStoryComposition(direction, updatedLeadData, imageStrategy);

      // 4. Update Site Schema
      let updatedSite: typeof activeSite = {
        ...activeSite,
        name: siteName || activeSite.name,
        clientName: clientName || siteName,
        subdomain: subdomain || activeSite.subdomain,
        leadData: updatedLeadData,
        designSystem: {
          ...activeSite.designSystem,
          headingFont: analysis.headingFont,
          bodyFont: analysis.bodyFont,
          primaryColor: analysis.primaryColor,
          accentColor: analysis.accentColor,
          backgroundColor: analysis.backgroundColor,
          surfaceColor: analysis.surfaceColor,
          textColor: analysis.textColor,
        },
        pages: [
          {
            ...activeSite.pages[0],
            sections: newSections,
          },
        ],
        updatedAt: new Date().toISOString(),
      };

      // 5. Apply Reference Redesign if Preset or Image/Prompt Provided
      if (selectedPresetId || referenceImage || promptText) {
        updatedSite = AISiteAgent.applyReferenceRedesign(
          updatedSite,
          promptText,
          referenceImage,
          selectedPresetId
        );
      }

      saveSite(updatedSite);
      setIsAiProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Configuração Geral & Gerador IA do Site</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-mono">1-Clique</span>
              </h2>
              <p className="text-xs text-slate-400">Personalize dados da empresa, mapa do Google Maps, cores e estilo de agência</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
          {/* Section 1: Business Profile & Sector */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>1. Perfil da Empresa & Segmento</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Nome Comercial do Negócio</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Ex: Corvo & Co. Barbearia Imperial"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Subdomínio (URL do Site)</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden px-3 py-2 text-xs">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="corvo-barber"
                    className="w-full bg-transparent text-amber-400 font-mono font-bold focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">.leadforge.app</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-2 font-medium">Selecione o Segmento de Atuação</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SECTORS.map((sec) => {
                  const Icon = sec.icon;
                  const isSelected = category === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setCategory(sec.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="text-[11px] leading-tight">{sec.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info & Google Maps Location */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>2. Localização & Google Maps ao Vivo</span>
            </label>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">Endereço Completo (Carrega Mapa e Rota no Site)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Rua Oscar Freire, 1200 - Jardins, São Paulo - SP"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Cidade / Estado</label>
                <input
                  type="text"
                  value={city ? `${city}, ${state}` : ''}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setCity(parts[0]?.trim() || '');
                    if (parts[1]) setState(parts[1]?.trim());
                  }}
                  placeholder="São Paulo, SP"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Telefone de Contato</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99876-5432"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">WhatsApp (Agendamento Direct)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="5511998765432"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Preset Estético & Referência por Imagem / Prompt */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>3. Estilo Visual, Referência por Imagem & Prompt IA</span>
            </label>

            {/* Presets Grid */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-2 font-medium">Escolha um Preset Visual de Agência Internacional</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPresetId(isSelected ? null : p.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{p.title}</span>
                        <div
                          className="w-3 h-3 rounded-full border border-slate-700 shrink-0"
                          style={{ backgroundColor: p.accent }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image Reference & Prompt Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Print de Referência (Opcional)</label>
                <div className="border border-dashed border-slate-700 hover:border-amber-500/50 rounded-lg p-3 bg-slate-900 text-center relative group">
                  {referenceImage ? (
                    <div className="relative aspect-[16/9] max-h-[100px] mx-auto rounded overflow-hidden">
                      <img src={referenceImage} alt="Referência" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReferenceImage(null)}
                        className="absolute top-1 right-1 p-1 bg-black/80 text-white rounded-full text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center py-2">
                      <Upload className="w-5 h-5 text-amber-400 mb-1 opacity-80" />
                      <span className="text-[11px] font-bold text-slate-300">Carregar Foto de Referência</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Prompt de Instrução Estética IA</label>
                <textarea
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Ex: Criar um site escuro de luxo com detalhes em dourado imperial, fonte serifada elegante e mapa do Google Maps..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">O LeadForge reconstruirá o site inteiro em segundos.</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-xs"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyConfiguration}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-lg shadow-xl shadow-amber-500/25 flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              🚀 Aplicar & Gerar Novo Site com IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
