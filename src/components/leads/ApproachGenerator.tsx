'use client';

import { Lead } from '@/lib/types/lead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWhatsAppUrl } from '@/lib/utils/phone';

interface ApproachGeneratorProps {
  lead: Lead;
  isOpen?: boolean;
}

export function ApproachGenerator({ lead, isOpen = true }: ApproachGeneratorProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage(generateApproach(lead));
  }, [lead]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  const handleWhatsApp = () => {
    const url = getWhatsAppUrl(lead.whatsapp || lead.phone, message);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const hasWhatsApp = Boolean(getWhatsAppUrl(lead.whatsapp || lead.phone));

  return (
    <Card className="p-4 bg-surface-hover border-border mt-4">
      <div className="mb-4">
        <p className="text-sm text-text whitespace-pre-wrap font-mono p-3 bg-background rounded-md border border-border">
          {message}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={handleCopy} className="flex-1">
          <Copy className="h-4 w-4 mr-2" />
          COPIAR
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleWhatsApp} 
          disabled={!hasWhatsApp}
          className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-black font-semibold disabled:opacity-50"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          ABRIR WHATSAPP
        </Button>
      </div>
    </Card>
  );
}

function getCallToAction(category: string = ''): string {
  const cat = category.toLowerCase();
  if (cat.includes('barbearia') || cat.includes('salão')) return 'receber mais agendamentos online';
  if (cat.includes('restaurante') || cat.includes('pizzaria')) return 'mostrar o cardápio e receber reservas';
  if (cat.includes('clínica') || cat.includes('médico') || cat.includes('dentista')) return 'atrair novos pacientes';
  if (cat.includes('academia') || cat.includes('fitness')) return 'captar novos alunos';
  if (cat.includes('oficina') || cat.includes('mecânica')) return 'receber mais orçamentos';
  return 'atrair mais clientes pelo Google';
}

function generateApproach(lead: Lead): string {
  const ratingText = (lead.rating || 0) > 4.8 ? 'excelente' : 'ótima';
  const reviewText = (lead.reviewCount || 0) > 100 ? ` com mais de ${lead.reviewCount} avaliações` : '';
  const cta = getCallToAction(lead.category);
  const isBarber = lead.category?.toLowerCase().includes('barbearia');

  if (!lead.digitalPresence.hasWebsite) {
    if (lead.digitalPresence.instagramUrl || lead.digitalPresence.facebookUrl) {
      return `Olá, tudo bem? Vi a ${lead.name} no ${lead.digitalPresence.instagramUrl ? 'Instagram' : 'Facebook'} e vocês parecem ter um negócio muito legal! Percebi que ainda não têm um site próprio. Um site profissional pode complementar as redes sociais e trazer mais clientes da busca do Google. Posso te mostrar como ficaria?`;
    }
    
    return `Olá, tudo bem? Encontrei a ${lead.name} pesquisando empresas da região e vi que vocês têm uma avaliação ${ratingText} no Google${reviewText}. Percebi também que atualmente não encontrei um site próprio ${isBarber ? 'da barbearia' : 'da empresa'}. Trabalho com criação de sites para negócios locais e acredito que um site profissional poderia ajudar vocês a ${cta}. Posso te mostrar como ficaria?`;
  } 
  
  if (lead.websiteAnalysis && lead.websiteAnalysis.overallQuality < 60) {
    const issues = lead.websiteAnalysis.issues.slice(0, 2).map(i => i.toLowerCase()).join(' e ');
    return `Olá, tudo bem? Sou especialista em criação de sites e encontrei a ${lead.name} durante uma pesquisa na região. Notei que o site atual poderia ter algumas melhorias, especialmente em relação a ${issues || 'design e versão para celular'}. Um site moderno e otimizado pode fazer grande diferença na captação de novos clientes. Gostaria de te apresentar uma proposta?`;
  }

  return `Olá, tudo bem? Acompanho o trabalho da ${lead.name} e queria parabenizar pela presença digital! Trabalho com tecnologia para negócios locais e tenho algumas ideias de como podemos otimizar ainda mais a captação de clientes de vocês através da internet. Teria interesse em bater um papo rápido?`;
}
