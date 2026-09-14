'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-border flex gap-0", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm transition-all border-b-2 flex items-center gap-2 -mb-[1px]",
              isActive 
                ? "text-accent border-accent font-medium" 
                : "text-text-secondary hover:text-text-primary border-transparent hover:border-border-hover"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "text-xs py-0.5 px-1.5 rounded-full font-medium",
                isActive ? "bg-accent/10 text-accent" : "bg-surface-hover text-text-secondary"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
