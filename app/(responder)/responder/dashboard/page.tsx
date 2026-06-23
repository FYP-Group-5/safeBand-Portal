"use client";

import { useState } from "react";
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

const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
});

const alerts = [
  {
    id: "#49202",
    name: "Sarah Johnson",
    phone: "+1 (555) 012-3456",
    time: "2m ago",
    status: "active",
    medical: "Type 1 Diabetic",
    battery: "84%",
    lat: 40.7128,
    lng: -74.006,
    distance: "0.5 mi from you",
  },
  {
    id: "#49201",
    name: "John Smith",
    phone: "+1 (555) 987-6543",
    time: "15m ago",
    status: "resolved",
    medical: "None",
    battery: "92%",
    lat: 40.715,
    lng: -74.008,
    distance: "0.8 mi from you",
  },
  {
    id: "#49200",
    name: "Mary Jones",
    phone: "+1 (555) 456-7890",
    time: "1h ago",
    status: "resolved",
    medical: "Asthma",
    battery: "67%",
    lat: 40.71,
    lng: -74.003,
    distance: "1.2 mi from you",
  },
  {
    id: "#49199",
    name: "David Lee",
    phone: "+1 (555) 234-5678",
    time: "3h ago",
    status: "resolved",
    medical: "None",
    battery: "45%",
    lat: 40.718,
    lng: -74.01,
    distance: "0.3 mi from you",
  },
  {
    id: "#49198",
    name: "Emma Wilson",
    phone: "+1 (555) 876-5432",
    time: "6h ago",
    status: "resolved",
    medical: "Heart Condition",
    battery: "23%",
    lat: 40.711,
    lng: -74.001,
    distance: "1.5 mi from you",
  },
];

export default function ResponderDashboardPage() {
  const [selectedId, setSelectedId] = useState(alerts[0].id);
  const alert = alerts.find((a) => a.id === selectedId)!;

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
              J. Doe
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-white/60">
              ID: #44921
            </p>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
            <img
              alt=""
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALCiYlOWQShe7XZZVtbTLeY-q00GgyfA5ARySrZqxPK9LKfgCa8yUFmZPi5jIiKku93pG2QHcEl4eHHEnq-nGH19LkO6s_4wljcmAQYAg01gHch0PJwdVoAn7kLLXGO9qmn875S8PmeQpmUqVlSSC_njyux4wAOAggAheaoMpmVOpmvNToUEHyl3klmBn1OMpTgRP9P2JuU5oWZiy3X1BHVEQYxn4piCL009Azgg1RXjosAD1xD8uxhpFVW1PFg9m0Ehz1opZfKA"
            />
          </div>
          <button
            type="button"
            className="flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Log out"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 md:p-6">
        {/* Active Alert + Map */}
        <section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Alert details */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="bg-emergency flex items-center justify-between px-4 py-2.5 text-white">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-xs font-bold tracking-wider uppercase">
                      {alert.id}
                    </span>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      alert.status === "active"
                        ? "bg-white/20"
                        : "bg-slate-400/30"
                    }`}
                  >
                    {alert.status === "active" ? "Active" : "Resolved"}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="h-16 w-16 flex-shrink-0 rounded-lg border-2 border-slate-100 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url(https://lh3.googleusercontent.com/aida-public/AB6AXuA3K4zd2gr5DE8mmhto0y6hjL0lB7ljBDHpexh_OfZHZ378-GN1HM5yWD7WHtIzW8-y8jCY3owWmS2ZR_ctNpyENFl0NUX9JAX2XJCXOySsR_gsJSUb1CuHkhd9O_oQbV_8US9HO0rPRIsBauN_E9ONgLLOrGjecqQ0uIribttak3xv9GCpJGCknsZEWIFpYu3m3cWbzW0csakECpjM5RqD2V_8XArWc5N0wNKRIac6JsL57ToMTesMUHnEg5mXMwM7BcwCcW29QQ)",
                      }}
                    />
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {alert.name}
                      </h2>
                      <div className="mt-1 space-y-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{alert.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Started {alert.time}</span>
                        </div>
                        <div className="text-emergency flex items-center gap-1.5 font-semibold">
                          <Navigation className="h-3.5 w-3.5" />
                          <span>{alert.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Medical
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {alert.medical}
                      </p>
                    </div>
                    <div className="rounded bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Battery
                      </p>
                      <p className="text-sm font-medium text-emerald-600">
                        {alert.battery}
                      </p>
                    </div>
                  </div>
                </div>

                {alert.status === "active" && (
                  <div className="border-t border-slate-100 p-4">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="bg-emergency hover:bg-emergency/90 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white"
                      >
                        <Phone className="h-4 w-4" />
                        Call User Now
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 text-sm font-medium text-amber-700 hover:bg-amber-100"
                        >
                          <Navigation className="h-4 w-4" />
                          Respond
                        </button>
                        <button
                          type="button"
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
                <MapView alertLat={alert.lat} alertLng={alert.lng} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Alert Status ── */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium text-slate-400">Active</p>
              <p className="text-2xl font-bold text-slate-800">
                {alerts.filter((a) => a.status === "active").length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium text-slate-400">Responding</p>
              <p className="text-2xl font-bold text-slate-800">0</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium text-slate-400">Resolved</p>
              <p className="text-2xl font-bold text-slate-800">
                {alerts.filter((a) => a.status === "resolved").length}
              </p>
            </div>
          </div>
        </section>

        {/* ── Alert History ── */}
        <section>
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-700">
                Alert History
              </h3>
              <span className="text-xs text-slate-400">
                {alerts.length} total
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {alerts.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                    selectedId === item.id ? "bg-slate-50" : ""
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
                      {item.id}
                    </span>
                    <span className="font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{item.time}</span>
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
      </main>
    </div>
  );
}
