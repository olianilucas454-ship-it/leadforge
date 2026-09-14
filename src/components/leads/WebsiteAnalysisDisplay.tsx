'use client';

import { WebsiteAnalysis } from '@/lib/types/lead';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface WebsiteAnalysisDisplayProps {
  analysis: WebsiteAnalysis;
}

export function WebsiteAnalysisDisplay({ analysis }: WebsiteAnalysisDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scores = [
    { label: 'Qualidade Geral', score: analysis.overallQuality },
    { label: 'Mobile', score: analysis.mobileScore ?? (analysis.isMobileFriendly ? 85 : 35) },
    { label: 'Performance', score: analysis.performanceScore },
    { label: 'Design', score: analysis.designScore },
    { label: 'Conversão', score: analysis.conversionScore },
    { label: 'SEO', score: analysis.seoScore },
  ];

  return (
    <div className="space-y-6">
      {analysis.url && (
        <div className="flex items-center gap-2 text-sm text-accent bg-accent/10 p-3 rounded-md">
          <LinkIcon className="h-4 w-4" />
          <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
            {analysis.url}
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {scores.map((s, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-text font-medium">{s.label}</span>
              <span className="text-text-secondary">{s.score}/100</span>
            </div>
            <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500", getScoreColor(s.score))}
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {analysis.issues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text">Pontos de Atenção</h4>
          <div className="grid gap-2">
            {analysis.issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 bg-surface-hover p-3 rounded-md border border-border">
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
