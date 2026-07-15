"use client";

import dynamic from "next/dynamic";
import {
  Bell,
  User,
  Award,
  AlertTriangle,
  Timer,
  Map,
  HeartPulse,
  TrendingUp,
  Zap,
  Search,
  UserPlus,
  CheckCircle,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { useEmergency } from "@/lib/emergency-context";
import { useMemo } from "react";

const AdminMap = dynamic(() => import("../components/AdminMap"), {
  ssr: false,
});

export default function AdminDashboardPage() {
  const { alerts, locations } = useEmergency();

  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === "active"),
    [alerts],
  );

  const resolvedCount = useMemo(
    () => alerts.filter((a) => a.status === "resolved").length,
    [alerts],
  );

  const incidents = useMemo(
    () =>
      activeAlerts.map((a) => {
        const pts = locations.get(a.id);
        const latest = pts?.[pts.length - 1];
        const lat = latest?.latitude ?? 8.134521;
        const lng = latest?.longitude ?? 4.246732;
        const age =
          (Date.now() - new Date(a.created_at).getTime()) / 60000;
        const color =
          age < 5 ? "#e10600" : age < 30 ? "#f59e0b" : "#3b82f6";
        return {
          alert_id: a.id,
          lat,
          lng,
          label: a.victim_name || "Unknown",
          color,
        };
      }),
    [activeAlerts, locations],
  );

  const kpis = [
    {
      icon: User,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      label: "Active Users",
      value: alerts.length > 0 ? `${alerts.length}+` : "—",
      trend: `${activeAlerts.length} in distress`,
      trendColor: activeAlerts.length > 0 ? "text-red-600" : "text-emerald-600",
    },
    {
      icon: Award,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      label: "Responders Online",
      value: "Active",
      trend: "Receiving updates",
      trendColor: "text-emerald-600",
    },
    {
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      label: "Active Alerts",
      value: String(activeAlerts.length),
      trend: `${resolvedCount} resolved today`,
      trendColor: resolvedCount > 0 ? "text-emerald-600" : "text-slate-400",
    },
    {
      icon: Timer,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      label: "Alerts Total",
      value: String(alerts.length),
      trend: "Session lifetime",
      trendColor: "text-slate-400",
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">
            Global Overview
          </h2>
          <p className="text-sm text-slate-500">
            Real-time platform metrics and responder status.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-64 rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              placeholder="Search devices, users..."
              type="text"
            />
          </div>
          <button
            type="button"
            className="relative rounded-lg border border-slate-200 bg-white p-2"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {activeAlerts.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emergency" />
            )}
          </button>
        </div>
      </header>

      {/* KPI Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg p-2 ${kpi.iconBg}`}>
                  <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-bold ${kpi.trendColor}`}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  {kpi.trend}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-primary-dark">
                {kpi.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Map + Events + Activity Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Map & Events Table */}
        <div className="col-span-12 space-y-8 lg:col-span-8">
          {/* Live Map */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-primary-dark">
                <Map className="h-5 w-5 text-emergency" />
                Live Incident Map
              </h3>
              <div className="flex gap-2">
                <span className="rounded bg-primary-dark px-3 py-1 text-xs text-white">
                  {incidents.length} incident{incidents.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="h-96 bg-slate-100">
              <AdminMap incidents={incidents} />
            </div>
          </div>

          {/* Recent Emergency Events */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-primary-dark">
                <AlertTriangle className="h-5 w-5 text-emergency" />
                Active Emergency Events
              </h3>
              <a
                href="/admin/alerts"
                className="text-xs font-bold text-primary-dark hover:underline"
              >
                View All History
              </a>
            </div>
            <div className="overflow-x-auto">
              {activeAlerts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-6 py-12 text-sm text-slate-400">
                  <Map className="h-8 w-8" />
                  <p>No active emergencies</p>
                  <p className="text-xs">Waiting for incoming alerts…</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Alert ID</th>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Triggered</th>
                      <th className="px-6 py-4 font-semibold">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {activeAlerts.map((alert) => {
                      const pts = locations.get(alert.id);
                      const latest = pts?.[pts.length - 1];
                      const time = new Date(alert.created_at).toLocaleTimeString();
                      return (
                        <tr
                          key={alert.id}
                          className="bg-red-50/30"
                        >
                          <td className="px-6 py-4 font-mono text-xs font-medium text-slate-800">
                            {alert.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {alert.victim_name || "Unknown"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded bg-emergency px-2 py-1 text-[10px] font-bold text-white">
                              ACTIVE
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{time}</td>
                          <td className="px-6 py-4">
                            {latest ? (
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Navigation className="h-3 w-3" />
                                {Number(latest.latitude).toFixed(4)}, {Number(latest.longitude).toFixed(4)}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Awaiting GPS</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right: System Health & Activity */}
        <div className="col-span-12 space-y-8 lg:col-span-4">
          {/* System Health */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 font-bold text-primary-dark">
              <HeartPulse className="h-5 w-5 text-emerald-600" />
              Platform Health
            </h3>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium uppercase text-slate-500">
                    API Uptime
                  </span>
                  <span className="font-bold text-emerald-600">99.9%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: "99.9%" }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium uppercase text-slate-500">
                    Socket Connection
                  </span>
                  <span className="font-bold text-blue-600">Live</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium uppercase text-slate-500">
                    Active Alerts
                  </span>
                  <span className="font-bold text-amber-600">
                    {activeAlerts.length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{ width: `${Math.min(activeAlerts.length * 20, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Stream */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 font-bold text-primary-dark">
              <Zap className="h-5 w-5" />
              System Stream
            </h3>
            <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {activeAlerts.length === 0 ? (
                <div className="text-center text-xs text-slate-400">
                  No recent activity
                </div>
              ) : (
                activeAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="relative flex gap-4 pl-8">
                    <div className="absolute left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emergency ring-4 ring-white">
                      <AlertTriangle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">
                        New Emergency
                      </p>
                      <p className="text-xs text-slate-400">
                        {alert.victim_name || "Unknown"} — Alert active
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(alert.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
