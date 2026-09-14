'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSchema,
  SiteExperienceLevel,
  DesignSystemTokens,
  QualityAuditResult,
} from '../types/siteBuilder';
import { INITIAL_DEMO_SITES } from '../templates/defaultTemplates';
import { AISiteAgent } from '../engines/AISiteAgent';
import { QualityAuditEngine } from '../engines/QualityAuditEngine';

export type BreakpointMode = 'desktop' | 'laptop' | 'tablet' | 'mobile';

interface SiteBuilderContextType {
  sites: SiteSchema[];
  activeSite: SiteSchema | null;
  activePageId: string;
  selectedComponentId: string | null;
  breakpoint: BreakpointMode;
  isAiProcessing: boolean;
  setIsAiProcessing: (processing: boolean) => void;
  auditResult: QualityAuditResult | null;
  aiActionLogs: import('../types/siteBuilder').AiActionLog[];
  
  // Navigation & Actions
  selectSite: (siteId: string) => void;
  createNewSiteFromLead: (leadData: any, experienceLevel?: SiteExperienceLevel) => SiteSchema;
  findLeadAndCreateSite: (leadId: string) => SiteSchema;
  saveSite: (site: SiteSchema) => void;
  deleteSite: (siteId: string) => void;
  
  // Editor Mutations
  setSelectedComponentId: (id: string | null) => void;
  setBreakpoint: (bp: BreakpointMode) => void;
  setActivePageId: (pageId: string) => void;
  updateComponentProps: (componentId: string, newProps: Record<string, any>) => void;
  updateDesignSystem: (newTokens: Partial<DesignSystemTokens>) => void;
  executeAiCommand: (command: string) => void;
  
  // Audit & Versions
  runAudit: () => QualityAuditResult;
  autoFixIssues: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const SiteBuilderContext = createContext<SiteBuilderContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY_SITES = 'leadforge_site_builder_sites_v1';

export const SiteBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<SiteSchema[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DEMO_SITES;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SITES);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_SITES;
    } catch {
      return INITIAL_DEMO_SITES;
    }
  });

  const [activeSite, setActiveSite] = useState<SiteSchema | null>(sites[0] || null);
  const [activePageId, setActivePageId] = useState<string>(sites[0]?.pages[0]?.id || 'p1');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<BreakpointMode>('desktop');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<QualityAuditResult | null>(null);

  // Undo / Redo History Stack
  const [historyStack, setHistoryStack] = useState<SiteSchema[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SITES, JSON.stringify(sites));
    } catch (e) {
      console.error('Failed to sync sites to localStorage', e);
    }
  }, [sites]);

  // Select Site
  const selectSite = (siteId: string) => {
    const found = sites.find((s) => s.id === siteId);
    if (found) {
      setActiveSite(found);
      setActivePageId(found.pages[0]?.id || '');
      setSelectedComponentId(null);
      setHistoryStack([found]);
      setHistoryIndex(0);
      setAuditResult(QualityAuditEngine.audit(found));
    }
  };

  // Push Snapshot to History
  const pushHistory = (newSite: SiteSchema) => {
    setHistoryStack((prev) => [...prev.slice(0, historyIndex + 1), newSite]);
    setHistoryIndex((prev) => prev + 1);
  };

  // Save Site
  const saveSite = (updatedSite: SiteSchema) => {
    const nextVersion: SiteSchema = {
      ...updatedSite,
      updatedAt: new Date().toISOString(),
    };
    setActiveSite(nextVersion);
    setSites((prev) => prev.map((s) => (s.id === nextVersion.id ? nextVersion : s)));
    pushHistory(nextVersion);
    setAuditResult(QualityAuditEngine.audit(nextVersion));
  };

  // Delete Site
  const deleteSite = (siteId: string) => {
    const filtered = sites.filter((s) => s.id !== siteId);
    setSites(filtered);
    if (activeSite?.id === siteId && filtered.length > 0) {
      selectSite(filtered[0].id);
    }
  };

  // Create Site From Lead
  const createNewSiteFromLead = (leadData: any, experienceLevel: SiteExperienceLevel = 'premium'): SiteSchema => {
    const newSite = AISiteAgent.generateFromLead(leadData, experienceLevel);
    setSites((prev) => [newSite, ...prev]);
    setActiveSite(newSite);
    setActivePageId(newSite.pages[0]?.id || '');
    setHistoryStack([newSite]);
    setHistoryIndex(0);
    setAuditResult(QualityAuditEngine.audit(newSite));
    return newSite;
  };

  // Find Lead in Storage & Create Site
  const findLeadAndCreateSite = (leadId: string): SiteSchema => {
    const existing = sites.find((s) => s.leadId === leadId);
    if (existing) {
      selectSite(existing.id);
      return existing;
    }

    let foundLead: any = null;
    const storageKeys = [
      'leadforge_search_results',
      'leadforge_crm_leads',
      'leadforge_saved_leads',
      'leadforge_history',
    ];

    for (const key of storageKeys) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const match = list.find((item: any) => item.id === leadId);
            if (match) {
              foundLead = match;
              break;
            }
          }
        }
      } catch (e) {
        console.error(`Failed to parse key ${key}`, e);
      }
    }

    if (!foundLead) {
      foundLead = {
        id: leadId,
        name: 'Empresa Selecionada',
        category: 'Serviços de Alto Padrão',
        city: 'São Paulo',
        state: 'SP',
      };
    }

    return createNewSiteFromLead(foundLead, 'cinematic');
  };

  // Update Component Props Granually
  const updateComponentProps = (componentId: string, updates: Record<string, any>) => {
    if (!activeSite) return;

    const updated = JSON.parse(JSON.stringify(activeSite)) as SiteSchema;
    let modified = false;

    updated.pages.forEach((page) => {
      page.sections.forEach((sec) => {
        sec.components.forEach((cmp) => {
          if (cmp.id === componentId) {
            const { styleOverrides, animation, interaction, frameSequence, hiddenOnMobile, ...propUpdates } = updates;

            if (styleOverrides !== undefined) {
              cmp.styleOverrides = { ...cmp.styleOverrides, ...styleOverrides };
            }
            if (animation !== undefined) {
              cmp.animation = { ...cmp.animation, ...animation };
            }
            if (interaction !== undefined) {
              cmp.interaction = { ...cmp.interaction, ...interaction };
            }
            if (frameSequence !== undefined) {
              cmp.frameSequence = { ...cmp.frameSequence, ...frameSequence };
            }
            if (hiddenOnMobile !== undefined) {
              cmp.hiddenOnMobile = hiddenOnMobile;
            }

            cmp.props = { ...cmp.props, ...propUpdates };
            modified = true;
          }
        });
      });
    });

    if (modified) {
      saveSite(updated);
    }
  };

  // Update Design System Tokens
  const updateDesignSystem = (newTokens: Partial<DesignSystemTokens>) => {
    if (!activeSite) return;
    const updated: SiteSchema = {
      ...activeSite,
      designSystem: {
        ...activeSite.designSystem,
        ...newTokens,
      },
    };
    saveSite(updated);
  };

  const [aiActionLogs, setAiActionLogs] = useState<import('../types/siteBuilder').AiActionLog[]>([]);

  // Execute AI Natural Language Command
  const executeAiCommand = (command: string) => {
    if (!activeSite) return;
    setIsAiProcessing(true);

    setTimeout(() => {
      const { updatedSite, log } = AISiteAgent.executeCommandWithLog(activeSite, command);
      saveSite(updatedSite);
      setAiActionLogs((prev) => [log, ...prev]);
      setIsAiProcessing(false);
    }, 600);
  };

  // Run Audit
  const runAudit = (): QualityAuditResult => {
    if (!activeSite) return { overallScore: 0, scores: {} as any, issues: [] };
    const res = QualityAuditEngine.audit(activeSite);
    setAuditResult(res);
    return res;
  };

  // Auto-Fix Issues
  const autoFixIssues = () => {
    if (!activeSite) return;
    const fixed = QualityAuditEngine.autoFix(activeSite);
    saveSite(fixed);
  };

  // Undo / Redo
  const undo = () => {
    if (historyIndex > 0) {
      const prev = historyStack[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setActiveSite(prev);
    }
  };

  const redo = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setActiveSite(next);
    }
  };

  return (
    <SiteBuilderContext.Provider
      value={{
        sites,
        activeSite,
        activePageId,
        selectedComponentId,
        breakpoint,
        isAiProcessing,
        setIsAiProcessing,
        auditResult,
        aiActionLogs,
        selectSite,
        createNewSiteFromLead,
        findLeadAndCreateSite,
        saveSite,
        deleteSite,
        setSelectedComponentId,
        setBreakpoint,
        setActivePageId,
        updateComponentProps,
        updateDesignSystem,
        executeAiCommand,
        runAudit,
        autoFixIssues,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < historyStack.length - 1,
      }}
    >
      {children}
    </SiteBuilderContext.Provider>
  );
};

export const useSiteBuilder = () => {
  const context = useContext(SiteBuilderContext);
  if (!context) {
    throw new Error('useSiteBuilder must be used within a SiteBuilderProvider');
  }
  return context;
};
