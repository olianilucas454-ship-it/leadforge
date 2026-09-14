'use client';

import React, { useEffect } from 'react';
import { SiteSchema, SiteComponentSchema } from '../../../lib/types/siteBuilder';
import { ScrollFrameSequence } from './ScrollFrameSequence';
import { HorizontalScrollSection } from './HorizontalScrollSection';
import { WebGLCanvas } from './WebGLCanvas';
import { loadAllSiteFonts } from '../../../lib/utils/fontLoader';
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

  useEffect(() => {
    if (!currentPage) return;
    const fontsToLoad = [
      designSystem.headingFont,
      designSystem.bodyFont,
      ...currentPage.sections.flatMap((s) => s.components.map((c) => c.styleOverrides?.titleFontFamily)),
      ...currentPage.sections.flatMap((s) => s.components.map((c) => c.styleOverrides?.bodyFontFamily)),
    ];
    loadAllSiteFonts(fontsToLoad);
  }, [site, currentPage, designSystem]);

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
      isSelected ? 'ring-2 ring-amber-400 ring-offset-4 ring-offset-black' : isEditable ? 'hover:outline hover:outline-1 hover:outline-amber-500/50' : ''
    }`;

    const alignClass = cmp.styleOverrides?.textAlign === 'center' ? 'text-center items-center justify-center mx-auto' :
                      cmp.styleOverrides?.textAlign === 'right' ? 'text-right items-end justify-end ml-auto' :
                      cmp.styleOverrides?.textAlign === 'justify' ? 'text-justify' : 'text-left';
    const widthClass = cmp.styleOverrides?.maxWidth || 'max-w-xl';
    const fontSizeClass = cmp.styleOverrides?.fontSize || '';

    const titleFont = cmp.styleOverrides?.titleFontFamily || designSystem.headingFont;
    const bodyFont = cmp.styleOverrides?.bodyFontFamily || designSystem.bodyFont;
    const titleWeight = cmp.styleOverrides?.fontWeight || 'font-bold';
    const isItalic = cmp.styleOverrides?.fontStyle === 'italic';
    const isUppercase = cmp.styleOverrides?.textTransform === 'uppercase';
    const trackingClass = cmp.styleOverrides?.letterSpacing || 'tracking-tight';
    const titleGradient = cmp.styleOverrides?.gradient || (variant === 'HeroLuxury' ? 'gold' : 'none');

    const getGradientClass = (grad: string) => {
      switch (grad) {
        case 'gold':
          return 'bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent';
        case 'silver':
          return 'bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent';
        case 'cyan':
          return 'bg-gradient-to-r from-sky-200 via-cyan-400 to-blue-500 bg-clip-text text-transparent';
        case 'emerald':
          return 'bg-gradient-to-r from-emerald-200 via-teal-400 to-emerald-600 bg-clip-text text-transparent';
        default:
          return '';
      }
    };

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
          {/* Ambient Lighting Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none z-0" />

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
          <div className={`relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center space-y-6 ${alignClass}`}>
            {props.badge && (
              <span
                className="inline-block px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-[0.25em] border backdrop-blur-md shadow-lg shadow-amber-500/10"
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
              className={`leading-[1.08] transition-all ${titleWeight} ${trackingClass} ${isItalic ? 'italic' : ''} ${isUppercase ? 'uppercase' : ''} ${getGradientClass(titleGradient)} ${fontSizeClass || 'text-4xl sm:text-6xl lg:text-7xl xl:text-8xl'}`}
              style={{
                fontFamily: titleFont,
                color: titleGradient && titleGradient !== 'none' ? undefined : (cmp.styleOverrides?.color || undefined),
                marginTop: cmp.styleOverrides?.marginTop || undefined,
                marginBottom: cmp.styleOverrides?.marginBottom || undefined,
              }}
            >
              {props.title}
            </h1>

            <p
              className={`text-base sm:text-xl leading-relaxed text-slate-300 ${widthClass}`}
              style={{ fontFamily: bodyFont }}
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

    // About Section
    if (cmp.category === 'about') {
      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`py-28 px-6 md:px-12 border-t border-white/5 relative ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor, color: designSystem.textColor }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              {props.badge && (
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold block" style={{ color: designSystem.accentColor }}>
                  {props.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-bold italic" style={{ fontFamily: designSystem.headingFont }}>
                {props.title}
              </h2>
              <p className="text-lg leading-relaxed text-slate-300 font-sans">
                {props.subtitle || props.description}
              </p>
              {props.description && props.subtitle && (
                <p className="text-sm leading-relaxed text-slate-400 font-sans">
                  {props.description}
                </p>
              )}

              {/* Stats inline */}
              {props.stats && props.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                  {props.stats.map((st: any, idx: number) => (
                    <div key={idx}>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: designSystem.accentColor }}>
                        {st.number}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {props.image && (
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img
                    src={props.image}
                    alt={props.title || 'Sobre Nós'}
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

    // Team / Mestres Section
    if (cmp.category === 'team') {
      const teamList = props.items || [
        { name: 'Mestre Visagista', role: 'Fundador & Master Barber', specialty: 'Cortes Autorais & Navalha', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800' },
        { name: 'Especialista VIP', role: 'Senior Stylist', specialty: 'Tratamentos & Coloração', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
        { name: 'Consultor de Imagem', role: 'Stylist & Visagismo', specialty: 'Barboterapia & Alinhamento', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
      ];

      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`py-28 px-6 md:px-12 border-t border-white/5 ${wrapperClass}`}
          style={{ backgroundColor: designSystem.surfaceColor, color: designSystem.textColor }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              {props.badge && (
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold block" style={{ color: designSystem.accentColor }}>
                  {props.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-bold italic" style={{ fontFamily: designSystem.headingFont }}>
                {props.title || 'Nossos Profissionais & Mestres'}
              </h2>
              <p className="text-base text-slate-400">
                {props.subtitle || 'Especialistas renomados dedicados a entregar a sua melhor versão.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamList.map((member: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-white/10 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-slate-900">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20" style={{ color: designSystem.accentColor }}>
                        {member.specialty}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold" style={{ fontFamily: designSystem.headingFont }}>
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{member.role}</p>
                    </div>

                    <a
                      href={member.whatsapp ? `https://wa.me/55${member.whatsapp.replace(/\D/g, '')}` : (props.ctaLink || '#')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded border text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-102"
                      style={{
                        borderColor: `${designSystem.accentColor}50`,
                        color: designSystem.accentColor,
                        backgroundColor: `${designSystem.accentColor}10`,
                      }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Agendar com {member.name.split(' ')[0]}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Gallery / Fotos Section
    if (cmp.category === 'gallery') {
      const galleryList = props.items || [
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800', title: 'Ambiente Principal' },
        { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800', title: 'Camarim VIP' },
        { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', title: 'Degustação & Recepção' },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', title: 'Atelier de Detalhes' },
      ];

      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`py-28 px-6 md:px-12 border-t border-white/5 ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor, color: designSystem.textColor }}
        >
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              {props.badge && (
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold block" style={{ color: designSystem.accentColor }}>
                  {props.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-bold italic" style={{ fontFamily: designSystem.headingFont }}>
                {props.title || 'Galeria de Fotos do Espaço'}
              </h2>
              <p className="text-base text-slate-400">
                {props.subtitle || 'Cada m² foi projetado para elevar o conforto e a experiência.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryList.map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-[4/5] rounded-xl overflow-hidden group shadow-2xl border border-white/10 bg-slate-900"
                >
                  <img
                    src={img.url}
                    alt={img.title || `Foto ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-xs font-bold text-white font-mono">{img.title}</span>
                    {img.caption && <span className="text-[11px] text-slate-300">{img.caption}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Testimonials / Prova Social Section
    if (cmp.category === 'testimonials') {
      const testimonialsList = props.items || [
        { clientName: 'Carlos Eduardo', city: 'São Paulo, SP', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', quote: 'Atendimento espetacular. O nível de cuidado com o visagismo e o ambiente é incomparável.' },
        { clientName: 'Fernanda Lima', city: 'Rio de Janeiro, RJ', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', quote: 'Lugar impecável! Pontualidade, ambiente acolhedor e profissionais que entendem exatamente o que você precisa.' },
        { clientName: 'Lucas Mendes', city: 'Campinas, SP', rating: 5, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', quote: 'Vale cada centavo. Experiência de agência de alto padrão que realmente fideliza o cliente.' },
      ];

      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`py-28 px-6 md:px-12 border-t border-white/5 ${wrapperClass}`}
          style={{ backgroundColor: designSystem.surfaceColor, color: designSystem.textColor }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              {props.badge && (
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold block" style={{ color: designSystem.accentColor }}>
                  {props.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-bold italic" style={{ fontFamily: designSystem.headingFont }}>
                {props.title || 'Depoimentos de Clientes'}
              </h2>
              <p className="text-base text-slate-400">
                {props.subtitle || 'Avaliações reais de quem já vivenciou nossa experiência autoral.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonialsList.map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed text-slate-300 font-serif">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <img
                      src={t.avatar}
                      alt={t.clientName}
                      className="w-11 h-11 rounded-full object-cover border border-amber-500/40"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{t.clientName}</div>
                      <div className="text-xs text-slate-400 font-mono">{t.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Stats Section
    if (cmp.category === 'stats') {
      const statsList = props.stats || props.items || [
        { number: '10.000+', label: 'Clientes Atendidos' },
        { number: '15 Anos', label: 'Tradição & Visagismo' },
        { number: '4.9 ★', label: 'Google Review' },
        { number: '100%', label: 'Garantia de Satisfação' },
      ];

      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`py-20 px-6 md:px-12 border-t border-b border-white/10 ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsList.map((st: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl sm:text-6xl font-extrabold font-mono" style={{ color: designSystem.accentColor }}>
                  {st.number}
                </div>
                <div className="text-xs text-slate-300 uppercase tracking-widest font-mono">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // FAQ Section
    if (cmp.category === 'faq') {
      const faqList = props.items || [
        { question: 'Como funciona o agendamento de horários?', answer: 'Você pode agendar diretamente pelo WhatsApp ou selecionar o horário desejado em nosso menu digital.' },
        { question: 'Quais formas de pagamento são aceitas?', answer: 'Aceitamos Cartão de Crédito em até 12x, Pix com desconto e Dinheiro.' },
        { question: 'Existe estacionamento no local?', answer: 'Sim, oferecemos serviço de valet gratuito para todos os nossos clientes.' },
      ];

      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`py-28 px-6 md:px-12 border-t border-white/5 ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor, color: designSystem.textColor }}
        >
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              {props.badge && (
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold block" style={{ color: designSystem.accentColor }}>
                  {props.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-bold italic" style={{ fontFamily: designSystem.headingFont }}>
                {props.title || 'Perguntas Frequentes'}
              </h2>
            </div>

            <div className="space-y-4">
              {faqList.map((faq: any, idx: number) => (
                <div key={idx} className="p-6 rounded-xl border border-white/10 bg-slate-950/60 space-y-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-sm text-slate-400 pl-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Contact Section
    if (cmp.category === 'contact') {
      return (
        <div
          key={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`py-28 px-6 md:px-12 border-t border-white/5 ${wrapperClass}`}
          style={{ backgroundColor: designSystem.surfaceColor, color: designSystem.textColor }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              {props.badge && (
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold block" style={{ color: designSystem.accentColor }}>
                  {props.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-bold italic" style={{ fontFamily: designSystem.headingFont }}>
                {props.title || 'Localização & Atendimento'}
              </h2>
              <p className="text-base text-slate-300">
                {props.subtitle || 'Venha vivenciar a experiência presencialmente ou tire suas dúvidas via WhatsApp.'}
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 text-sm text-slate-300 font-mono">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-amber-400" />
                  <span>WhatsApp: {props.whatsappNumber || '(11) 99999-9999'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>Atendimento: Segunda a Sábado das 09h às 20h</span>
                </div>
              </div>

              {props.ctaText && (
                <div className="pt-4">
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
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {props.ctaText}
                  </a>
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900 flex items-center justify-center">
                <img
                  src={props.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200'}
                  alt="Mapa / Localização"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="px-4 py-2 rounded bg-black/80 text-white font-mono text-xs border border-white/20">
                    📍 {site.leadData?.city || 'São Paulo'} — {site.leadData?.address || 'Jardins'}
                  </span>
                </div>
              </div>
            </div>
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
