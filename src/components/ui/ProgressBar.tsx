'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  label, 
  showPercentage = false, 
  className,
  animated = false 
}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm font-medium text-text-primary">
          {label && <span>{label}</span>}
          {showPercentage && <span className="text-text-secondary">{Math.round(safeValue)}%</span>}
        </div>
      )}
      <div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden relative">
        <div
          className={cn(
            "h-full bg-accent rounded-full transition-all duration-500 ease-out",
            animated && safeValue === 0 && "w-1/3 animate-pulse bg-accent/50" // simulated indeterminate
          )}
          style={{ width: animated && safeValue === 0 ? undefined : `${safeValue}%` }}
        />
        {animated && safeValue > 0 && safeValue < 100 && (
           <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden rounded-full">
             <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
           </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
