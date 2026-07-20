"use client";

import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Our Mission", href: "#solution" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="border-primary/5 sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-lg transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary flex items-center justify-center rounded-2xl p-2 text-white">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-primary font-display text-2xl font-bold tracking-tight">
            SafeBand
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-primary text-sm font-semibold text-slate-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => router.push("/login")}
            className="text-primary hover:bg-primary/5 rounded-full px-5 py-2.5 text-sm font-bold transition-all"
          >
            Login
          </button>
          <button className="bg-primary shadow-primary/20 hover:bg-primary/90 rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg transition-all">
            Get Started
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden">
          <button
            className="p-2 text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="flex flex-col gap-5 border-t border-slate-100 bg-white px-6 py-6 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="hover:text-primary text-sm font-semibold text-slate-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-2">
            <button onClick={() => router.push('/login')} className="text-primary hover:bg-primary/5 rounded-full px-5 py-2.5 text-left text-sm font-bold transition-all">
              Login
            </button>
            <button className="bg-primary shadow-primary/20 hover:bg-primary/90 rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg transition-all">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
