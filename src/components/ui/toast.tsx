"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };
type ToastCtx = { toast: (message: string, type?: ToastType) => void };

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be used inside <ToastProvider>");
  return c;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />,
  error: <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />,
  info: <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++idRef.current;
    setItems((p) => [...p, { id, message, type }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border bg-white p-4 shadow-soft animate-[slideIn_.2s_ease]",
              t.type === "success" && "border-green-100",
              t.type === "error" && "border-red-100",
              t.type === "info" && "border-blue-100"
            )}
          >
            {icons[t.type]}
            <p className="flex-1 text-sm leading-snug text-brand-ink">{t.message}</p>
            <button
              onClick={() => setItems((p) => p.filter((x) => x.id !== t.id))}
              className="mt-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </Ctx.Provider>
  );
}