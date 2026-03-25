"use client";

import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import InstallButton from "@/components/InstallButton";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Our Mission", href: "#solution" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-primary/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary font-display">
            SafeBand
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-bold text-primary px-5 py-2.5 rounded-full hover:bg-primary/5 transition-all">
            Login
          </button>
          <InstallButton size="md" showIcon={false}>
            Get Started
          </InstallButton>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center">
          <button
            className="text-slate-700 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
            <button className="text-sm font-bold text-primary px-5 py-2.5 rounded-full hover:bg-primary/5 transition-all text-left">
              Login
            </button>
            <InstallButton size="md" showIcon={false}>
              Get Started
            </InstallButton>
          </div>
        </div>
      )}
    </header>
  );
}