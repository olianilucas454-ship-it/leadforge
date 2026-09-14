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
  onUpdateComponentProps?: (componentId: string, props: Record<string, any>) => void;
}

const EditableText: React.FC<{
  text?: string;
  propKey: string;
  componentId: string;
  isEditable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  tagName?: string;
  onUpdateProps?: (componentId: string, updated: Record<string, any>) => void;
  onSelectComponent?: (id: string) => void;
}> = ({ text = '', propKey, componentId, isEditable, className, style, tagName = 'div', onUpdateProps, onSelectComponent }) => {
  const [localText, setLocalText] = React.useState(text);

  React.useEffect(() => {
    setLocalText(text);
  }, [text]);

  const Tag = tagName as any;

  if (!isEditable) {
    return <Tag className={className} style={style}>{localText}</Tag>;
  }

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onFocus={() => {
        onSelectComponent?.(componentId);
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const val = e.currentTarget.innerText.trim();
        if (val !== text && onUpdateProps) {
          onUpdateProps(componentId, { [propKey]: val });
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && ['h1', 'h2', 'h3', 'span', 'button'].includes(tagName)) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectComponent?.(componentId);
      }}
      className={`${className || ''} outline-none focus:ring-2 focus:ring-amber-400 focus:bg-amber-400/20 rounded transition-all hover:ring-2 hover:ring-amber-400/60 cursor-text`}
      style={style}
      title="Clique diretamente para editar este texto com o mouse"
    >
      {localText}
    </Tag>
  );
};

export const SiteRenderer: React.FC<SiteRendererProps> = ({
  site,
  activePageSlug = '/',
  activePageId,
  isEditable = false,
  onSelectComponent,
  selectedComponentId,
  onUpdateComponentProps,
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

  useEffect(() => {
    if (!selectedComponentId) return;
    const targetEl = document.querySelector(`[data-cmp-id="${selectedComponentId}"]`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedComponentId]);

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

    const translateX = cmp.styleOverrides?.translateX ? parseInt(cmp.styleOverrides.translateX, 10) : 0;
    const translateY = cmp.styleOverrides?.translateY ? parseInt(cmp.styleOverrides.translateY, 10) : 0;
    const rotateDeg = cmp.styleOverrides?.rotateDeg ? parseInt(cmp.styleOverrides.rotateDeg, 10) : 0;

    const transformStyle = (translateX || translateY || rotateDeg) ? {
      transform: `translate(${translateX}px, ${translateY}px) rotate(${rotateDeg}deg)`,
      transition: 'transform 0.15s ease-out',
    } : {};

    const CanvaSelectionOverlay = isEditable && isSelected ? (
      <div className="absolute inset-0 border-2 border-amber-400 pointer-events-none rounded z-50 shadow-[0_0_20px_rgba(251,191,36,0.35)]">
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm pointer-events-none" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm pointer-events-none" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm pointer-events-none" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm pointer-events-none" />
        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-amber-400 border border-black rounded-sm pointer-events-none" />
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-amber-400 border border-black rounded-sm pointer-events-none" />
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow-lg uppercase tracking-wider flex items-center gap-1">
          <span>✨ Modo Canva Selecionado</span>
        </div>
      </div>
    ) : null;

    // 1. Hero EcoDream Glass Architecture
    if (variant === 'HeroEcoGlass') {
      const bgImg = props.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800';
      return (
        <div
          key={cmp.id}
          data-cmp-id={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`relative min-h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden ${wrapperClass}`}
          style={{ backgroundColor: designSystem.backgroundColor, color: designSystem.textColor, ...transformStyle }}
        >
          {CanvaSelectionOverlay}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0 scale-105 transition-all duration-1000"
            style={{ backgroundImage: `url(${bgImg})` }}
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 z-0" />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto pt-4 gap-4">
            <div className="flex items-center gap-3 max-w-[200px] sm:max-w-xs md:max-w-sm min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                🌱
              </div>
              <span className="font-bold text-base sm:text-lg text-white tracking-tight truncate" style={{ fontFamily: titleFont }}>
                {site.name || 'EcoDream'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
              <span className="hover:text-emerald-400 transition-colors cursor-pointer">{props.navLink1 || 'Sobre'}</span>
              <span className="hover:text-emerald-400 transition-colors cursor-pointer">{props.navLink2 || 'Serviços'}</span>
              <span className="hover:text-emerald-400 transition-colors cursor-pointer">{props.navLink3 || 'Diferenciais'}</span>
              <span className="hover:text-emerald-400 transition-colors cursor-pointer">{props.navLink4 || 'Contato'}</span>
            </div>

            <button className="px-6 py-2.5 rounded-full border border-slate-200/40 bg-slate-900/60 backdrop-blur-md text-xs font-bold text-white hover:bg-white hover:text-slate-950 transition-all shrink-0 whitespace-nowrap">
              {props.headerCta || 'Contato'}
            </button>
          </div>

          {/* Center Main Area: Asymmetric EcoDream Layout */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 my-auto">
            <div className="lg:col-span-7 space-y-8 text-left">
              <h1
                className={`${(props.title || '').length > 25 ? 'text-3xl sm:text-5xl lg:text-6xl' : 'text-5xl sm:text-7xl lg:text-8xl'} leading-[1.02] tracking-tight font-extrabold uppercase ${getGradientClass(titleGradient || 'emerald')}`}
                style={{ fontFamily: titleFont }}
              >
                {props.title || 'SUA VISÃO DE UM ESTILO DE VIDA SUSTENTÁVEL'}
              </h1>

              <div className="pt-2">
                <a
                  href={props.ctaLink || '#'}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 transition-all"
                >
                  {props.ctaText || 'Lets Explore'}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div className="flex flex-wrap gap-2">
                  {['Sustainable Living', 'Modern Architecture', 'Energy Efficiency'].map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-slate-200 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: titleFont }}>
                    Energy Efficiency & Eco Design
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed" style={{ fontFamily: bodyFont }}>
                    {props.subtitle || 'Our commitment to eco-friendly practices ensures that every home we create is both beautiful and environmentally responsible.'}
                  </p>
                </div>

                <div className="relative h-36 rounded-2xl overflow-hidden border border-white/10 group">
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800"
                    alt="Interior"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Glass Ribbons & Badges */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-4">
            <div className="p-5 rounded-2xl bg-amber-950/40 backdrop-blur-xl border border-amber-500/20 text-left space-y-2">
              <h4 className="text-sm font-bold text-amber-200">Sustainable Materials</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We use the highest quality, sustainable materials to ensure your home minimizes environmental impact.
              </p>
              <span className="inline-block text-xs font-bold text-amber-400 pt-1 cursor-pointer hover:underline">
                Learn more ↗
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-center items-center text-center space-y-2">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
              </div>
              <div className="text-2xl font-extrabold text-white">50+</div>
              <p className="text-xs text-slate-400">Specialists dedicated to sustainable living</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-left space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                We work with you to create a home that meets your unique needs and preferences, blending luxury with sustainability.
              </p>
              <span className="inline-block text-xs font-bold text-emerald-400 pt-1 cursor-pointer hover:underline">
                Learn more ↗
              </span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Hero Archevo Luxury Editorial
    if (variant === 'HeroArchevo') {
      const bgImg = props.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1800';
      return (
        <div
          key={cmp.id}
          data-cmp-id={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`relative min-h-screen flex flex-col justify-between overflow-hidden ${wrapperClass}`}
          style={{ backgroundColor: '#0B0A08', color: '#F5F2EB', ...transformStyle }}
        >
          {CanvaSelectionOverlay}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0 transition-all duration-1000"
            style={{ backgroundImage: `url(${bgImg})` }}
          />
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />

          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 gap-4">
            <div className="flex items-center gap-3 max-w-[200px] sm:max-w-xs md:max-w-sm min-w-0">
              <div className="w-7 h-7 shrink-0 border border-amber-400/60 rotate-45 flex items-center justify-center">
                <span className="text-[10px] text-amber-300 font-bold -rotate-45">
                  {(site.name || 'A')[0].toUpperCase()}
                </span>
              </div>
              <span className="font-bold text-lg sm:text-xl uppercase tracking-widest text-white truncate" style={{ fontFamily: 'Bodoni Moda, serif' }}>
                {site.name || 'ARCHEVO'}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-10 text-xs tracking-[0.2em] font-semibold text-slate-300 uppercase">
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink1 || 'Projetos'}</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink2 || 'Serviços'}</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink3 || 'Sobre'}</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink4 || 'Contato'}</span>
            </div>

            <button className="px-6 py-2.5 border border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-black font-bold text-xs uppercase tracking-[0.2em] transition-all shrink-0 whitespace-nowrap">
              {props.headerCta || 'Falar Conosco ↗'}
            </button>
          </div>

          {/* Main Editorial Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 my-auto py-16 w-full space-y-8 text-left">
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-amber-400 font-bold">
              {props.badge || 'ARCHITECTURE • INTERIORS • DESIGN'}
            </div>

            <h1
              className={`${(props.title || '').length > 25 ? 'text-3xl sm:text-5xl lg:text-6xl' : 'text-5xl sm:text-7xl lg:text-8xl'} leading-[1.05] max-w-4xl text-amber-100 font-normal tracking-normal`}
              style={{ fontFamily: titleFont || 'Bodoni Moda, serif' }}
            >
              {props.title || 'Architecture that inspires. Spaces that live.'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed" style={{ fontFamily: bodyFont }}>
              {props.subtitle || 'We craft timeless architecture and intelligent spaces that blend beauty, function, and sustainability — built around human experience.'}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a
                href={props.ctaLink || '#'}
                className="px-9 py-4 bg-amber-200/90 hover:bg-amber-100 text-slate-950 font-bold text-xs uppercase tracking-[0.2em] shadow-2xl transition-all"
              >
                {props.ctaText || 'Explore Projects ↗'}
              </a>

              <button className="flex items-center gap-3 px-6 py-4 border border-white/20 text-white hover:border-amber-400 font-bold text-xs uppercase tracking-[0.2em] transition-all">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-amber-400 text-xs">
                  ▶
                </div>
                {props.secondaryCtaText || 'Watch Showreel'}
              </button>
            </div>
          </div>

          {/* Bottom Metric Ribbon */}
          <div className="relative z-10 w-full border-t border-white/10 bg-black/70 backdrop-blur-md py-6 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-left">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-normal text-amber-200" style={{ fontFamily: 'Bodoni Moda, serif' }}>120+</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Projects Completed</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-normal text-amber-200" style={{ fontFamily: 'Bodoni Moda, serif' }}>15+</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Years of Experience</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-normal text-amber-200" style={{ fontFamily: 'Bodoni Moda, serif' }}>80+</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Experts & Designers</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-normal text-amber-200" style={{ fontFamily: 'Bodoni Moda, serif' }}>12</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Countries Worked</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. Hero Lavilla Luxury Real Estate Overlay
    if (variant === 'HeroLavilla') {
      const bgImg = props.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1800';
      return (
        <div
          key={cmp.id}
          data-cmp-id={cmp.id}
          onClick={() => isEditable && onSelectComponent?.(cmp.id)}
          className={`relative min-h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden ${wrapperClass}`}
          style={{ backgroundColor: '#030A14', color: '#FFFFFF', ...transformStyle }}
        >
          {CanvaSelectionOverlay}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0 transition-all duration-1000 scale-105"
            style={{ backgroundImage: `url(${bgImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/30 to-black/50 z-0" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto pt-4 gap-4">
            <div className="flex items-center gap-3 max-w-[200px] sm:max-w-xs md:max-w-sm min-w-0">
              <span className="font-extrabold text-lg sm:text-2xl tracking-widest text-white uppercase truncate" style={{ fontFamily: titleFont }}>
                {site.name || 'LAVILLA'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest text-slate-200 uppercase">
              <EditableText text={props.navLink1 || 'SOBRE'} propKey="navLink1" componentId={cmp.id} isEditable={isEditable} onUpdateProps={onUpdateComponentProps} onSelectComponent={onSelectComponent} tagName="span" className="hover:text-sky-400 transition-colors cursor-pointer" />
              <EditableText text={props.navLink2 || 'SERVIÇOS'} propKey="navLink2" componentId={cmp.id} isEditable={isEditable} onUpdateProps={onUpdateComponentProps} onSelectComponent={onSelectComponent} tagName="span" className="hover:text-sky-400 transition-colors cursor-pointer" />
              <EditableText text={props.navLink3 || 'PROJETOS'} propKey="navLink3" componentId={cmp.id} isEditable={isEditable} onUpdateProps={onUpdateComponentProps} onSelectComponent={onSelectComponent} tagName="span" className="hover:text-sky-400 transition-colors cursor-pointer" />
              <EditableText text={props.navLink4 || 'DIFERENCIAIS'} propKey="navLink4" componentId={cmp.id} isEditable={isEditable} onUpdateProps={onUpdateComponentProps} onSelectComponent={onSelectComponent} tagName="span" className="hover:text-sky-400 transition-colors cursor-pointer" />
            </div>

            <button className="px-6 py-2.5 border border-white/30 rounded bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all shrink-0 whitespace-nowrap">
              <EditableText text={props.headerCta || props.ctaText || 'AGENDAR HORÁRIO'} propKey="headerCta" componentId={cmp.id} isEditable={isEditable} onUpdateProps={onUpdateComponentProps} onSelectComponent={onSelectComponent} tagName="span" />
            </button>
          </div>

          {/* Bottom Content Row */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 mt-auto">
            <div className="lg:col-span-7 space-y-4 text-left">
              <EditableText
                text={props.title || 'RESIDÊNCIAS EXCLUSIVAS'}
                propKey="title"
                componentId={cmp.id}
                isEditable={isEditable}
                onUpdateProps={onUpdateComponentProps}
                onSelectComponent={onSelectComponent}
                className={`${(props.title || '').length > 30 ? 'text-2xl sm:text-4xl lg:text-5xl max-w-2xl' : (props.title || '').length > 18 ? 'text-3xl sm:text-5xl lg:text-6xl max-w-3xl' : 'text-5xl sm:text-7xl lg:text-8xl max-w-4xl'} font-extrabold tracking-tight leading-tight uppercase text-white drop-shadow-2xl`}
                style={{ fontFamily: titleFont || 'Outfit, sans-serif' }}
                tagName="h1"
              />

              <EditableText
                text={props.subtitle || 'Imóveis de alto padrão e empreendimentos selecionados.'}
                propKey="subtitle"
                componentId={cmp.id}
                isEditable={isEditable}
                onUpdateProps={onUpdateComponentProps}
                onSelectComponent={onSelectComponent}
                className="text-base sm:text-lg font-light text-slate-200 tracking-wide max-w-xl"
                style={{ fontFamily: bodyFont }}
                tagName="p"
              />
            </div>

            <div className="lg:col-span-5">
              <div className="p-5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 grid grid-cols-2 gap-3 text-center shadow-2xl">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-white">120+</div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-1">Imóveis Nobres</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-sky-400">15+ <span className="text-xs">ANOS</span></div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-1">Tradição</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-white">98%</div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-1">Satisfação VIP</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-amber-400">4.9★</div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-1">Avaliação Google</div>
                </div>
              </div>
            </div>
          </div>
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
          data-cmp-id={cmp.id}
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

          {/* Top Bar Header */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 gap-4">
            <div className="flex items-center gap-3 max-w-[200px] sm:max-w-xs md:max-w-sm min-w-0">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white uppercase truncate" style={{ fontFamily: titleFont }}>
                {site.name || 'EXCLUSIVA'}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-xs tracking-[0.2em] font-semibold text-slate-300 uppercase">
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink1 || 'INÍCIO'}</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink2 || 'SERVIÇOS'}</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink3 || 'SOBRE'}</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">{props.navLink4 || 'CONTATO'}</span>
            </div>

            <button className="px-5 py-2.5 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-black transition-all shrink-0 whitespace-nowrap">
              {props.headerCta || props.ctaText || 'AGENDAR HORÁRIO'}
            </button>
          </div>

          {/* Content Container */}
          <div className={`relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center space-y-6 ${alignClass} pt-12`}>
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
              className={`leading-[1.08] transition-all ${titleWeight} ${trackingClass} ${isItalic ? 'italic' : ''} ${isUppercase ? 'uppercase' : ''} ${getGradientClass(titleGradient)} ${fontSizeClass || ((props.title || '').length > 25 ? 'text-3xl sm:text-5xl lg:text-6xl' : 'text-4xl sm:text-6xl lg:text-7xl xl:text-8xl')}`}
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
