"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit,
  Trash2,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { AddResponderButton } from "../components/AddResponderButton";
import { getResponders } from "@/app/actions/responder";
import type { Responder } from "@/types/responder";

function responderContact(responder: Responder): {
  value: string;
  type: "phone" | "email";
} {
  if (responder.phone) return { value: responder.phone, type: "phone" };
  return { value: responder.email, type: "email" };
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 ${className ?? ""}`}
    />
  );
}

function ResponderCardSkeleton() {
  return (
    <div className="border-primary-dark/5 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row">
      <div className="flex w-full items-center gap-4 md:w-auto">
        <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3.5 w-40" />
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2 md:w-auto">
        <Skeleton className="h-9 w-16 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

function responderInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function RespondersPage() {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getResponders().then((result) => {
      if (result.success) {
        setResponders(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });
  }, []);

  return (
    <section className="bg-background-light relative flex min-h-screen w-full flex-col pb-20">
      <header className="border-primary-dark/10 flex items-center justify-between border-b bg-white px-6 py-4 md:px-10 lg:px-40">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <button className="text-primary-dark hover:bg-primary-dark/5 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-primary-dark text-xl font-bold tracking-tight">
            Responders
          </h1>
        </div>
        <div className="hidden md:block">
          <AddResponderButton />
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-40">
        <div className="flex max-w-240 flex-1 flex-col gap-6">
          <div className="md:hidden">
            <AddResponderButton />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2.5 px-2">
            <div>
              <h2 className="text-primary-dark text-2xl font-bold">
                Active Network
              </h2>
              <p className="text-sm text-slate-500">
                People who will be notified in case of emergency.
              </p>
            </div>
            {!loading && (
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {responders.length} Total
              </span>
            )}
          </div>

          {loading && (
            <div className="flex flex-col gap-4">
              <ResponderCardSkeleton />
              <ResponderCardSkeleton />
              <ResponderCardSkeleton />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {responders.map((responder) => {
                const contact = responderContact(responder);
                return (
                  <div
                    key={responder.id}
                    className="border-primary-dark/5 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row"
                  >
                    <div className="flex w-full items-center gap-4 md:w-auto">
                      <div className="bg-primary-dark/10 relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                        <div className="text-primary-dark flex h-full w-full items-center justify-center text-xl font-bold">
                          {responderInitials(responder.name)}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="text-primary-dark text-lg font-bold">
                            {responder.name}
                          </h3>
                          {responder.status === "verified" ? (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                          {responder.relationship}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          {contact.type === "phone" ? (
                            <Phone className="h-3.5 w-3.5" />
                          ) : (
                            <Mail className="h-3.5 w-3.5" />
                          )}
                          {contact.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-end gap-2 md:w-auto">
                      <button className="text-primary-dark bg-primary-dark/5 hover:bg-primary-dark/10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                        title="Remove Responder"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-primary-dark/10 bg-primary-dark/5 mt-4 rounded-xl border p-6">
            <div className="flex items-start gap-4">
              <Info className="text-primary-dark mt-1 h-6 w-6 shrink-0" />
              <div className="flex flex-col gap-1">
                <h4 className="text-primary-dark text-sm font-bold">
                  About Responders
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Responders are your trusted contacts who will receive your
                  location and an SOS alert when your SafeBand is triggered. We
                  recommend having at least 2 verified responders.
                </p>
                <button className="text-primary-dark mt-2 w-fit text-sm font-bold hover:underline">
                  Learn more about verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
