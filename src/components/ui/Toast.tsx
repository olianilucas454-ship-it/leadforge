'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  success: (message: string, action?: ToastMessage['action']) => void;
  error: (message: string, action?: ToastMessage['action']) => void;
  info: (message: string, action?: ToastMessage['action']) => void;
  warning: (message: string, action?: ToastMessage['action']) => void;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string, action?: ToastMessage['action']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, action }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg: string, action?: ToastMessage['action']) => addToast('success', msg, action), [addToast]);
  const error = useCallback((msg: string, action?: ToastMessage['action']) => addToast('error', msg, action), [addToast]);
  const info = useCallback((msg: string, action?: ToastMessage['action']) => addToast('info', msg, action), [addToast]);
  const warning = useCallback((msg: string, action?: ToastMessage['action']) => addToast('warning', msg, action), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, warning, remove }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => remove(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const duration = 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, duration);
    return () => clearTimeout(timer);
  }, [onRemove, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  };

  const borderColors = {
    success: 'border-emerald-500/20 bg-emerald-500/5',
    error: 'border-red-500/20 bg-red-500/5',
    info: 'border-sky-500/20 bg-sky-500/5',
    warning: 'border-orange-500/20 bg-orange-500/5',
  };

  const progressColors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-sky-500',
    warning: 'bg-orange-500',
  };

  return (
    <div 
      className={cn(
        "pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-xl shadow-lg border w-80 bg-surface backdrop-blur-md animate-in slide-in-from-right-5 fade-in duration-300",
        borderColors[toast.type]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary font-medium">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onRemove();
            }}
            className="mt-2 text-xs font-semibold hover:underline text-text-primary"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button 
        onClick={onRemove}
        className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
        <div 
          className={cn("h-full animate-toast-progress", progressColors[toast.type])}
          style={{ 
            animationDuration: `${duration}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards' 
          }}
        />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toast-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .animate-toast-progress {
          animation-name: toast-progress;
        }
      `}} />
    </div>
  );
}
