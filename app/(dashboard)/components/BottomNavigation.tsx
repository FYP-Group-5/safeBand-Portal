"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, Users, Settings } from "lucide-react";

interface BottomNavigationProps {
  initialActive?: string;
  showOnDesktop?: boolean;
}

export default function BottomNavigation({
  initialActive = "dash",
  showOnDesktop = false,
}: BottomNavigationProps) {
  const [activeNav, setActiveNav] = useState(initialActive);

  const navItems = [
    {
      id: "dash",
      label: "Dash",
      icon: LayoutGrid,
      href: "/dashboard",
      fontWeight: "font-bold",
    },
    {
      id: "responders",
      label: "Responders",
      icon: Users,
      href: "/responders",
      fontWeight: "font-medium",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      fontWeight: "font-medium",
    },
  ];

  return (
    <nav
      className={`fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white px-6 py-3 ${
        showOnDesktop ? "" : "md:hidden"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center gap-1"
            >
              <button
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center gap-1 ${
                  activeNav === item.id
                    ? "text-primary-dark"
                    : "hover:text-primary-dark text-gray-400"
                } transition-colors`}
              >
                <Icon className="h-6 w-6" />
                <span
                  className={`text-[10px] ${item.fontWeight} tracking-widest uppercase`}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
