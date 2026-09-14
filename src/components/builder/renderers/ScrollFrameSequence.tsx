'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollFrameSequenceProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  frameCount?: number;
  imagePattern?: string;
  sticky?: boolean;
}

export const ScrollFrameSequence: React.FC<ScrollFrameSequenceProps> = ({
  title = 'EXPERIÊNCIA CINEMATOGRÁFICA EM FRAMES',
  subtitle = 'Cada movimento do scroll direciona a narrativa visual com alta fidelidade.',
  badge = 'SCROLL-DRIVEN EXPERIENCE',
  frameCount = 30,
  sticky = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
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

      const frame = Math.min(frameCount - 1, Math.floor(progress * frameCount));
      setCurrentFrameIndex(frame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [frameCount]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${sticky ? 'h-[250vh]' : 'min-h-screen'} bg-[#07080C] text-white`}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-6">
        {/* Background Frame / Cinematic Graphic Representation */}
        <div className="absolute inset-0 z-0 opacity-40 transition-transform duration-300 flex items-center justify-center">
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-300 scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600')`,
              filter: `blur(${Math.max(0, 8 - scrollProgress * 10)}px) brightness(${0.5 + scrollProgress * 0.5})`,
              transform: `scale(${1 + scrollProgress * 0.15}) rotate(${scrollProgress * 2}deg)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-[#07080C]" />
        </div>

        {/* Floating Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-xs uppercase tracking-widest">
            {badge} — FRAME {currentFrameIndex + 1}/{frameCount} ({Math.round(scrollProgress * 100)}%)
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight font-serif italic">
            {title}
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Interactive Progress Indicator */}
          <div className="w-64 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
