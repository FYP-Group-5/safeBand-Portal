"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Shield,
  Bell,
  Clock,
  Phone,
  Navigation,
  CheckCircle,
  Eye,
  LogOut,
  AlertTriangle,
  Loader2,
  Radio,
  MapPin,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useEmergency } from "@/lib/emergency-context";
import { getCachedAddress } from "@/lib/geocode";
import { AddResponderButton } from "@/app/(dashboard)/components/AddResponderButton";
import NotificationCenter from "@/components/NotificationCenter";

const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
});

export default function ResponderDashboardPage() {
  const {
    alerts,
    locations,
    activeAlert,
    isTriggering,
    isStreaming,
    triggerSos,
    resolveAlert,
    startGpsStreaming,
    stopGpsStreaming,
  } = useEmergency();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Filter active incoming alerts
  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === "active"),
    [alerts],
  );

  const displayAlerts = useMemo(
    () => (activeAlerts.length > 0 ? activeAlerts : alerts),
    [activeAlerts, alerts],
  );

  const selectedIdFinal = selectedId ?? displayAlerts[0]?.id ?? null;
  const selectedAlert =
    displayAlerts.find((a) => a.id === selectedIdFinal) ??
    displayAlerts[0] ??
    null;

  const selectedPts = selectedAlert
    ? locations.get(selectedAlert.id) ?? []
    : [];

  const latestLoc = selectedPts[selectedPts.length - 1];

  // Reverse-geocode latest location safely with fixed dependency array
  useEffect(() => {
    let cancelled = false;
    if (!latestLoc) return;

    getCachedAddress(latestLoc.latitude, latestLoc.longitude).then((a) => {
      if (cancelled) return;
      if (!a) {
        setAddress(null);
        return;
      }
      const lines = [a.street, a.city, a.state, a.country]
        .filter(Boolean)
        .join(", ");
      setAddress(lines || a.display_name);
    });

    return () => {
      cancelled = true;
    };
  }, [latestLoc?.latitude, latestLoc?.longitude]);

  const displayAddress = latestLoc ? address : null;

  const resolvedCount = useMemo(
    () => alerts.filter((a) => a.status === "resolved").length,
    [alerts],
  );

  // Responder triggering SOS for themselves
  const handleTriggerMySos = async () => {
    if (isTriggering || activeAlert) return;
    const res = await triggerSos();
    if (res && "success" in res && res.success) {
      startGpsStreaming(res.alert.id);
    }
  };

  const handleResolveMySos = async () => {
    if (!activeAlert) return;
    await resolveAlert(activeAlert.id);
    stopGpsStreaming();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0b203c] px-4 py-3 shadow-md md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-white/10 p-1.5">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-none tracking-tight text-white">
              ResponderSync
            </h1>
            <p className="mt-0.5 text-[10px] font-medium text-white/60">
              Emergency & Safety Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Responder button for Responders */}
          <div className="hidden sm:block">
            <AddResponderButton />
          </div>

          {/* Responder Emergency SOS Trigger in Header */}
          {!activeAlert ? (
            <button
              type="button"
              onClick={handleTriggerMySos}
              disabled={isTriggering}
              className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 hover:bg-red-700 disabled:opacity-50 animate-pulse"
            >
              {isTriggering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              {isTriggering ? "TRIGGERING..." : "EMERGENCY SOS"}
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
              <Radio className="h-3.5 w-3.5 animate-spin" />
              YOUR SOS ACTIVE
            </div>
          )}

          <div className="hidden border-l border-white/20 pl-3 text-right sm:block">
            <p className="text-xs font-semibold leading-none text-white">
              Responder Unit
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-white/60">
              {activeAlerts.length} active incidents
            </p>
          </div>

          <NotificationCenter />

          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center rounded-lg p-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── Active Self Emergency Banner ── */}
      {activeAlert && (
        <div className="bg-red-600 px-4 py-3 text-white shadow-lg">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-red-600">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-black tracking-wider uppercase">
                  🚨 YOUR EMERGENCY SOS IS ACTIVE & BROADCASTING
                </p>
                <p className="text-xs text-white/90">
                  Real-time GPS coordinates are live streaming to all safety units.
                  {isStreaming ? " (GPS Live)" : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResolveMySos}
              className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-red-600 shadow transition-colors hover:bg-red-50"
            >
              <CheckCircle className="h-4 w-4" />
              Resolve My SOS
            </button>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 md:p-6">
        {/* Responder Emergency Banner & Add Responder Controls */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {!activeAlert && (
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-900">
                    In Danger while Responding?
                  </h3>
                  <p className="text-xs text-red-700">
                    Trigger an instant SOS alert to notify all emergency units.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTriggerMySos}
                disabled={isTriggering}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95 hover:bg-red-700 disabled:opacity-50"
              >
                {isTriggering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {isTriggering ? "TRIGGERING SOS..." : "TRIGGER RESPONDER SOS"}
              </button>
            </div>
          )}

          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b203c] text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0b203c]">
                  Build Safety Network
                </h3>
                <p className="text-xs text-slate-600">
                  Invite trusted contacts or fellow backup responders.
                </p>
              </div>
            </div>
            <div className="w-full">
              <AddResponderButton />
            </div>
          </div>
        </div>

        {/* Alert + Map */}
        <section>
          {!selectedAlert ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-16 text-sm text-slate-400 shadow-sm">
              <Bell className="h-10 w-10" />
              <p className="font-semibold text-slate-700">No emergencies reported</p>
              <p className="text-xs text-slate-400">Waiting for incoming SOS alerts…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Alert details */}
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div
                    className={`flex items-center justify-between px-4 py-3 text-white ${
                      selectedAlert.status === "active"
                        ? "bg-red-600"
                        : "bg-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">
                        {selectedAlert.id.slice(0, 8)}
                      </span>
                    </div>
                    <span
                      className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                        selectedAlert.status === "active"
                          ? "bg-white/20"
                          : "bg-slate-400/30"
                      }`}
                    >
                      {selectedAlert.status === "active" ? "Active" : "Resolved"}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0b203c] text-xl font-bold text-white shadow-sm">
                        {(selectedAlert.victim_name || "U")[0]}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {selectedAlert.victim_name || "Unknown User"}
                        </h2>
                        <div className="mt-1 space-y-1 text-sm text-slate-500">
                          {selectedAlert.victim_phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{selectedAlert.victim_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Started{" "}
                              {new Date(
                                selectedAlert.created_at,
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                          {latestLoc && (
                            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">
                                {displayAddress ||
                                  `${Number(latestLoc.latitude).toFixed(4)}, ${Number(latestLoc.longitude).toFixed(4)}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          GPS Track
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedPts.length} Fixes
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          Incident State
                        </p>
                        <p className="text-sm font-bold capitalize text-slate-800">
                          {selectedAlert.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedAlert.status === "active" && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex flex-col gap-2">
                        {selectedAlert.victim_phone && (
                          <a
                            href={`tel:${selectedAlert.victim_phone}`}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700"
                          >
                            <Phone className="h-4 w-4" />
                            Call Victim ({selectedAlert.victim_phone})
                          </a>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${latestLoc?.latitude ?? 8.134521},${latestLoc?.longitude ?? 4.246732}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            Google Maps
                          </a>
                          <button
                            type="button"
                            onClick={() => resolveAlert(selectedAlert.id)}
                            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-100"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="z-10 lg:col-span-7">
                <div className="h-110 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  <MapView
                    alertLat={latestLoc?.latitude ?? 8.134521}
                    alertLng={latestLoc?.longitude ?? 4.246732}
                    path={selectedPts.map((p) => ({
                      lat: p.latitude,
                      lng: p.longitude,
                    }))}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Alert Summary ── */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-slate-400">Active Incidents</p>
              <p className="text-2xl font-black text-red-600">
                {activeAlerts.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-slate-400">Resolved Incidents</p>
              <p className="text-2xl font-black text-emerald-600">
                {resolvedCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-slate-400">Total Feed</p>
              <p className="text-2xl font-black text-slate-800">
                {alerts.length}
              </p>
            </div>
          </div>
        </section>

        {/* ── Alert History Feed ── */}
        {displayAlerts.length > 0 && (
          <section>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Emergency Incident Feed
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {displayAlerts.length} records
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {displayAlerts.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                      selectedIdFinal === item.id ? "bg-slate-50/80" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          item.status === "active"
                            ? "bg-red-600 animate-ping"
                            : "bg-slate-300"
                        }`}
                      />
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {item.id.slice(0, 8)}
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.victim_name || "Unknown Victim"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(item.created_at).toLocaleTimeString()}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          item.status === "active"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.status}
                      </span>
                      <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
