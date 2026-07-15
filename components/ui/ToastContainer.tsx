"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { useEmergency } from "@/lib/emergency-context";

const ICONS = {
  emergency: AlertTriangle,
  resolved: CheckCircle,
  info: CheckCircle,
};

const BG = {
  emergency: "border-red-500/50 bg-red-950/80",
  resolved: "border-green-500/50 bg-green-950/80",
  info: "border-blue-500/50 bg-blue-950/80",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useEmergency();
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    for (const t of toasts) {
      if (timers.current.has(t.id)) continue;
      timers.current.set(
        t.id,
        setTimeout(() => dismissToast(t.id), 5000),
      );
    }
    return () => {
      for (const [, t] of timers.current) clearTimeout(t);
    };
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex w-80 flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-3 text-sm shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${BG[t.type]}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{t.title}</p>
              <p className="mt-0.5 text-white/80">{t.message}</p>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
