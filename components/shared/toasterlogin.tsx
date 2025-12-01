'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

// Global toast state
let toastState: Toast[] = [];
let setToastState: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

const addToast = (type: ToastType, title: string, message: string) => {
  const id = Math.random().toString(36).substring(7);
  const newToast: Toast = { id, type, title, message };
  
  if (setToastState) {
    setToastState((prev) => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (setToastState) {
        setToastState((prev) => prev.filter((toast) => toast.id !== id));
      }
    }, 5000);
  }
};

export const showToast = {
  success: (title: string, message: string) => addToast('success', title, message),
  error: (title: string, message: string) => addToast('error', title, message),
  info: (title: string, message: string) => addToast('info', title, message),
  warning: (title: string, message: string) => addToast('warning', title, message),
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Set global state setter
  if (setToastState !== setToasts) {
    setToastState = setToasts;
  }

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getStyles(toast.type)} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right`}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{toast.title}</p>
            <p className="text-sm mt-1">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

