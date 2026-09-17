'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lead } from '@/lib/types/lead';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { Badge } from '@/components/ui/Badge';
import { DigitalPresence } from '@/components/leads/DigitalPresence';
import { WebsiteAnalysisDisplay } from '@/components/leads/WebsiteAnalysisDisplay';
import { ApproachGenerator } from '@/components/leads/ApproachGenerator';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, Clock, Copy, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getWhatsAppUrl, formatPhoneBr } from '@/lib/utils/phone';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApproach, setShowApproach] = useState(false);

  useEffect(() => {
    const storedLeads = localStorage.getItem('leadforge_search_results');
    if (storedLeads) {
      try {
        const parsedLeads = JSON.parse(storedLeads);
        const found = parsedLeads.find((l: Lead) => l.id === id);
        if (found) {
          setLead(found);
        }
      } catch (e) {
        console.error('Failed to parse leads', e);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-10 text-center space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Lead não encontrado</h2>
        <p className="text-text-secondary text-sm">O lead solicitado não está salvo no histórico de busca atual.</p>
        <Button onClick={() => router.push('/results')}>Voltar aos resultados</Button>
      </div>
    );
  }

  const handleCopyPhone = () => {
    const phone = lead.whatsapp || lead.phone;
    if (phone) {
      navigator.clipboard.writeText(phone);
    }
  };

  const classificationMap = {
    hot: { label: '🔥 HOT', color: 'bg-hot/10 text-hot border-hot/30' },
    warm: { label: '🟠 WARM', color: 'bg-warm/10 text-warm border-warm/30' },
    cold: { label: '🟢 COLD', color: 'bg-cold/10 text-cold border-cold/30' },
  };

  const locationText = lead.neighborhood
    ? `${lead.neighborhood}, ${lead.city} - ${lead.state}`
    : lead.address || `${lead.city} - ${lead.state}`;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-6 pb-24 md:pb-6 text-text-primary">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="shrink-0 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-text-primary truncate">{lead.name}</h1>
          <p className="text-text-secondary">{lead.category}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge className={cn("hidden sm:flex border", classificationMap[lead.classification].color)}>
            {classificationMap[lead.classification].label}
          </Badge>
          <ScoreBadge score={lead.websiteOpportunityScore} classification={lead.classification} />
          <Button variant="ghost" size="sm" className="p-2">
            <Star className={cn("h-5 w-5", lead.isFavorite && "fill-yellow-500 text-yellow-500")} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações da Empresa */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4 border-b border-border pb-2">Informações da Empresa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              
              {locationText && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-sm text-text-secondary block mb-1">Endereço</span>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-accent shrink-0" />
                    <span className="text-text-primary">
                      {lead.address ? `${lead.address} — ` : ''}{locationText}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm text-text-secondary block mb-1">Contato</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-text-secondary" />
                    <span>{formatPhoneBr(lead.phone || lead.whatsapp) || 'Não informado'}</span>
                    {(lead.phone || lead.whatsapp) && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1" onClick={handleCopyPhone}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {getWhatsAppUrl(lead.whatsapp || lead.phone) && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#25D366]" />
                      <span>{formatPhoneBr(lead.whatsapp || lead.phone)}</span>
                      <a 
                        href={getWhatsAppUrl(lead.whatsapp || lead.phone)!} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-accent hover:underline ml-1 font-medium"
                      >
                        Abrir WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-sm text-text-secondary block mb-1">Avaliação Google</span>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-lg">{lead.rating ? lead.rating.toFixed(1) : 'N/A'}</span>
                  <span className="text-text-secondary text-sm">({lead.reviewCount || 0} avaliações)</span>
                </div>
              </div>

              {lead.openingHours && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-sm text-text-secondary block mb-1">Horário</span>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm whitespace-pre-wrap">{lead.openingHours}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Presença Digital */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4 border-b border-border pb-2">Presença Digital</h2>
            <DigitalPresence presence={lead.digitalPresence} />
          </Card>

          {/* Análise do Website */}
          {lead.websiteAnalysis && (
            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-4 border-b border-border pb-2">Análise do Website</h2>
              <WebsiteAnalysisDisplay analysis={lead.websiteAnalysis} />
            </Card>
          )}

          {/* Ação Comercial */}
          <Card className="p-5 bg-accent/5 border-accent/20 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ação Comercial & Apresentação</h2>
            </div>
            {!showApproach ? (
              <Button onClick={() => setShowApproach(true)} className="w-full" variant="secondary">
                GERAR ABORDAGEM COM IA
              </Button>
            ) : (
              <ApproachGenerator lead={lead} isOpen={true} />
            )}
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Website Opportunity */}
          <Card className="p-5 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-accent/20 bg-background mb-4">
                <span className="text-3xl font-bold text-accent">{lead.websiteOpportunityScore}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Score de Oportunidade</h3>
              <Badge className={cn("text-sm px-3 py-1", classificationMap[lead.classification].color)}>
                {classificationMap[lead.classification].label}
              </Badge>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Motivos</h4>
              <ul className="space-y-2">
                {lead.opportunityReasons?.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Oportunidade Comercial */}
          <Card className="p-5 border-l-4 border-l-accent">
            <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-accent" />
              Sugestão Estratégica
            </h4>
            <p className="text-sm text-text-secondary italic">
              &quot;{lead.opportunitySuggestion}&quot;
            </p>
          </Card>
        </div>
      </div>

      {/* Action Bar (Mobile Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-border p-4 md:hidden flex gap-2 z-50">
        {getWhatsAppUrl(lead.whatsapp || lead.phone) ? (
          <Button 
            className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-black font-semibold"
            onClick={() => {
              const url = getWhatsAppUrl(lead.whatsapp || lead.phone);
              if (url) window.open(url, '_blank');
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleCopyPhone} disabled={!lead.phone && !lead.whatsapp}>
            <Phone className="h-4 w-4 mr-2" />
            Copiar Telefone
          </Button>
        )}
        <Button variant="secondary" size="sm" className="shrink-0 px-3" title="Adicionar ao CRM">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
