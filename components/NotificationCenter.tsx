"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useEmergency } from "@/lib/emergency-context";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "emergency" | "responder" | "resolved" | "system";
  read: boolean;
}

const STORAGE_KEY = "safeband_notifications_v1";

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "init-1",
    title: "Welcome to SafeBand",
    message: "Your emergency response network is active and monitoring.",
    timestamp: new Date().toISOString(),
    type: "system",
    read: false,
  },
];

interface ClientStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function getLocalStorage(): ClientStorage | null {
  try {
    const g = globalThis as unknown as { window?: unknown; localStorage?: ClientStorage };
    if (typeof g !== "undefined" && g.window && g.localStorage) {
      return g.localStorage;
    }
  } catch {}
  return null;
}

function getInitialNotifications(): AppNotification[] {
  const storage = getLocalStorage();
  if (!storage) return DEFAULT_NOTIFICATIONS;
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
  } catch {}
  return DEFAULT_NOTIFICATIONS;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(getInitialNotifications);

  const { alerts } = useEmergency();

  // Sync new emergency alerts into notification list asynchronously
  useEffect(() => {
    if (alerts.length === 0) return;

    const timer = setTimeout(() => {
      setNotifications((prev) => {
        let updated = [...prev];
        let changed = false;

        alerts.forEach((alert) => {
          const notifId = `alert-${alert.id}`;
          if (!updated.some((n) => n.id === notifId)) {
            const newNotif: AppNotification = {
              id: notifId,
              title: `🚨 Emergency SOS: ${alert.victim_name || "Unknown User"}`,
              message: `Emergency SOS triggered at ${new Date(alert.created_at).toLocaleTimeString()}. Real-time GPS active.`,
              timestamp: alert.created_at,
              type: alert.status === "active" ? "emergency" : "resolved",
              read: false,
            };
            updated = [newNotif, ...updated];
            changed = true;
          }
        });

        if (changed) {
          const storage = getLocalStorage();
          if (storage) {
            try {
              storage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
            } catch {}
          }
          return updated;
        }

        return prev;
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [alerts]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const saveNotifications = (items: AppNotification[]) => {
    setNotifications(items);
    const storage = getLocalStorage();
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "responder":
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-white cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:justify-end bg-black/40 backdrop-blur-xs p-2 sm:p-6">
          <div className="flex max-h-[85vh] w-full max-w-full sm:max-w-md flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#0b203c] px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-none">Notifications</h2>
                  <p className="mt-1 text-[11px] text-white/70">
                    {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Read All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notification List (SMS Inbox Style) */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-slate-400">
                  <Bell className="h-8 w-8 opacity-40" />
                  <p className="text-xs font-medium">No notifications yet</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`group relative flex items-start gap-3 rounded-xl p-3 transition-colors cursor-pointer ${
                      !item.read ? "bg-blue-50/70 hover:bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    {!item.read && (
                      <span className="absolute top-3.5 left-2 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    )}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-100 ml-1">
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold truncate ${!item.read ? "text-slate-900" : "text-slate-700"}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => deleteNotification(item.id, e)}
                      className="absolute right-2 top-3 p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5">
                <span className="text-[11px] font-medium text-slate-400">
                  {notifications.length} total message{notifications.length !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear Inbox
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}