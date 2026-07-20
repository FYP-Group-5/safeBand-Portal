"use client";

import { useState, useEffect } from "react";
import { Timer, X, Play, StopCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { useEmergency } from "@/lib/emergency-context";

interface SafetyTimerModalProps {
  onClose: () => void;
}

export default function SafetyTimerModal({ onClose }: SafetyTimerModalProps) {
  const { triggerSos, startGpsStreaming, activeAlert } = useEmergency();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer expired! Trigger SOS automatically!
      setIsRunning(false);
      triggerSos().then((res) => {
        if (res && "success" in res && res.success) {
          startGpsStreaming(res.alert.id);
        }
      });
      onClose();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleStartTimer = () => {
    setTimeLeft(selectedMinutes * 60);
    setIsRunning(true);
  };

  const handleStopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#0b203c] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-none">Safety Countdown Timer</h3>
              <p className="mt-1 text-[11px] text-white/70">Auto-triggers SOS if unconfirmed</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          {!isRunning ? (
            <>
              <p className="text-xs text-slate-600 leading-relaxed">
                Walking alone at night or entering an unsafe area? Set a timer. If you don't confirm safety before countdown ends, an <strong>Emergency SOS</strong> will be dispatched automatically.
              </p>

              {/* Time selection grid */}
              <div className="grid grid-cols-4 gap-3">
                {[5, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedMinutes(mins)}
                    className={`flex flex-col items-center justify-center rounded-xl p-3 border text-xs font-bold transition-all ${
                      selectedMinutes === mins
                        ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs scale-105"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-lg font-black">{mins}</span>
                    <span className="text-[10px] text-slate-400">mins</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleStartTimer}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-amber-600"
              >
                <Play className="h-4 w-4 fill-white" />
                Start {selectedMinutes}-Minute Safety Guard
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 animate-pulse">
                  Safety Monitoring Active
                </span>
                <div className="text-5xl font-black font-mono tracking-tight text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 shadow-inner">
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 flex items-center gap-2 text-left">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                <span>
                  Tap <strong>"I'm Safe"</strong> before time expires to cancel the emergency broadcast.
                </span>
              </div>

              <button
                type="button"
                onClick={handleStopTimer}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-emerald-700"
              >
                <ShieldCheck className="h-5 w-5" />
                I'm Safe (Cancel Guard)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
