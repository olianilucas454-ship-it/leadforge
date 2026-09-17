'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'highlighted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface/80 backdrop-blur-md border border-border/80 rounded-xl',
      interactive: 'bg-surface/80 backdrop-blur-md border border-border/80 rounded-xl hover:border-accent/40 hover:bg-surface-hover/90 cursor-pointer transition-all duration-200 shadow-lg',
      highlighted: 'bg-accent/10 backdrop-blur-md border border-accent/30 rounded-xl shadow-lg shadow-accent/5',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
