'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextState {
  printMessage: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextState | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const printMessage = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 1000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ printMessage }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "glass-card border px-4 py-3 rounded-md shadow-lg flex items-start justify-between animate-fade-in",
              toast.type === "success" &&
                "border-emerald-500 text-emerald-700 dark:text-emerald-400",
              toast.type === "error" &&
                "border-red-500 text-red-700 dark:text-red-400",
              toast.type === "info" && "border-slate-200 dark:border-slate-700"
            )}
          >
            <span className="pr-2">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
              className="mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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
