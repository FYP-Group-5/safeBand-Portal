import { Shield, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary font-display">
              SafeBand
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Empowering families through safe connections.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-slate-400 text-sm font-medium text-center">
          SafeBand © 2026 — Final Year Computer Science Project
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-6">
          <a href="#" aria-label="Website" className="text-slate-300 hover:text-primary transition-colors">
            <Globe className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Privacy" className="text-slate-300 hover:text-primary transition-colors">
            <Shield className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Email" className="text-slate-300 hover:text-primary transition-colors">
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}