"use client";

import { useState, useEffect } from "react";
import { Users, X, Phone, ShieldCheck, Mail, Plus, Loader2 } from "lucide-react";
import { getResponders } from "@/app/actions/responder";
import { AddResponderButton } from "@/app/(dashboard)/components/AddResponderButton";

interface ResponderListModalProps {
  onClose: () => void;
}

interface Responder {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
  status: string;
  created_at: string;
}

export default function ResponderListModal({ onClose }: ResponderListModalProps) {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResponders().then((res) => {
      setLoading(false);
      if (res.success && res.responders) {
        setResponders(res.responders);
      }
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#0b203c] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-none">Emergency Network</h3>
              <p className="mt-1 text-[11px] text-white/70">
                {responders.length} active monitors & responders
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <AddResponderButton />
        </div>

        {/* Responders List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : responders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-slate-400">
              <Users className="h-8 w-8 opacity-40" />
              <p className="text-xs font-semibold text-slate-700">No emergency contacts yet</p>
              <p className="text-[11px] text-slate-400">Add trusted contacts to receive emergency alerts.</p>
            </div>
          ) : (
            responders.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b203c] text-sm font-bold text-white shadow-xs">
                    {(item.name || "R")[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 capitalize">
                        {item.relationship || "Responder"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          item.status === "accepted"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.phone ? (
                    <a
                      href={`tel:${item.phone}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title={`Call ${item.name}`}
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  ) : (
                    <a
                      href={`mailto:${item.email}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title={`Email ${item.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
