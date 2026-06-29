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
} from "lucide-react";

const AdminMap = dynamic(() => import("../components/AdminMap"), {
  ssr: false,
});

const kpis = [
  {
    icon: User,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    label: "Total Active Users",
    value: "12,450",
    trend: "+5%",
    trendColor: "text-emerald-600",
  },
  {
    icon: Award,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Responders Online",
    value: "482",
    trend: "+2%",
    trendColor: "text-emerald-600",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    label: "Alerts Today",
    value: "14",
    trend: "3 Unresolved",
    trendColor: "text-red-600",
  },
  {
    icon: Timer,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    label: "Avg. Response Time",
    value: "4m 12s",
    trend: "-12s",
    trendColor: "text-emerald-600",
  },
];

const alerts = [
  {
    id: "#AL-402",
    user: "Sarah Jenkins",
    priority: "CRITICAL",
    priorityClass: "bg-emergency text-white",
    responder: "Officer Miller",
    status: "In-Progress",
    statusColor: "bg-orange-500",
    action: "Dispatch",
  },
  {
    id: "#AL-398",
    user: "Robert Smith",
    priority: "WARNING",
    priorityClass: "bg-amber-100 text-amber-700",
    responder: "EMS Team #4",
    status: "En Route",
    statusColor: "bg-blue-500",
    action: "Details",
  },
  {
    id: "#AL-395",
    user: "Elena Cruz",
    priority: "INFO",
    priorityClass: "bg-blue-100 text-blue-700",
    responder: "System Auto",
    status: "Resolved",
    statusColor: "bg-emerald-500",
    action: "Logs",
  },
];

const activity = [
  {
    icon: UserPlus,
    iconBg: "bg-primary",
    text: "New Responder Signed Up",
    sub: "Mark Thompson (Badge #882)",
    time: "2 minutes ago",
  },
  {
    icon: CheckCircle,
    iconBg: "bg-emerald-500",
    text: "Alert #402 Resolved",
    sub: "Dispatch: Central HQ",
    time: "14 minutes ago",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-blue-500",
    text: "Firmware Update Pushed",
    sub: "SafeBand v2.1.4 stable",
    time: "1 hour ago",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-500",
    text: "System Backup Warning",
    sub: "S3 Storage at 85% capacity",
    time: "2 hours ago",
  },
];

export default function AdminDashboardPage() {
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
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emergency" />
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
                <button
                  type="button"
                  className="rounded bg-primary-dark px-3 py-1 text-xs text-white"
                >
                  Users
                </button>
                <button
                  type="button"
                  className="rounded bg-slate-100 px-3 py-1 text-xs text-slate-600"
                >
                  Responders
                </button>
              </div>
            </div>
            <div className="h-96 bg-slate-100">
              <AdminMap />
            </div>
          </div>

          {/* Recent Emergency Events */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-primary-dark">
                <AlertTriangle className="h-5 w-5 text-emergency" />
                Recent Emergency Events
              </h3>
              <a
                href="/admin/alerts"
                className="text-xs font-bold text-primary-dark hover:underline"
              >
                View All History
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Alert ID</th>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Responder</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {alerts.map((alert) => (
                    <tr
                      key={alert.id}
                      className={
                        alert.priority === "CRITICAL"
                          ? "bg-red-50/30"
                          : undefined
                      }
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {alert.id}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {alert.user}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded px-2 py-1 text-[10px] font-bold ${alert.priorityClass}`}
                        >
                          {alert.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {alert.responder}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${alert.statusColor}`}
                          />
                          <span className="text-slate-600">
                            {alert.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="text-xs font-bold uppercase text-primary-dark hover:text-emergency"
                        >
                          {alert.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    GPS Relay Delay
                  </span>
                  <span className="font-bold text-blue-600">0.4s</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium uppercase text-slate-500">
                    Server Load
                  </span>
                  <span className="font-bold text-amber-600">42%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{ width: "42%" }}
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
              {activity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="relative flex gap-4 pl-8">
                    <div
                      className={`absolute left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${item.iconBg}`}
                    >
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{item.text}</p>
                      <p className="text-xs text-slate-400">{item.sub}</p>
                      <span className="text-[10px] text-slate-400">
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="mt-6 w-full border-t border-slate-50 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-primary-dark"
            >
              View More Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
