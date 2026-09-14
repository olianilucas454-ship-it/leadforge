'use client';

import React, { useState } from 'react';
import { useSiteBuilder } from '@/lib/context/SiteBuilderContext';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  FileText,
  Copy,
  Check,
  Trash2,
  Search,
  Plus,
  Sparkles,
  Zap
} from 'lucide-react';
import { AssetSchema } from '@/lib/types/siteBuilder';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset?: (assetUrl: string) => void;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  const { activeSite, saveSite } = useSiteBuilder();

  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'logo' | 'sequence'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingProgress, setUploadingProgress] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSequenceGenerator, setShowSequenceGenerator] = useState(false);

  if (!isOpen || !activeSite) return null;

  const defaultAssets: AssetSchema[] = [
    {
      id: 'ast-1',
      name: 'Hero Luxury Ambiance',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1600',
      sizeKb: 420,
    },
    {
      id: 'ast-2',
      name: 'Barbershop Master Cut',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1600',
      sizeKb: 380,
    },
    {
      id: 'ast-3',
      name: 'Modern Architecture House',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
      sizeKb: 510,
    },
    {
      id: 'ast-4',
      name: 'Medical Clinic Interior',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600',
      sizeKb: 290,
    },
    {
      id: 'ast-5',
      name: 'Cinematic Scroll Video Loop',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-barber-cutting-hair-in-a-barbershop-41556-large.mp4',
      sizeKb: 4500,
    },
  ];

  const currentAssets = activeSite.assets && activeSite.assets.length > 0 ? activeSite.assets : defaultAssets;

  const filteredAssets = currentAssets.filter((ast) => {
    if (activeTab !== 'all' && ast.type !== activeTab) return false;
    if (searchQuery && !ast.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingProgress(10);
    const interval = setInterval(() => {
      setUploadingProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);

          // Add uploaded asset
          const file = files[0];
          const newAsset: AssetSchema = {
            id: `ast-${Date.now()}`,
            name: file.name,
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: URL.createObjectURL(file),
            sizeKb: Math.round(file.size / 1024),
          };

          const updatedSite = {
            ...activeSite,
            assets: [newAsset, ...currentAssets],
          };
          saveSite(updatedSite);
          setTimeout(() => setUploadingProgress(null), 300);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = (id: string) => {
    const updatedAssets = currentAssets.filter((a) => a.id !== id);
    saveSite({ ...activeSite, assets: updatedAssets });
  };

  const handleSelect = (url: string) => {
    if (onSelectAsset) {
      onSelectAsset(url);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Gerenciador de Assets & Mídia</h2>
              <p className="text-xs text-slate-400">Bibliotecas de imagens, vídeos e sequências 60fps</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900/50">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({currentAssets.length})
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'image' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Imagens
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'video' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vídeos
            </button>
          </div>

          {/* Search & Upload */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar arquivo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none w-44"
              />
            </div>

            <label className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded cursor-pointer flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Arquivo</span>
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Uploading Progress Indicator */}
        {uploadingProgress !== null && (
          <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/30 flex items-center gap-3">
            <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-200"
                style={{ width: `${uploadingProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{uploadingProgress}%</span>
          </div>
        )}

        {/* Asset Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all"
                >
                  {/* Preview Container */}
                  <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center p-2">
                    {asset.type === 'video' ? (
                      <video src={asset.url} className="w-full h-full object-cover rounded" muted loop autoPlay />
                    ) : (
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover rounded" />
                    )}

                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      {onSelectAsset && (
                        <button
                          onClick={() => handleSelect(asset.url)}
                          className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded shadow hover:bg-amber-400 transition-colors"
                        >
                          Usar no Site
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyUrl(asset.url, asset.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                        title="Copiar URL"
                      >
                        {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded border border-slate-700"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Asset Info Footer */}
                  <div className="p-2.5 bg-slate-950 border-t border-slate-800/80 text-xs">
                    <div className="font-semibold text-slate-200 truncate">{asset.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span className="uppercase font-mono">{asset.type}</span>
                      <span>{asset.sizeKb} KB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12 text-center">
              <ImageIcon className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-semibold">Nenhum arquivo encontrado</p>
              <p className="text-[11px] text-slate-600 mt-1">Faça upload de uma imagem ou vídeo para adicionar à biblioteca.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Formatos suportados: JPG, PNG, WebP, AVIF, SVG, MP4, WebM</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
