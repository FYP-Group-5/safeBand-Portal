"use client";

import { useState } from "react";
import {
  Shield,
  Bell,
  MapPin,
  Home,
  Map,
  Settings,
  Timer,
  Users,
  ShieldCheck,
  Hand,
  LayoutGrid,
  UserRound,
} from "lucide-react";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dash");

  return (
    <section className="text-primary-dark bg-background-light flex min-h-screen flex-col font-sans">
      {/* Top Navigation / Status Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary-dark rounded-lg p-1 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">SafeBand</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs font-bold tracking-wider text-green-700 uppercase">
                System: Ready
              </span>
            </div>
            <button className="text-primary-dark">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pt-6 pb-24">
        {/* Live Location Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-primary-dark/10 text-primary-dark rounded-xl p-2">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Current Location
              </p>
              <p className="text-primary-dark text-sm font-bold">
                123 Main St, New York, NY
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-medium text-blue-600">
                  GPS ACTIVE • HIGH ACCURACY
                </span>
              </div>
            </div>
            <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
              <img
                className="h-full w-full object-cover"
                alt="Satellite view of current user location"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc31eBKDAx5B69vAN0XbRqQvTP5X2mnHrHO_Jgyf-b1tL7-VDdXsHQ2j3WPunb3ZhyFg_0rERyT4p2yjofTVre5ShWiEBf21vXl_oYO3ceWFHrjOw9afT7ax4MXt6eMCG0mnYcHA16rGsq3ff1TgxDlyN5FHZ8Az-mbfJtqngdNP4dmoNwbzyo9Crs_9MdTisjHDxeZyP8WcXliAtm6IXJJcWEF_TUTlt2h8FT3h6fDNf_VdW2Ec2kM2Ac_OnUVZ5x8Q43lRWauQ"
              />
            </div>
          </div>
        </div>

        {/* Central Panic Action Area */}
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="group relative cursor-pointer">
            {/* Inner Red Button */}
            <button className="bg-emergency relative z-10 flex h-64 w-64 flex-col items-center justify-center rounded-full text-white shadow-2xl shadow-[0_0_0_10px_rgba(225,6,0,0.1),0_0_0_20px_rgba(225,6,0,0.05)] transition-transform active:scale-95">
              <Home className="mb-2 h-16 w-16 font-light" />
              <span className="text-2xl font-black tracking-tighter">
                TAP TO ALERT
              </span>
              <div className="mt-4 h-1 w-24 overflow-hidden rounded-full bg-white/30">
                <div className="h-full w-1/3 bg-white"></div>
              </div>
            </button>
            {/* Pulse Animation Effect */}
            <div className="bg-emergency absolute inset-0 animate-ping rounded-full opacity-20"></div>
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm font-medium tracking-wide text-gray-500">
            <Hand className="h-4 w-4" />
            HOLD FOR 3 SECONDS TO SILENT ALERT
          </p>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Safety Timer Card */}
          <button className="hover:border-primary-dark/20 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Timer className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-primary-dark leading-none font-bold">
                Safety Timer
              </h3>
              <p className="mt-1 text-xs text-gray-500">Start countdown</p>
            </div>
          </button>

          {/* Emergency Contacts Card */}
          <button className="hover:border-primary-dark/20 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-primary-dark leading-none font-bold">
                Contacts
              </h3>
              <p className="mt-1 text-xs text-gray-500">4 Active monitors</p>
            </div>
          </button>
        </div>

        {/* Safe Status Badge */}
        <div className="border-primary-dark/20 bg-primary-dark/5 flex items-center justify-between rounded-xl border border-dashed p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary-dark h-6 w-6" />
            <span className="text-sm font-medium">
              Device connection secure
            </span>
          </div>
          <span className="text-primary-dark/60 text-[10px] font-bold uppercase">
            100% Bat
          </span>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button
            onClick={() => setActiveNav("dash")}
            className={`flex flex-col items-center gap-1 ${
              activeNav === "dash"
                ? "text-primary-dark"
                : "hover:text-primary-dark text-gray-400"
            } transition-colors`}
          >
            <LayoutGrid className="h-6 w-6" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Dash
            </span>
          </button>

          <button
            onClick={() => setActiveNav("map")}
            className={`flex flex-col items-center gap-1 ${
              activeNav === "map"
                ? "text-primary-dark"
                : "hover:text-primary-dark text-gray-400"
            } transition-colors`}
          >
            <Map className="h-6 w-6" />
            <span className="text-[10px] font-medium tracking-widest uppercase">
              Safe Map
            </span>
          </button>

          <button
            onClick={() => setActiveNav("responders")}
            className={`flex flex-col items-center gap-1 ${
              activeNav === "responders"
                ? "text-primary-dark"
                : "hover:text-primary-dark text-gray-400"
            } transition-colors`}
          >
            <Users className="h-6 w-6" />
            <span className="text-[10px] font-medium tracking-widest uppercase">
              Responders
            </span>
          </button>

          <button
            onClick={() => setActiveNav("settings")}
            className={`flex flex-col items-center gap-1 ${
              activeNav === "settings"
                ? "text-primary-dark"
                : "hover:text-primary-dark text-gray-400"
            } transition-colors`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-[10px] font-medium tracking-widest uppercase">
              Settings
            </span>
          </button>

          <button
            onClick={() => setActiveNav("profile")}
            className={`flex flex-col items-center gap-1 ${
              activeNav === "profile"
                ? "text-primary-dark"
                : "hover:text-primary-dark text-gray-400"
            } transition-colors`}
          >
            <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-transparent">
              <img
                className="h-full w-full object-cover"
                alt="User profile avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNb6b3CDXnIae7Wp_qOlP2YW9B1B7S9FAESRQAxpdaugQs-UTXLzDCclBphtyaELKtn7MzyFzGfWyh48ukQhIq7H_4x2Mc41QGynQeTATuUuSXinHMLeNnZJlWWpu-jfSYjjqwbUh3ERX3GFVuxNloQgktLz2c6QiYvYR9K3FAQzfcH7EZTtD9VnHDrYA5Wa5qvekeBkuD3hhXB_sTpP-DkjCdLwsI4w67Cq2Ye3U5-CC6EH-qXcsZSV5XW2z3lM7ERvZefMlAAw"
              />
            </div>
            <span className="text-[10px] font-medium tracking-widest uppercase">
              Profile
            </span>
          </button>
        </div>
      </nav>
    </section>
  );
}
