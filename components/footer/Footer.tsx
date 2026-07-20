import { Shield, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 md:flex-row">
        {/* Brand */}
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex items-center justify-center rounded-xl p-1.5 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-primary font-display text-xl font-bold tracking-tight">
              SafeBand
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">
            Empowering families through safe connections.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm font-medium text-slate-400">
          SafeBand © 2026 — Final Year Computer Science Project
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            aria-label="Website"
            className="hover:text-primary text-slate-300 transition-colors"
          >
            <Globe className="h-6 w-6" />
          </a>
          <a
            href="#"
            aria-label="Privacy"
            className="hover:text-primary text-slate-300 transition-colors"
          >
            <Shield className="h-6 w-6" />
          </a>
          <a
            href="#"
            aria-label="Email"
            className="hover:text-primary text-slate-300 transition-colors"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
