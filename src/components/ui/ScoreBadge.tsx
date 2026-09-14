'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ScoreBadgeProps {
  score: number;
  classification: 'hot' | 'warm' | 'cold';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ScoreBadge({
  score,
  classification,
  size = 'md',
  showLabel = false,
  className
}: ScoreBadgeProps) {
  const safeScore = Math.min(100, Math.max(0, score));

  const styles = {
    hot: 'text-red-500 bg-red-500/10 border-red-500/20',
    warm: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    cold: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  };

  const labels = {
    hot: 'HOT',
    warm: 'WARM',
    cold: 'COLD',
  };

  const emojis = {
    hot: '🔥',
    warm: '🟠',
    cold: '🟢',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-bold border transition-colors',
        styles[classification],
        sizes[size],
        className
      )}
    >
      <span className="flex-shrink-0" role="img" aria-label={classification}>
        {emojis[classification]}
      </span>
      <span>{safeScore}/100</span>
      {showLabel && (
        <>
          <span className="w-px h-em bg-current opacity-30 mx-0.5" />
          <span className="uppercase tracking-wider">{labels[classification]}</span>
        </>
      )}
    </div>
  );
}
