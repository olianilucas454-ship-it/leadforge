'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'hot' | 'warm' | 'cold' | 'success' | 'info' | 'default';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', dot = false, children, ...props }, ref) => {
    const variants = {
      hot: 'bg-red-500/15 text-red-500 border border-red-500/20',
      warm: 'bg-orange-500/15 text-orange-500 border border-orange-500/20',
      cold: 'bg-blue-500/15 text-blue-500 border border-blue-500/20',
      success: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20',
      info: 'bg-sky-500/15 text-sky-500 border border-sky-500/20',
      default: 'bg-surface-hover text-text-secondary border border-border',
    };

    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
    };

    const dotColors = {
      hot: 'bg-red-500',
      warm: 'bg-orange-500',
      cold: 'bg-blue-500',
      success: 'bg-emerald-500',
      info: 'bg-sky-500',
      default: 'bg-text-secondary',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
