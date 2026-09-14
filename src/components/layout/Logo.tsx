'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className={`flex items-center justify-center rounded-lg bg-accent/10 ${sizeClasses[size]}`}>
        <Zap className="text-accent w-3/4 h-3/4" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className={`tracking-tight ${textClasses[size]}`}>
          <span className="text-text-primary font-bold">LEAD</span>
          <span className="text-accent font-bold">FORGE</span>
        </span>
      )}
    </Link>
  );
}
