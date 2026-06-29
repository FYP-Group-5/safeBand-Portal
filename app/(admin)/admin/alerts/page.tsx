"use client";

import { useState } from "react";
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

const alertData = [
  {
    id: "#AL-402",
    user: "Sarah Jenkins",
    phone: "+1 (555) 111-0001",
    priority: "Critical",
    priorityClass: "bg-emergency text-white",
    responder: "Officer Miller",
    status: "In-Progress",
    statusColor: "bg-orange-500",
    time: "2m ago",
    location: "42nd St & 5th Ave",
  },
  {
    id: "#AL-401",
    user: "James Wilson",
    phone: "+1 (555) 111-0002",
    priority: "High",
    priorityClass: "bg-orange-500 text-white",
    responder: "EMS Team #2",
    status: "En Route",
    statusColor: "bg-blue-500",
    time: "8m ago",
    location: "Broadway & 34th St",
  },
  {
    id: "#AL-398",
    user: "Robert Smith",
    phone: "+1 (555) 111-0003",
    priority: "Warning",
    priorityClass: "bg-amber-100 text-amber-700",
    responder: "EMS Team #4",
    status: "En Route",
    statusColor: "bg-blue-500",
    time: "15m ago",
    location: "Park Ave & 59th St",
  },
  {
    id: "#AL-396",
    user: "Lisa Park",
    phone: "+1 (555) 111-0004",
    priority: "Low",
    priorityClass: "bg-blue-100 text-blue-700",
    responder: "Unassigned",
    status: "Pending",
    statusColor: "bg-slate-400",
    time: "32m ago",
    location: "Lexington Ave & 42nd St",
  },
  {
    id: "#AL-395",
    user: "Elena Cruz",
    phone: "+1 (555) 111-0005",
    priority: "Info",
    priorityClass: "bg-slate-100 text-slate-600",
    responder: "System Auto",
    status: "Resolved",
    statusColor: "bg-emerald-500",
    time: "1h ago",
    location: "Madison Ave & 57th St",
  },
];

const filters = ["All", "Critical", "High", "Warning", "Low", "Resolved"];

export default function AdminAlertsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? alertData
      : alertData.filter(
          (a) => a.priority === activeFilter || a.status === activeFilter,
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
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emergency" />
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
        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500"
        >
          <Filter className="h-4 w-4" />
          Sort
        </button>
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ${
                    alert.priority === "Critical"
                      ? "bg-red-50 text-emergency"
                      : alert.priority === "Warning"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-800">
                      {alert.user}
                    </h3>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${alert.priorityClass}`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {alert.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {alert.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {alert.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">{alert.responder}</p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${alert.statusColor}`}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {alert.status}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-primary-dark px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark/90"
                >
                  {alert.status === "Resolved" ? "View" : "Dispatch"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
