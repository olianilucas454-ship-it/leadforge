'use client';

import React, { useEffect, useRef, useState } from 'react';

interface HorizontalScrollSectionProps {
  title?: string;
  items?: { title: string; subtitle: string; description: string; image: string }[];
}

export const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  title = 'NOSSOS PILARES DE EXCELÊNCIA',
  items = [
    {
      title: '01. Design Autoral',
      subtitle: 'PROJETO ÚNICO',
      description: 'Cada linha é pensada para transmitir sofisticação e autoridade máxima.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: '02. Performance Extrema',
      subtitle: 'VELOCIDADE MÁXIMA',
      description: 'Carregamento instantâneo com otimização contínua de código e ativos.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: '03. Conversão de Alto Padrão',
      subtitle: 'RESULTADOS REAIS',
      description: 'Estrutura estratégica desenhada para transformar visitantes em clientes qualificados.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
    },
  ],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScrollableDistance);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translateXPercent = scrollProgress * 66.6; // Moves across 3 panels

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-surface text-text-primary">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        <div className="px-8 mb-8 flex justify-between items-end max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-accent uppercase block mb-2">
              HORIZON NAVIGATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif italic text-text-primary">
              {title}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-muted">
            <span>SCROLL DOWN</span>
            <span className="w-8 h-px bg-accent" />
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-8 px-8 transition-transform duration-100 ease-out"
            style={{ transform: `translateX(-${translateXPercent}%)` }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="w-[85vw] sm:w-[500px] shrink-0 bg-background border border-border p-8 rounded-2xl flex flex-col justify-between shadow-2xl group hover:border-accent/50 transition-all duration-300"
              >
                <div>
                  <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-2">
                    {item.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold text-text-primary mb-4 font-serif italic">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="w-full h-48 rounded-xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
