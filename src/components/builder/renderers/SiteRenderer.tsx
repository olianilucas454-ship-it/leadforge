'use client';

import React from 'react';
import { SiteSchema, SiteComponentSchema } from '../../../lib/types/siteBuilder';
import { ScrollFrameSequence } from './ScrollFrameSequence';
import { HorizontalScrollSection } from './HorizontalScrollSection';
import { WebGLCanvas } from './WebGLCanvas';
import { ArrowRight, Phone, MessageCircle, Star, CheckCircle2 } from 'lucide-react';

interface SiteRendererProps {
  site: SiteSchema;
  activePageSlug?: string;
  activePageId?: string;
  isEditable?: boolean;
  onSelectComponent?: (id: string) => void;
  selectedComponentId?: string | null;
}

export const SiteRenderer: React.FC<SiteRendererProps> = ({
  site,
  activePageSlug = '/',
  activePageId,
  isEditable = false,
  onSelectComponent,
  selectedComponentId,
}) => {
  const { designSystem } = site;
  const currentPage = activePageId
    ? site.pages.find((p) => p.id === activePageId) || site.pages[0]
    : site.pages.find((p) => p.slug === activePageSlug) || site.pages[0];

  if (!currentPage) {
    return (
      <div className="p-12 text-center text-slate-400">
        Nenhuma página encontrada para renderização.
      </div>
    );
  }

  const renderComponent = (cmp: SiteComponentSchema) => {
    const isSelected = selectedComponentId === cmp.id;
    const { props, variant } = cmp;

    const wrapperClass = `relative group transition-all ${
      isEditable ? 'cursor-pointer' : ''
    } ${
      isSelected ? 'ring-2 ring-emerald-400 ring-offset-4 ring-offset-black' : isEditable ? 'hover:outline hover:outline-1 hover:outline-emerald-500/50' : ''
    }`;

    const alignClass = cmp.styleOverrides?.textAlign === 'center' ? 'text-center items-center justify-center mx-auto' :
                      cmp.styleOverrides?.textAlign === 'right' ? 'text-right items-end justify-end ml-auto' :
                      cmp.styleOverrides?.textAlign === 'justify' ? 'text-justify' : 'text-left';
    const widthClass = cmp.styleOverrides?.maxWidth || 'max-w-xl';
    const fontSizeClass = cmp.styleOverrides?.fontSize || '';

    // Render specialized components by variant
    if (variant === 'HeroCinematic') {
      return (
        <div key={cmp.id} onClick={() => isEditable && onSelectComponent?.(cmp.id)} className={wrapperClass}>
          <ScrollFrameSequence
            title={props.title}
            subtitle={props.subtitle}
            badge={props.badge}
          />
        </div>
      );
    }

    if (variant === 'HorizontalScroll') {
      return (
        <div key={cmp.id} onClick={() => isEditable && onSelectComponent?.(cmp.id)} className={wrapperClass}>
          <HorizontalScrollSection title={props.title} items={props.items as any} />
        </div>
      );
    }

    // Hero Variants
    if (variant === 'HeroFullScreen' || variant === 'HeroVideo' || variant === 'HeroLuxury' || variant === 'HeroRestaurant' || variant === 'HeroArchitecture') {
      const overlayOpacity = (props.overlayOpacity ?? 60) / 100;
      const overlayBg = props.overlayColor || '#000000';
      const isVideo = variant === 'HeroVideo' || !!props.videoUrl;

      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 overflow-hidden ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor, color: designSystem.textColor }}
        >
          {/* Background Image or Video */}
          {isVideo && props.videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              src={props.videoUrl}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          ) : props.image ? (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-no-repeat z-0 transition-all duration-700"
              style={{
                backgroundImage: `url(${props.image})`,
                backgroundPosition: props.focalPoint || 'center',
              }}
            />
          ) : null}

          {/* Color/Gradient Overlay */}
          <div
            className="absolute inset-0 z-0 transition-opacity"
            style={{
              backgroundColor: overlayBg,
              opacity: overlayOpacity,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0 pointer-events-none" />

          {/* Content Container */}
          <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center space-y-6">
            {props.badge && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.25em] border backdrop-blur-md"
                style={{
                  backgroundColor: `${designSystem.accentColor}20`,
                  borderColor: `${designSystem.accentColor}50`,
                  color: designSystem.accentColor,
                }}
              >
                {props.badge}
              </span>
            )}

            <h1
              className={`font-bold tracking-tight leading-[1.08] italic ${fontSizeClass || 'text-4xl sm:text-6xl lg:text-7xl xl:text-8xl'}`}
              style={{ fontFamily: designSystem.headingFont }}
            >
              {props.title}
            </h1>

            <p
              className={`text-base sm:text-xl leading-relaxed text-slate-300 ${widthClass}`}
              style={{ fontFamily: designSystem.bodyFont }}
            >
              {props.subtitle || props.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center justify-center">
              {props.ctaText && (
                <a
                  href={props.ctaLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-9 py-4 font-bold text-xs uppercase tracking-[0.2em] shadow-2xl transition-transform hover:scale-105"
                  style={{
                    backgroundColor: designSystem.accentColor,
                    color: designSystem.backgroundColor,
                    borderRadius: designSystem.borderRadius,
                  }}
                >
                  {props.ctaText}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              )}

              {props.secondaryCtaText && (
                <a
                  href={props.secondaryCtaLink || '#'}
                  className="inline-flex items-center justify-center px-9 py-4 font-bold text-xs uppercase tracking-[0.2em] border backdrop-blur-md transition-colors hover:border-accent"
                  style={{
                    borderColor: `${designSystem.textColor}40`,
                    color: designSystem.textColor,
                    borderRadius: designSystem.borderRadius,
                  }}
                >
                  {props.secondaryCtaText}
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'HeroSplit' || variant === 'HeroMinimal') {
      return (
        <div
          key={cmp.id}
          onClick={() => onSelectComponent?.(cmp.id)}
          className={`relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12 overflow-hidden ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor, color: designSystem.textColor }}
        >
          {/* WebGL background for experimental level */}
          {site.experienceLevel === 'experimental' && (
            <WebGLCanvas particleCount={40} accentColor={designSystem.accentColor} />
          )}

          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-7 space-y-6 flex flex-col ${alignClass}`}>
              {props.badge && (
                <span
                  className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-widest border"
                  style={{
                    backgroundColor: `${designSystem.accentColor}15`,
                    borderColor: `${designSystem.accentColor}40`,
                    color: designSystem.accentColor,
                  }}
                >
                  {props.badge}
                </span>
              )}

              <h1 className={`font-bold tracking-tight leading-[1.1] font-serif italic ${fontSizeClass || 'text-4xl sm:text-6xl lg:text-7xl'}`}>
                {props.title}
              </h1>

              <p className={`text-lg sm:text-xl leading-relaxed ${widthClass}`} style={{ color: designSystem.mutedColor }}>
                {props.subtitle || props.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {props.ctaText && (
                  <a
                    href={props.ctaLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 font-bold text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-xl"
                    style={{
                      backgroundColor: designSystem.accentColor,
                      color: designSystem.backgroundColor,
                      borderRadius: designSystem.borderRadius,
                    }}
                  >
                    {props.ctaText}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                )}

                {props.secondaryCtaText && (
                  <a
                    href={props.secondaryCtaLink || '#'}
                    className="inline-flex items-center justify-center px-8 py-4 font-bold text-xs uppercase tracking-widest border transition-colors hover:border-accent"
                    style={{
                      borderColor: `${designSystem.textColor}30`,
                      color: designSystem.textColor,
                      borderRadius: designSystem.borderRadius,
                    }}
                  >
                    {props.secondaryCtaText}
                  </a>
                )}
              </div>
            </div>

            {props.image && (
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img
                    src={props.image}
                    alt={props.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (variant === 'ServicesInteractive' || cmp.category === 'services') {
      return (
        <div
          key={cmp.id}
          onClick={() => onSelectComponent?.(cmp.id)}
          className={`py-32 px-6 md:px-12 border-t border-white/5 ${wrapperClass}`}
          style={{ backgroundColor: designSystem.surfaceColor, color: designSystem.textColor }}
        >
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-left">
              {props.badge && (
                <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: designSystem.accentColor }}>
                  {props.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-bold font-serif italic">{props.title}</h2>
              {props.subtitle && (
                <p className="text-base text-slate-400 mt-2 max-w-xl">{props.subtitle}</p>
              )}
            </div>

            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {props.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:px-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-sm text-slate-500 font-bold">0{idx + 1}</span>
                    <div>
                      <h3 className="text-2xl font-bold font-serif group-hover:text-accent transition-colors" style={{ color: designSystem.textColor }}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xl font-bold font-mono" style={{ color: designSystem.accentColor }}>
                      {item.price}
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'CtaMinimal' || cmp.category === 'cta') {
      return (
        <div
          key={cmp.id}
          onClick={() => onSelectComponent?.(cmp.id)}
          className={`py-28 px-6 text-center border-t border-white/10 relative overflow-hidden ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor, color: designSystem.textColor }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${designSystem.accentColor}20` }} />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-serif italic">
              {props.title}
            </h2>
            {props.subtitle && <p className="text-lg text-slate-400">{props.subtitle}</p>}
            {props.ctaText && (
              <a
                href={props.ctaLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-5 font-bold text-xs uppercase tracking-[0.2em] shadow-2xl transition-transform hover:scale-105"
                style={{
                  backgroundColor: designSystem.accentColor,
                  color: designSystem.backgroundColor,
                  borderRadius: designSystem.borderRadius,
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {props.ctaText}
              </a>
            )}
          </div>
        </div>
      );
    }

    // Default Fallback Renderer
    return (
      <div key={cmp.id} onClick={() => onSelectComponent?.(cmp.id)} className={`py-16 px-6 border-b border-white/10 ${wrapperClass}`}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-bold font-serif">{props.title || cmp.name}</h3>
          <p className="text-sm text-slate-400">{props.subtitle || props.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden font-sans selection:bg-accent selection:text-black">
      {currentPage.sections.map((section) => (
        <section key={section.id} id={section.id}>
          {section.components.map(renderComponent)}
        </section>
      ))}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-xs text-slate-500 font-mono" style={{ backgroundColor: designSystem.backgroundColor }}>
        © {new Date().getFullYear()} {site.name} — Criado com LeadForge Website Experience Engine.
      </footer>
    </div>
  );
};
