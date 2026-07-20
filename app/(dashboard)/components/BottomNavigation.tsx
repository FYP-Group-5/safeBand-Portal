"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Settings } from "lucide-react";

const navItems = [
  {
    id: "dash",
    label: "Dash",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    id: "responders",
    label: "Responders",
    icon: Users,
    href: "/responders",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? "text-primary-dark"
                  : "hover:text-primary-dark text-gray-400"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
