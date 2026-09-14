'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'search';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, variant = 'default', ...props }, ref) => {
    const isSearch = variant === 'search';
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className={cn("absolute left-3 text-text-muted flex items-center pointer-events-none", isSearch && "text-lg")}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              isSearch ? "h-14 text-lg px-4" : "h-10 px-3 text-sm",
              icon && (isSearch ? "pl-12" : "pl-10"),
              error && "border-red-500 focus:ring-red-500/30 focus:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-red-500 mt-1">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
