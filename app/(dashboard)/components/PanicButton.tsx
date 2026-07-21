"use client";

import { useEmergency } from "@/lib/emergency-context";
import { Home, Hand, Loader2, CheckCircle, AlertCircle, Upload } from "lucide-react";

export default function PanicButton() {
  const { activeAlert, isTriggering, isStreaming, error, pendingCount, triggerSos, resolveAlert, startGpsStreaming, stopGpsStreaming, clearError } = useEmergency();

  const handleTrigger = async () => {
    if (isTriggering || activeAlert) return;
    const res = await triggerSos();
    if (res.success) {
      startGpsStreaming(res.alert.id);
    }
  };

  const handleResolve = async () => {
    if (!activeAlert) return;
    await resolveAlert(activeAlert.id);
    stopGpsStreaming();
  };

  if (activeAlert) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="group relative">
          <div className="bg-emerald-500 relative z-10 flex h-64 w-64 flex-col items-center justify-center rounded-full text-white shadow-2xl shadow-[0_0_0_10px_rgba(16,185,129,0.1),0_0_0_20px_rgba(16,185,129,0.05)]">
            <CheckCircle className="mb-2 h-16 w-16" />
            <span className="text-center text-xl font-black tracking-tighter">
              SOS ACTIVE
            </span>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium">
              <span className={`h-2 w-2 rounded-full ${isStreaming ? "bg-white animate-ping" : "bg-white/50"}`} />
              {isStreaming ? "Streaming Location" : "Location Paused"}
            </div>
          </div>
        </div>

        {pendingCount > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-full bg-amber-900/50 px-4 py-2 text-xs font-medium text-amber-200">
            <Upload className="h-3 w-3 animate-pulse" />
            {pendingCount} pending — syncing when online
          </div>
        )}

        <button
          type="button"
          onClick={handleResolve}
          className="mt-6 rounded-full bg-primary-dark px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark/90"
        >
          Resolve Emergency
        </button>

        <p className="mt-4 flex items-center gap-2 text-sm font-medium tracking-wide text-gray-500">
          <Hand className="h-4 w-4" />
          Alert #{activeAlert.id.slice(0, 8)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {error && (
        <div className="mb-4 flex w-full max-w-xs items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={clearError} className="text-red-400 hover:text-red-600">&times;</button>
        </div>
      )}

      {pendingCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-full bg-amber-900/50 px-4 py-2 text-xs font-medium text-amber-200">
          <Upload className="h-3 w-3 animate-pulse" />
          {pendingCount} pending action{pendingCount !== 1 ? "s" : ""} — syncing when online
        </div>
      )}

      <div className="group relative cursor-pointer" onClick={handleTrigger}>
        <button
          type="button"
          disabled={isTriggering}
          className="bg-emergency relative z-10 flex h-56 w-56 sm:h-64 sm:w-64 flex-col items-center justify-center rounded-full text-white shadow-2xl shadow-[0_0_0_10px_rgba(225,6,0,0.1),0_0_0_20px_rgba(225,6,0,0.05)] transition-transform active:scale-95 disabled:cursor-wait"
        >
          {isTriggering ? (
            <Loader2 className="mb-2 h-14 w-14 sm:h-16 sm:w-16 animate-spin" />
          ) : (
            <Home className="mb-2 h-14 w-14 sm:h-16 sm:w-16 font-light" />
          )}
          <span className="text-xl sm:text-2xl font-black tracking-tighter">
            {isTriggering ? "TRIGGERING..." : "TAP TO ALERT"}
          </span>
          <div className="mt-4 h-1 w-24 overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-1/3 bg-white"></div>
          </div>
        </button>
      </div>
      <p className="mt-8 flex items-center gap-2 text-sm font-medium tracking-wide text-gray-500">
        <Hand className="h-4 w-4" />
        HOLD FOR 3 SECONDS TO SILENT ALERT
      </p>
    </div>
  );
}
