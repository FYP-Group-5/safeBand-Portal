"use client";

import { Shield, LogOut } from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import { logout } from "@/app/actions/auth";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary-dark rounded-lg p-1 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">SafeBand</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <NotificationCenter />
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
