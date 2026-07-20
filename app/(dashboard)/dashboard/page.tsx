"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Timer, Users, Bell, Phone, Navigation, CheckCircle, AlertTriangle, MapPin } from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import LocationCard from "../components/LocationCard";
import PanicButton from "../components/PanicButton";
import QuickActionCard from "../components/QuickActionCard";
import StatusCard from "../components/StatusCard";
import SafetyTimerModal from "@/components/SafetyTimerModal";
import ResponderListModal from "@/components/ResponderListModal";
import { useEmergency } from "@/lib/emergency-context";
import { getCachedAddress } from "@/lib/geocode";

const MapView = dynamic(() => import("../../(responder)/components/MapView"), {
  ssr: false,
});

export default function DashboardPage() {
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const { alerts, locations, resolveAlert } = useEmergency();

  // Find incoming active emergency alerts from network contacts
  const networkAlerts = useMemo(
    () => alerts.filter((a) => a.status === "active"),
    [alerts],
  );

  const activeNetworkAlert = networkAlerts[0] || null;
  const alertPts = activeNetworkAlert ? locations.get(activeNetworkAlert.id) ?? [] : [];
  const latestLoc = alertPts[alertPts.length - 1];

  // Geocode location
  useEffect(() => {
    if (!latestLoc) {
      setAddress(null);
      return;
    }
    let cancelled = false;
    getCachedAddress(latestLoc.latitude, latestLoc.longitude).then((a) => {
      if (cancelled || !a) return;
      const lines = [a.street, a.city, a.state, a.country].filter(Boolean).join(", ");
      setAddress(lines || a.display_name);
    });
    return () => {
      cancelled = true;
    };
  }, [latestLoc?.latitude, latestLoc?.longitude]);

  return (
    <section className="text-primary-dark bg-background-light flex min-h-screen flex-col overflow-x-hidden font-sans">
      <DashboardHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-y-auto px-4 pt-6 pb-24">
        {/* 🚨 Network Emergency Alert Card for Normal Users */}
        {activeNetworkAlert && (
          <div className="overflow-hidden rounded-2xl border-2 border-red-500 bg-white shadow-xl animate-pulse">
            <div className="flex items-center justify-between bg-red-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs font-black tracking-wider uppercase">
                  🚨 NETWORK EMERGENCY IN PROGRESS
                </span>
              </div>
              <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] font-bold">
                {activeNetworkAlert.id.slice(0, 8)}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-lg font-extrabold text-white shadow-sm">
                  {(activeNetworkAlert.victim_name || "V")[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeNetworkAlert.victim_name || "Someone in your network"} IS IN DANGER!
                  </h3>
                  <p className="text-xs text-red-600 font-medium">
                    Triggered SOS alert at {new Date(activeNetworkAlert.created_at).toLocaleTimeString()}
                  </p>
                  {latestLoc && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-red-600" />
                      <span className="truncate">
                        {address || `${Number(latestLoc.latitude).toFixed(4)}, ${Number(latestLoc.longitude).toFixed(4)}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Preview */}
              <div className="h-48 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <MapView
                  alertLat={latestLoc?.latitude ?? 8.134521}
                  alertLng={latestLoc?.longitude ?? 4.246732}
                  path={alertPts.map((p) => ({ lat: p.latitude, lng: p.longitude }))}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                {activeNetworkAlert.victim_phone && (
                  <a
                    href={`tel:${activeNetworkAlert.victim_phone}`}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-xs font-bold text-white shadow-md transition-colors hover:bg-red-700"
                  >
                    <Phone className="h-4 w-4" />
                    Call Victim ({activeNetworkAlert.victim_phone})
                  </a>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${latestLoc?.latitude ?? 8.134521},${latestLoc?.longitude ?? 4.246732}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Google Maps
                  </a>
                  <button
                    type="button"
                    onClick={() => resolveAlert(activeNetworkAlert.id)}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Resolve Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <LocationCard />

        <PanicButton />

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard
            icon={Timer}
            title="Safety Timer"
            description="Start countdown"
            iconBgColor="bg-amber-100"
            iconTextColor="text-amber-600"
            onClick={() => setShowTimerModal(true)}
          />

          <QuickActionCard
            icon={Users}
            title="Contacts"
            description="Responder Network"
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
            onClick={() => setShowContactsModal(true)}
          />
        </div>

        <StatusCard />
      </main>

      {/* Interactive Modals */}
      {showTimerModal && (
        <SafetyTimerModal onClose={() => setShowTimerModal(false)} />
      )}
      {showContactsModal && (
        <ResponderListModal onClose={() => setShowContactsModal(false)} />
      )}
    </section>
  );
}
