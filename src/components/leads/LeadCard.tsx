'use client';

import { Lead } from '@/lib/types/lead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { cn } from '@/lib/utils/cn';
import { MapPin, Star, MessageSquare, Globe, Smartphone, Instagram, Eye, MessageCircle, Copy, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LeadCardProps {
  lead: Lead;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onAddToCRM?: (id: string) => void;
}

export function LeadCard({ lead, onFavoriteToggle, onAddToCRM }: LeadCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(lead.isFavorite || false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(lead.id, !isFavorite);
  };

  const copyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = lead.whatsapp || lead.phone;
    if (phone) {
      navigator.clipboard.writeText(phone);
    }
  };

  const handleCrmClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCRM?.(lead.id);
  };

  const locationText = lead.neighborhood
    ? `${lead.neighborhood}, ${lead.city} - ${lead.state}`
    : lead.address || `${lead.city} - ${lead.state}`;

  return (
    <Card 
      className="p-4 relative hover:border-accent/50 transition-colors cursor-pointer group"
      onClick={() => router.push(`/leads/${lead.id}`)}
    >
      <button 
        type="button"
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 text-text-secondary hover:text-yellow-500 transition-colors"
      >
        <Star className={cn("h-5 w-5", isFavorite && "fill-yellow-500 text-yellow-500")} />
      </button>

      <div className="flex justify-between items-start mb-2 pr-8">
        <div>
          <h3 className="font-semibold text-lg text-text-primary truncate max-w-[200px] sm:max-w-xs">{lead.name}</h3>
          <p className="text-sm text-text-secondary">{lead.category}</p>
        </div>
        <ScoreBadge score={lead.websiteOpportunityScore} classification={lead.classification} />
      </div>

      <div className="space-y-2 mt-3 text-sm">
        {locationText && (
          <div className="flex items-start text-text-secondary">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-accent" />
            <span className="truncate">{locationText}</span>
          </div>
        )}

        <div className="flex items-center text-text-secondary">
          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
          <span className="font-medium text-text-primary">{lead.rating ? lead.rating.toFixed(1) : 'N/A'}</span>
          <span className="mx-2">·</span>
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{lead.reviewCount || 0} avaliações</span>
        </div>

        <div className="flex items-center">
          <Globe className="h-4 w-4 mr-2 shrink-0 text-text-secondary" />
          {lead.digitalPresence.hasWebsite && lead.digitalPresence.websiteUrl ? (
            <a 
              href={lead.digitalPresence.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-accent hover:underline truncate"
            >
              {lead.digitalPresence.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          ) : (
            <span className="text-hot font-medium text-xs bg-hot/10 px-2 py-0.5 rounded">NÃO ENCONTRADO</span>
          )}
        </div>

        <div className="flex items-center text-text-secondary">
          <Smartphone className="h-4 w-4 mr-2 shrink-0" />
          <span>{lead.whatsapp || lead.phone || 'Não informado'}</span>
        </div>

        {lead.digitalPresence.instagramUrl && (
          <div className="flex items-center text-text-secondary">
            <Instagram className="h-4 w-4 mr-2 shrink-0 text-pink-400" />
            <a 
              href={lead.digitalPresence.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="truncate hover:text-text-primary"
            >
              {lead.digitalPresence.instagramUrl.split('/').filter(Boolean).pop()}
            </a>
          </div>
        )}
      </div>

      <div className="border-t border-border my-3" />

      <p className="italic text-text-secondary text-sm mb-4 line-clamp-2 min-h-[40px]">
        {lead.opportunitySuggestion || "Sem sugestão de oportunidade."}
      </p>



      <div className="flex flex-wrap gap-2 mt-auto">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 text-xs"
          onClick={(e) => { e.stopPropagation(); router.push(`/leads/${lead.id}`); }}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Ver Lead
        </Button>
        
        {lead.whatsapp ? (
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-black font-semibold text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`, '_blank');
            }}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            WhatsApp
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 text-xs"
            disabled={!lead.phone}
            onClick={copyPhone}
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copiar
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="shrink-0 px-2"
          title="Adicionar ao CRM"
          onClick={handleCrmClick}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default LeadCard;
