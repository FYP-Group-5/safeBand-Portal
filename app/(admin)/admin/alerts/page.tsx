"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  AlertTriangle,
  Search,
  Clock,
  MapPin,
  Phone,
  Navigation,
  Filter,
} from "lucide-react";
import { useEmergency } from "@/lib/emergency-context";

type FilterLabel =
  | "All"
  | "Active"
  | "Resolved";

const filters: FilterLabel[] = ["All", "Active", "Resolved"];

export default function AdminAlertsPage() {
  const { alerts, locations, resolveAlert } = useEmergency();
  const [activeFilter, setActiveFilter] = useState<FilterLabel>("All");

  const priorityFor = (alert: typeof alerts[number]): { label: string; cls: string } => {
    if (alert.status === "resolved") return { label: "Resolved", cls: "bg-slate-100 text-slate-600" };
    const age = (Date.now() - new Date(alert.created_at).getTime()) / 60000;
    if (age < 5) return { label: "Critical", cls: "bg-emergency text-white" };
    if (age < 30) return { label: "Warning", cls: "bg-amber-100 text-amber-700" };
    return { label: "Info", cls: "bg-blue-100 text-blue-700" };
  };

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? alerts
        : alerts.filter((a) => a.status === activeFilter.toLowerCase()),
    [alerts, activeFilter],
  );

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">
            Active Alerts
          </h2>
          <p className="text-sm text-slate-500">
            Monitor and manage incoming emergency alerts.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-64 rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              placeholder="Search alerts..."
              type="text"
            />
          </div>
          <button
            type="button"
            className="relative rounded-lg border border-slate-200 bg-white p-2"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {alerts.filter(a => a.status === "active").length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emergency" />
            )}
          </button>
        </div>
      </header>

      {/* Filter tabs */}
      <div className="mb-6 flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === f
                ? "bg-primary-dark text-white"
                : "bg-white text-slate-500 hover:text-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto text-xs text-slate-400">
          {alerts.length} total
        </div>
      </div>

      {/* Alert cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-16 text-sm text-slate-400">
          <Bell className="h-10 w-10" />
          <p>No alerts found</p>
          <p className="text-xs">Alerts will appear here when triggered</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const priority = priorityFor(alert);
            const pts = locations.get(alert.id);
            const latest = pts?.[pts.length - 1];
            return (
              <div
                key={alert.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ${
                        alert.status === "active"
                          ? "bg-red-50 text-emergency"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-800">
                          {alert.victim_name || "Unknown"}
                        </h3>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${priority.cls}`}
                        >
                          {priority.label}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(alert.created_at).toLocaleTimeString()}
                        </div>
                        {alert.victim_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {alert.victim_phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {latest
                            ? `${Number(latest.latitude).toFixed(4)}, ${Number(latest.longitude).toFixed(4)}`
                            : "Awaiting GPS"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            alert.status === "active"
                              ? "bg-emergency"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {alert.status}
                        </span>
                      </div>
                    </div>
                    {alert.status === "active" && (
                      <button
                        type="button"
                        onClick={() => resolveAlert(alert.id)}
                        className="rounded-lg bg-primary-dark px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark/90"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
