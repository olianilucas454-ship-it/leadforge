'use client';

import React from 'react';
import Link from 'next/link';

export function AnvilHammerIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Base da Bigorna */}
      <path d="M4 18h16" />
      <path d="M6.5 18l1.5-3h8l1.5 3" />
      {/* Corpo & Bico da Bigorna */}
      <path d="M3 15h18c.6 0 1-.4 1-1s-.4-1-1-1h-3.5l-1.5-3H8l-1.5 3H3c-.6 0-1 .4-1 1s.4 1 1 1z" />
      {/* Cabeça do Martelo */}
      <path d="M12.5 2.5l4 4-2 2L10.5 4.5z" />
      {/* Cabo do Martelo */}
      <path d="M11.5 5.5L6.5 10.5" />
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
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group shrink-0">
      <div className={`flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent/20 transition-all ${sizeClasses[size]}`}>
        <AnvilHammerIcon className={`${iconClasses[size]} text-accent`} />
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
