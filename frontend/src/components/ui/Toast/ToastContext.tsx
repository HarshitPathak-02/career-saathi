import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => string;
  dismissToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string) => string;
    error: (message: string, title?: string) => string;
    warning: (message: string, title?: string) => string;
    info: (message: string, title?: string) => string;
  };
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const toast = {
    success: useCallback(
      (message: string, title?: string) => showToast({ type: "success", title, message }),
      [showToast]
    ),
    error: useCallback(
      (message: string, title?: string) => showToast({ type: "error", title, message }),
      [showToast]
    ),
    warning: useCallback(
      (message: string, title?: string) => showToast({ type: "warning", title, message }),
      [showToast]
    ),
    info: useCallback(
      (message: string, title?: string) => showToast({ type: "info", title, message }),
      [showToast]
    ),
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, toast }}>
      {children}
      {/* Toast Overlay Container */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-4 right-4 z-50 flex max-w-sm flex-col gap-2.5 sm:max-w-md"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg transition-all animate-in slide-in-from-top-2 duration-200 ${
              item.type === "success"
                ? "border-emerald-200 bg-white text-emerald-900"
                : item.type === "error"
                ? "border-rose-200 bg-white text-rose-900"
                : item.type === "warning"
                ? "border-amber-200 bg-white text-amber-900"
                : "border-blue-200 bg-white text-blue-900"
            }`}
          >
            <div className="shrink-0 pt-0.5">
              {item.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {item.type === "error" && <XCircle className="h-5 w-5 text-rose-600" />}
              {item.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-600" />}
              {item.type === "info" && <Info className="h-5 w-5 text-blue-600" />}
            </div>

            <div className="flex-1 text-sm">
              {item.title && <p className="font-semibold leading-tight">{item.title}</p>}
              <p
                className={`leading-snug ${
                  item.title ? "mt-1 text-xs opacity-90" : "text-sm font-medium"
                }`}
              >
                {item.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              className="shrink-0 rounded-lg p-1 text-slate-400 opacity-70 transition hover:bg-slate-100 hover:text-slate-700 hover:opacity-100"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
