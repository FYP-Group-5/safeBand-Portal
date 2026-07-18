"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  MapPin,
  Lock,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Loader2,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Form from "next/form";
import { logout } from "@/app/actions/auth";
import { getProfile, updateProfile } from "@/app/actions/profile";
import type { Profile } from "@/types/profile";

function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="h-4 w-48 rounded bg-slate-100" />
        <div className="h-3 w-24 rounded bg-slate-100" />
      </div>
    </div>
  );
}

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getProfile().then((res) => {
      setLoading(false);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setProfile(res.data);
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateProfile({ name, phone: phone || undefined });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setProfile(res.data);
      setEditing(false);
      setError(null);
    });
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile Information",
          description: "Update your name and contact details",
          onClick: () => {
            if (profile) {
              setName(profile.name);
              setPhone(profile.phone || "");
              setEditing(true);
            }
          },
        },
        {
          icon: Lock,
          label: "Password & Security",
          description: "Change password and manage security settings",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Configure alert and notification preferences",
        },
        {
          icon: MapPin,
          label: "Location Settings",
          description: "Manage GPS accuracy and location sharing",
        },
        {
          icon: Moon,
          label: "Appearance",
          description: "Theme and display options",
        },
        {
          icon: Globe,
          label: "Language & Region",
          description: "App language and regional settings",
        },
      ],
    },
    {
      title: "Safety",
      items: [
        {
          icon: Shield,
          label: "Emergency Settings",
          description: "Configure panic button and emergency protocols",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help or contact support",
        },
      ],
    },
  ];

  return (
    <section className="bg-background-light relative flex min-h-screen w-full flex-col pb-20 md:pb-0">
      <header className="border-primary-dark/10 flex items-center justify-between border-b bg-white px-6 py-4 md:px-10 lg:px-40">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <button className="text-primary-dark hover:bg-primary-dark/5 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-primary-dark text-xl font-bold tracking-tight">
            Settings
          </h1>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-40">
        <div className="flex w-full max-w-240 flex-col gap-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
              <button onClick={() => setError(null)} className="ml-2 font-semibold">&times;</button>
            </div>
          )}

          {loading ? (
            <ProfileSkeleton />
          ) : profile ? (
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="bg-primary-dark flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white">
                {initials(profile.name)}
              </div>
              <div className="flex-1">
                <h2 className="text-primary-dark text-lg font-bold">{profile.name || "User"}</h2>
                <p className="text-sm text-slate-500">{profile.email || ""}</p>
                <p className="text-xs text-slate-400">
                  {profile.phone ? `${profile.phone} • ` : ""}Member since {formatDate(profile.created_at)}
                </p>
              </div>
            </div>
          ) : null}

          {settingsSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h3 className="text-primary-dark px-2 text-sm font-bold tracking-wide uppercase">
                {section.title}
              </h3>
              <div className="flex flex-col gap-2">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={item.onClick}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-primary-dark text-base font-bold">
                        {item.label}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <Form action={logout} className="w-full">
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 px-6 py-4 font-bold text-rose-600 transition-colors hover:bg-rose-100">
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </Form>

          <div className="text-center text-xs text-slate-400">
            SafeBand v1.0.0
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Edit Profile
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/20"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/20"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-primary-dark px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark/90 disabled:cursor-wait"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
