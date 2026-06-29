"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Bell,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/alerts", label: "Active Alerts", icon: Bell, badge: "14" },
  { href: "/admin/users", label: "User Management", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f6f7f8]">
      {/* Sidebar */}
      <aside className="fixed flex h-full w-64 flex-col bg-[#0b203c] text-white">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div className="rounded bg-white p-1">
            <Shield className="h-5 w-5 text-[#0b203c]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SafeBand</h1>
            <p className="text-[10px] font-medium leading-tight text-white/60">
              Admin Command
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-[#e10600] px-2 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 px-6 py-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-400">
              <img
                alt=""
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_y02ZkGacCt1BSY21sqbmVUCrZylynvOBPNpB1NdH8F5ADDy6Ji-3BR6Yucf3r0xqn8XPeJUHy11fsLCgdloC5yT4hchRo0gXQcEC4g5ZjB8dUrEJaDBQ1seRyjTeAWmszCJb5Z_57Cgc1uwAHe8gWWkMmjv2erz14B_bBrPGtz0H-7u2czYkuw4Hn7l09Kip17D6SFz7LUQCog9_oZQb8L92GiPbISzg5X7HnknnLKfadTKqR9nRVu1zMoA6Ge8l8ZCjhqGtvA"
              />
            </div>
            <div>
              <p className="text-xs font-semibold">Chief Admin</p>
              <p className="text-[10px] text-white/60">HQ Division</p>
            </div>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded py-2 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
