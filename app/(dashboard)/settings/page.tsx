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
  X,
  Check,
  Volume2,
  Smartphone,
  Eye,
  CheckCircle2,
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();

  // Settings Toggles State
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: true,
    siren: true,
  });

  const [locationSettings, setLocationSettings] = useState({
    highAccuracy: true,
    backgroundTracking: true,
    refreshRate: "5s",
  });

  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  const [emergencySettings, setEmergencySettings] = useState({
    holdDuration: "2s",
    silentMode: false,
    autoDialer: true,
  });

  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateProfile({ name, phone: phone || undefined });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setProfile(res.data);
      setActiveModal(null);
      setError(null);
      showToast("Profile updated successfully!");
    });
  };

  const showToast = (msg: string) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(null), 3000);
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
              setActiveModal("profile");
            }
          },
        },
        {
          icon: Lock,
          label: "Password & Security",
          description: "Change password and manage security settings",
          onClick: () => setActiveModal("security"),
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
          onClick: () => setActiveModal("notifications"),
        },
        {
          icon: MapPin,
          label: "Location Settings",
          description: "Manage GPS accuracy and location sharing",
          onClick: () => setActiveModal("location"),
        },
        {
          icon: Moon,
          label: "Appearance",
          description: "Theme and display options",
          onClick: () => setActiveModal("appearance"),
        },
        {
          icon: Globe,
          label: "Language & Region",
          description: "App language and regional settings",
          onClick: () => setActiveModal("language"),
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
          onClick: () => setActiveModal("emergency"),
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
          onClick: () => setActiveModal("support"),
        },
      ],
    },
  ];

  return (
    <section className="bg-background-light relative flex min-h-screen w-full flex-col pb-20 md:pb-0">
      {/* Toast Notification */}
      {savedSuccess && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl animate-bounce">
          <CheckCircle2 className="h-4 w-4" />
          <span>{savedSuccess}</span>
        </div>
      )}

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
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
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
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 px-6 py-4 font-bold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer">
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </Form>

          <div className="text-center text-xs text-slate-400">
            SafeBand v1.0.0
          </div>
        </div>
      </main>

      {/* ── 1. Edit Profile Modal ── */}
      {activeModal === "profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
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
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-primary-dark px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark/90 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 2. Password & Security Modal ── */}
      {activeModal === "security" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Password & Security</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-700">Active Emergency Session</p>
                <p className="text-[11px] text-slate-500 mt-1">365-day non-expiring emergency session active on this device.</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    showToast("Security settings updated.");
                  }}
                  className="w-full rounded-lg bg-primary-dark py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark/90"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Notifications Modal ── */}
      {activeModal === "notifications" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: "push", title: "Push Notifications", desc: "Real-time popups on emergency SOS" },
                { key: "email", title: "Email Alerts", desc: "Brevo transactional emails when added as responder" },
                { key: "sms", title: "SMS Broadcasts", desc: "Direct SMS alert to contacts" },
                { key: "siren", title: "Loud Siren Alarm", desc: "Sound alarm when in-app SOS triggers" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifications as any)[item.key]}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="h-5 w-5 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast("Notification preferences saved!");
                }}
                className="w-full rounded-lg bg-primary-dark py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark/90"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Location Settings Modal ── */}
      {activeModal === "location" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Location & GPS Settings</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">High Precision GPS</p>
                  <p className="text-[11px] text-slate-500">Enable HTML5 Geolocation Watch Position</p>
                </div>
                <input
                  type="checkbox"
                  checked={locationSettings.highAccuracy}
                  onChange={(e) =>
                    setLocationSettings((s) => ({ ...s, highAccuracy: e.target.checked }))
                  }
                  className="h-5 w-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Background Tracking</p>
                  <p className="text-[11px] text-slate-500">Keep streaming GPS when tab is minimized</p>
                </div>
                <input
                  type="checkbox"
                  checked={locationSettings.backgroundTracking}
                  onChange={(e) =>
                    setLocationSettings((s) => ({ ...s, backgroundTracking: e.target.checked }))
                  }
                  className="h-5 w-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast("Location settings saved!");
                }}
                className="w-full rounded-lg bg-primary-dark py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark/90"
              >
                Save Location Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Appearance Modal ── */}
      {activeModal === "appearance" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Appearance & Theme</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "light", name: "Light" },
                { key: "dark", name: "Dark" },
                { key: "system", name: "System" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key as any)}
                  className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                    theme === t.key
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                showToast(`Theme set to ${theme}`);
              }}
              className="mt-6 w-full rounded-lg bg-primary-dark py-2.5 text-xs font-bold text-white shadow-md"
            >
              Apply Theme
            </button>
          </div>
        </div>
      )}

      {/* ── 6. Emergency Settings Modal ── */}
      {activeModal === "emergency" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Emergency Protocol Settings</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Auto-Dial Emergency Contacts</p>
                  <p className="text-[11px] text-slate-500">Initiate phone call on SOS trigger</p>
                </div>
                <input
                  type="checkbox"
                  checked={emergencySettings.autoDialer}
                  onChange={(e) =>
                    setEmergencySettings((s) => ({ ...s, autoDialer: e.target.checked }))
                  }
                  className="h-5 w-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast("Emergency protocols saved!");
                }}
                className="w-full rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700"
              >
                Save Emergency Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Help & Support Modal ── */}
      {activeModal === "support" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">SafeBand Help & Support</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                <p className="font-bold text-blue-900">24/7 Emergency Helpline</p>
                <p className="text-[11px] text-blue-700 mt-1">If you are in immediate life-threatening danger, call national emergency services (911 / 112).</p>
              </div>
              <div className="space-y-2 pt-2">
                <p className="font-bold text-slate-800">Frequently Asked Questions</p>
                <details className="rounded-lg border border-slate-200 p-2 cursor-pointer">
                  <summary className="font-semibold text-slate-700">How does real-time GPS tracking work?</summary>
                  <p className="mt-1 text-[11px] text-slate-500">When SOS is triggered, your browser streams location points to Socket.IO and Neon DB every 5 seconds.</p>
                </details>
                <details className="rounded-lg border border-slate-200 p-2 cursor-pointer">
                  <summary className="font-semibold text-slate-700">How are responders notified?</summary>
                  <p className="mt-1 text-[11px] text-slate-500">Responders receive instant Brevo emails, in-app SMS notifications, and live dashboard alerts.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
