import { Shield, Bell } from "lucide-react";

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
  );
}
