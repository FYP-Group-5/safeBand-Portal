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
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useEmergency } from "@/lib/emergency-context";
import { getCachedAddress } from "@/lib/geocode";

const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
});

export default function ResponderDashboardPage() {
  const { alerts, locations, resolveAlert } = useEmergency();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Default to first active alert or first alert overall
  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === "active"),
    [alerts],
  );

  const displayAlerts = useMemo(
    () => (activeAlerts.length > 0 ? activeAlerts : alerts),
    [activeAlerts, alerts],
  );

  const selectedIdFinal = selectedId ?? displayAlerts[0]?.id ?? null;
  const selectedAlert = displayAlerts.find((a) => a.id === selectedIdFinal) ?? displayAlerts[0] ?? null;

  const selectedPts = selectedAlert
    ? locations.get(selectedAlert.id) ?? []
    : [];

  const latestLoc = selectedPts[selectedPts.length - 1];

  // Reverse-geocode latest location
  useEffect(() => {
    if (!latestLoc) { setAddress(null); return; }
    let cancelled = false;
    getCachedAddress(latestLoc.latitude, latestLoc.longitude).then((a) => {
      if (cancelled || !a) return;
      const lines = [a.street, a.city, a.state, a.country].filter(Boolean).join(", ");
      setAddress(lines || a.display_name);
    });
    return () => { cancelled = true; };
  }, [selectedIdFinal, latestLoc?.latitude, latestLoc?.longitude]);

  const resolvedCount = useMemo(
    () => alerts.filter((a) => a.status === "resolved").length,
    [alerts],
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0b203c] px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-white/10 p-1.5">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-white">
            ResponderSync
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm leading-none font-semibold text-white">
              Responder
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-white/60">
              {activeAlerts.length} active
            </p>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
              R
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Log out"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 md:p-6">
        {/* Alert + Map */}
        <section>
          {!selectedAlert ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-16 text-sm text-slate-400">
              <Bell className="h-10 w-10" />
              <p>No emergencies reported</p>
              <p className="text-xs">Waiting for incoming SOS alerts…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Alert details */}
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className={`flex items-center justify-between px-4 py-2.5 text-white ${
                    selectedAlert.status === "active" ? "bg-emergency" : "bg-slate-500"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-xs font-bold tracking-wider uppercase font-mono">
                        {selectedAlert.id.slice(0, 8)}
                      </span>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
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
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary-dark text-xl font-bold text-white">
                        {(selectedAlert.victim_name || "U")[0]}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {selectedAlert.victim_name || "Unknown"}
                        </h2>
                        <div className="mt-1 space-y-1 text-sm text-slate-500">
                          {selectedAlert.victim_phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{selectedAlert.victim_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Started {new Date(selectedAlert.created_at).toLocaleTimeString()}</span>
                          </div>
                          {latestLoc && (
                            <div className="text-emergency flex items-center gap-1.5 font-semibold">
                              <Navigation className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate text-xs">
                                {address || `${Number(latestLoc.latitude).toFixed(4)}, ${Number(latestLoc.longitude).toFixed(4)}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded bg-slate-50 px-3 py-2">
                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          Updates
                        </p>
                        <p className="text-sm font-medium text-slate-800">
                          {selectedPts.length} GPS fix{selectedPts.length !== 1 ? "es" : ""}
                        </p>
                      </div>
                      <div className="rounded bg-slate-50 px-3 py-2">
                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          Status
                        </p>
                        <p className="text-sm font-medium capitalize text-slate-800">
                          {selectedAlert.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedAlert.status === "active" && (
                    <div className="border-t border-slate-100 p-4">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className="bg-emergency hover:bg-emergency/90 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white"
                        >
                          <Phone className="h-4 w-4" />
                          Call {selectedAlert.victim_name || "User"}
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 text-sm font-medium text-amber-700 hover:bg-amber-100"
                          >
                            <Navigation className="h-4 w-4" />
                            Navigate
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveAlert(selectedAlert.id)}
                            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Resolve
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="z-10 lg:col-span-7">
                <div className="h-[420px] overflow-hidden rounded-lg border border-slate-200">
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

        {/* ── Alert Status ── */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium text-slate-400">Active</p>
              <p className="text-2xl font-bold text-slate-800">
                {activeAlerts.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium text-slate-400">Resolved</p>
              <p className="text-2xl font-bold text-slate-800">
                {resolvedCount}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium text-slate-400">Total</p>
              <p className="text-2xl font-bold text-slate-800">
                {alerts.length}
              </p>
            </div>
          </div>
        </section>

        {/* ── Alert History ── */}
        {displayAlerts.length > 0 && (
          <section>
            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-700">
                  Alert Feed
                </h3>
                <span className="text-xs text-slate-400">
                  {displayAlerts.length} total
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {displayAlerts.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                      selectedIdFinal === item.id ? "bg-slate-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          item.status === "active"
                            ? "bg-emergency"
                            : "bg-slate-300"
                        }`}
                      />
                      <span className="font-mono text-xs text-slate-400">
                        {item.id.slice(0, 8)}
                      </span>
                      <span className="font-medium text-slate-700">
                        {item.victim_name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(item.created_at).toLocaleTimeString()}
                      </span>
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase ${
                          item.status === "active"
                            ? "text-emergency"
                            : "text-slate-400"
                        }`}
                      >
                        {item.status}
                      </span>
                      <Eye className="h-3.5 w-3.5 text-slate-300" />
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
