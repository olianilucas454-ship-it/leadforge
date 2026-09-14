'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'line';
  count?: number;
}

export function Skeleton({ className, variant = 'text', count = 1, ...props }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-6 w-3/4 rounded',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-48 w-full rounded-xl',
    line: 'h-3 w-full rounded',
  };

  const getWidthClass = (index: number, v: string) => {
    if (v !== 'text' && v !== 'line') return '';
    // slight width variation for text lines if count > 1
    if (count > 1) {
      if (index === count - 1) return 'w-2/3';
      if (index % 2 === 1) return 'w-[90%]';
    }
    return '';
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-surface-hover animate-pulse',
            variants[variant],
            getWidthClass(i, variant),
            className
          )}
          {...props}
        />
      ))}
    </div>
  );
}
