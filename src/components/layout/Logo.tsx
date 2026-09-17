'use client';

import React from 'react';
import Link from 'next/link';

export function AnvilHammerIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Ring & Inner Dark Emerald Gradient */}
        <radialGradient id="badgeBg" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#1c4e3f" />
          <stop offset="50%" stopColor="#0a261d" />
          <stop offset="100%" stopColor="#04120e" />
        </radialGradient>

        <linearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffaa" />
          <stop offset="50%" stopColor="#00d68f" />
          <stop offset="100%" stopColor="#005538" />
        </linearGradient>

        {/* 3D Anvil Metallic Gradients */}
        <linearGradient id="anvilTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="40%" stopColor="#cbd5e1" />
          <stop offset="70%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <linearGradient id="anvilBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        <linearGradient id="anvilBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Hammer Metallic & Wood Gradients */}
        <linearGradient id="hammerSteel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id="hammerWood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Drop Shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Circle Badge background with Green Rim */}
      <circle cx="50" cy="50" r="46" fill="url(#badgeBg)" stroke="url(#ringGlow)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="44.5" fill="none" stroke="#00ffaa" strokeWidth="0.5" strokeOpacity="0.4" />

      {/* ANVIL 3D GRAPHIC */}
      <g filter="url(#shadow)">
        {/* Base Floor Shadow */}
        <ellipse cx="50" cy="74" rx="28" ry="5" fill="#000000" opacity="0.5" />

        {/* Anvil Base Block */}
        <path d="M 24 71 L 76 71 L 70 60 L 30 60 Z" fill="url(#anvilBase)" />
        <path d="M 30 60 L 70 60 L 65 52 L 35 52 Z" fill="#334155" />

        {/* Anvil Body (Waist) */}
        <path d="M 35 52 L 65 52 L 60 42 L 40 42 Z" fill="url(#anvilBody)" />

        {/* Anvil Top Surface (Table) & Curved Horn (Left) */}
        <path d="M 12 42 C 20 42 28 42 34 42 L 82 42 C 86 42 88 39 88 37 C 88 35 86 34 82 34 L 12 34 C 18 36 14 40 12 42 Z" fill="url(#anvilBody)" />
        {/* Metallic Top Flat Bevel */}
        <path d="M 30 34 H 82 C 85 34 87 35.5 87 37 C 87 38.5 85 40 82 40 H 32 L 30 34 Z" fill="url(#anvilTop)" />
        {/* Rim Highlight */}
        <path d="M 30 34 H 82 C 85 34 87 34.8 87 35.5 H 31 Z" fill="#ffffff" opacity="0.8" />
      </g>

      {/* HAMMER (MARTELO DE FORJA) */}
      <g filter="url(#shadow)" transform="rotate(-32 50 36)">
        {/* Handle */}
        <rect x="46" y="8" width="8" height="42" rx="3.5" fill="url(#hammerWood)" stroke="#451a03" strokeWidth="0.8" />
        <rect x="48" y="10" width="2" height="38" rx="1" fill="#ffffff" opacity="0.25" />
        
        {/* Metal Head */}
        <rect x="32" y="12" width="36" height="15" rx="3" fill="url(#hammerSteel)" stroke="#1e293b" strokeWidth="1" />
        {/* Bevel Highlight */}
        <rect x="32" y="13" width="6" height="13" rx="1" fill="#ffffff" opacity="0.7" />
        {/* Pin Center */}
        <circle cx="50" cy="19.5" r="2.5" fill="#334155" stroke="#94a3b8" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity group shrink-0">
      <div className={`flex items-center justify-center rounded-full shadow-xl ${sizeClasses[size]}`}>
        <AnvilHammerIcon className="w-full h-full drop-shadow-lg" />
      </div>
      {showText && (
        <span className={`tracking-tight ${textClasses[size]}`}>
          <span className="text-text-primary font-bold">LEAD</span>
          <span className="text-accent font-extrabold">FORGE</span>
        </span>
      )}
    </Link>
  );
}
