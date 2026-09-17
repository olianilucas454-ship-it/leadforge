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
      {/* Anvil Base */}
      <path d="M4 19h16" />
      <path d="M6 19v-2l2-3h8l2 3v2" />
      {/* Anvil Body & Horn */}
      <path d="M3 14h18a1 1 0 0 0 1-1c0-.6-.4-1-1-1h-3l-1.5-3H8.5L7 12H3a1 1 0 0 0-1 1c0 .6.4 1 1 1z" />
      {/* Hammer Head */}
      <path d="M13 2l4.5 4.5-2 2L11 4z" />
      {/* Hammer Handle */}
      <path d="M12.5 5.5L7 11" />
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
    md: 'w-5.5 h-5.5',
    lg: 'w-7 h-7',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group">
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
