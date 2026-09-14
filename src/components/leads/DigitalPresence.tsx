'use client';

import { DigitalPresence as IDigitalPresence } from '@/lib/types/lead';
import { Card } from '@/components/ui/Card';
import { Globe, Instagram, Facebook, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface DigitalPresenceProps {
  presence: IDigitalPresence;
}

export function DigitalPresence({ presence }: DigitalPresenceProps) {
  const items = [
    {
      label: 'Website',
      icon: Globe,
      status: presence.hasWebsite,
      url: presence.websiteUrl,
    },
    {
      label: 'Instagram',
      icon: Instagram,
      status: !!presence.instagramUrl,
      url: presence.instagramUrl,
    },
    {
      label: 'Facebook',
      icon: Facebook,
      status: !!presence.facebookUrl,
      url: presence.facebookUrl,
    },
    {
      label: 'Google Maps',
      icon: MapPin,
      status: !!presence.googleMapsUrl,
      url: presence.googleMapsUrl,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Card key={i} className="p-3 flex items-center justify-between bg-surface border-border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${item.status ? 'bg-accent/10 text-accent' : 'bg-surface-hover text-text-secondary'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm text-text">{item.label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {item.status ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-xs text-green-500">Encontrado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs text-red-500">Não encontrado</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {item.status && item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline px-2 py-1 bg-accent/10 rounded-md"
              >
                Abrir
              </a>
            )}
          </Card>
        );
      })}
    </div>
  );
}
