'use client';

import React from 'react';
import Link from 'next/link';

export function AnvilHammerIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Badge Background Shading */}
        <radialGradient id="badgeBg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1a4738" />
          <stop offset="60%" stopColor="#0d281f" />
          <stop offset="100%" stopColor="#051510" />
        </radialGradient>

        {/* Anvil Silver Metallic Shading */}
        <linearGradient id="anvilBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="35%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        <linearGradient id="anvilHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Hammer Metallic & Wood */}
        <linearGradient id="hammerHead" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id="hammerHandle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Circular Emblem Container */}
      <circle cx="24" cy="24" r="22" fill="url(#badgeBg)" stroke="#00d68f" strokeWidth="1.5" strokeOpacity="0.5" />

      {/* ANVIL (BIGORNA) */}
      {/* Base */}
      <path d="M 12 34 h 24 l -2.5 -5 h -19 z" fill="url(#anvilBody)" />
      {/* Waisted Body */}
      <path d="M 16.5 29 h 15 l -2 -5 h -11 z" fill="#334155" />
      {/* Table & Horn */}
      <path d="M 6 20 C 10 20 14 24 16 24 L 38 24 c 1.5 0 2.5 -1 2.5 -2 c 0 -1 -1 -2 -2.5 -2 H 6 Z" fill="url(#anvilHighlight)" />
      {/* Top face shine */}
      <path d="M 15 20 H 38 V 21 H 16 Z" fill="#ffffff" opacity="0.4" />

      {/* HAMMER (MARTELO) */}
      <g transform="rotate(-30 24 16)">
        {/* Handle */}
        <rect x="22" y="5" width="4" height="18" rx="2" fill="url(#hammerHandle)" />
        {/* Head */}
        <rect x="15" y="6" width="18" height="7" rx="1.5" fill="url(#hammerHead)" stroke="#1e293b" strokeWidth="0.8" />
        <rect x="15" y="7" width="3" height="5" fill="#f8fafc" opacity="0.8" />
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
      <div className={`flex items-center justify-center rounded-full shadow-lg ${sizeClasses[size]}`}>
        <AnvilHammerIcon className="w-full h-full drop-shadow-md" />
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
