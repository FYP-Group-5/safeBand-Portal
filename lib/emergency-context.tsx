"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { connectSocket, joinRoom, disconnectSocket, getSocket } from "./socket";
import * as sosActions from "@/app/actions/sos";
import type { Alert, LocationPoint } from "@/types/sos";
import type { ActionError } from "@/types/auth";
import { showBrowserNotification, createToast, type Toast } from "./notify";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  enqueue,
  dequeue,
  getQueue,
  getQueueLength,
  replaceTempId,
  type QueueAction,
} from "./offline-queue";

interface EmergencyState {
  alerts: Alert[];
  activeAlert: Alert | null;
  locations: Map<string, LocationPoint[]>;
  toasts: Toast[];
  pendingCount: number;
  isTriggering: boolean;
  isStreaming: boolean;
  error: string | null;
}

interface EmergencyContextValue extends EmergencyState {
  triggerSos: () => Promise<ActionError | { success: true; alert: Alert }>;
  resolveAlert: (
    alertId: string,
  ) => Promise<ActionError | { success: true; message: string; alert: Alert }>;
  startGpsStreaming: (alertId: string) => void;
  stopGpsStreaming: () => void;
  clearError: () => void;
  dismissToast: (id: string) => void;
}

const EmergencyContext = createContext<EmergencyContextValue | null>(null);

interface Props {
  children: ReactNode;
  role?: "user" | "responder" | "admin";
}

export function EmergencyProvider({ children, role }: Props) {
  const [state, setState] = useState<EmergencyState>({
    alerts: [],
    activeAlert: null,
    locations: new Map(),
    toasts: [],
    pendingCount: 0,
    isTriggering: false,
    isStreaming: false,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);
  const activeAlertRef = useRef<Alert | null>(null);
  const { isOnline, isOnlineRef } = useOnlineStatus();

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const setError = useCallback((msg: string) => {
    setState((s) => ({ ...s, isTriggering: false, error: msg }));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setState((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) }));
  }, []);

  const pushToast = useCallback(
    (title: string, message: string, type: Toast["type"]) => {
      showBrowserNotification(title, message);
      const toast = createToast(title, message, type);
      setState((s) => ({ ...s, toasts: [...s.toasts, toast] }));
    },
    [],
  );

  const refreshPendingCount = useCallback(() => {
    setState((s) => ({ ...s, pendingCount: getQueueLength() }));
  }, []);

  // ─── GPS streaming ─────────────────────────────────────────────────────
  const startGpsStreaming = useCallback(
    (alertId: string) => {
      if (watchIdRef.current !== null) return;

      const nav =
        typeof navigator !== "undefined" ? (navigator as any) : null;
      if (!nav?.geolocation) {
        setError("Geolocation not supported.");
        return;
      }

      setState((s) => ({ ...s, isStreaming: true }));

      const sendPosition = (lat: number, lng: number) => {
        const currentAlertId = activeAlertRef.current?.id ?? alertId;
        const socket = getSocket();
        if (socket?.connected) {
          socket.emit("SOS_TRACKING", {
            alert_id: currentAlertId,
            latitude: lat,
            longitude: lng,
          });
        } else if (isOnlineRef.current) {
          sosActions.logLocation(currentAlertId, lat, lng).then((res) => {
            if (!("data" in res)) {
              console.warn("[GPS] HTTP fallback failed:", (res as any).error);
            }
          });
        } else {
          enqueue({
            type: "log_location",
            payload: { alert_id: currentAlertId, latitude: lat, longitude: lng },
          });
          refreshPendingCount();
        }
      };

      const success = (pos: any) => {
        sendPosition(pos.coords.latitude, pos.coords.longitude);
      };

      const err = (err: any) => {
        console.warn("[GPS] watchPosition error:", err.message);
      };

      watchIdRef.current = nav.geolocation.watchPosition(success, err, {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      });
    },
    [setError, refreshPendingCount],
  );

  const stopGpsStreaming = useCallback(() => {
    if (watchIdRef.current !== null) {
      const nav =
        typeof navigator !== "undefined" ? (navigator as any) : null;
      if (nav?.geolocation) {
        nav.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
    }
    setState((s) => ({ ...s, isStreaming: false }));
  }, []);

  // ─── Restore active alert from localStorage (user) ──────────────────────
  useEffect(() => {
    if (role !== "user") return;

    let ls: any = null;
    try {
      ls =
        typeof globalThis !== "undefined"
          ? (globalThis as any).localStorage
          : null;
    } catch {
      // server-side — ignore
    }
    const storedId = ls?.getItem("sos_active_alert_id");
    if (!storedId) return;

    // Check if it's a temp offline ID
    const queue = getQueue();
    const hasPendingTrigger = queue.some(
      (a) => a.type === "trigger_sos" && a.tempAlertId === storedId,
    );
    if (hasPendingTrigger) {
      // Restore from local state — alert hasn't been sent yet
      const pendingAlert: Alert = {
        id: storedId,
        user_id: "",
        status: "active",
        created_at: new Date().toISOString(),
        ended_at: null,
      };
      setState((s) => ({ ...s, activeAlert: pendingAlert }));
      activeAlertRef.current = pendingAlert;
      startGpsStreaming(storedId);
      return;
    }

    sosActions.getActiveAlerts().then((res) => {
      if ("error" in res) return;
      const match = res.active_alerts.find(
        (a) => a.status === "active" && a.id === storedId,
      );
      if (!match) {
        ls?.removeItem("sos_active_alert_id");
        return;
      }
      setState((s) => ({ ...s, activeAlert: match }));
      activeAlertRef.current = match;

      // Restore location history
      sosActions.getLocationHistory(match.id).then((locRes) => {
        if (!("error" in locRes) && locRes.path.length > 0) {
          setState((s) => {
            const next = new Map(s.locations);
            next.set(match.id, locRes.path);
            return { ...s, locations: next };
          });
        }
      });

      startGpsStreaming(match.id);
    });
  }, [role, startGpsStreaming]);

  // ─── Fetch active alerts on mount (responder/admin) ─────────────────────
  useEffect(() => {
    if (role === "user") return;

    sosActions.getActiveAlerts().then((res) => {
      if ("error" in res) return;
      setState((s) => ({ ...s, alerts: res.active_alerts }));
    });
  }, [role]);

  // ─── Socket connection (responder/admin) ────────────────────────────────
  useEffect(() => {
    if (role === "user") return;

    const socket = connectSocket();

    const onConnect = () => {
      joinRoom("emergency-responders");
    };

    const onNewEmergency = (data: {
      alert_id: string;
      user_name: string;
      timestamp: string;
    }) => {
      const newAlert: Alert = {
        id: data.alert_id,
        user_id: "",
        status: "active",
        created_at: data.timestamp,
        ended_at: null,
        victim_name: data.user_name,
      };
      setState((s) => {
        if (s.alerts.some((a) => a.id === data.alert_id)) return s;
        return { ...s, alerts: [newAlert, ...s.alerts] };
      });
      pushToast(
        "🚨 New Emergency",
        `${data.user_name} triggered an SOS alert`,
        "emergency",
      );
    };

    const onLocationUpdate = (data: any) => {
      const pt: LocationPoint = {
        id: data.id,
        alert_id: data.alert_id,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        created_at: data.created_at,
      };
      setState((s) => {
        const next = new Map(s.locations);
        const existing = next.get(pt.alert_id) || [];
        next.set(pt.alert_id, [...existing, pt]);
        return { ...s, locations: next };
      });
    };

    const onUpdateMap = (data: any) => {
      const pt: LocationPoint = {
        id: "",
        alert_id: data.alert_id,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        created_at: data.timestamp,
      };
      setState((s) => {
        const next = new Map(s.locations);
        const existing = next.get(pt.alert_id) || [];
        next.set(pt.alert_id, [...existing, pt]);
        return { ...s, locations: next };
      });
    };

    const onEmergencyResolved = (data: { alert_id: string }) => {
      setState((s) => ({
        ...s,
        alerts: s.alerts.filter((a) => a.id !== data.alert_id),
        activeAlert:
          s.activeAlert?.id === data.alert_id ? null : s.activeAlert,
      }));
      if (activeAlertRef.current?.id === data.alert_id) {
        activeAlertRef.current = null;
        stopGpsStreaming();
      }
      pushToast(
        "✅ Emergency Resolved",
        `Alert ${data.alert_id.slice(0, 8)} has been resolved`,
        "resolved",
      );
    };

    socket.on("connect", onConnect);
    socket.on("NEW_EMERGENCY", onNewEmergency);
    socket.on("LOCATION_UPDATE", onLocationUpdate);
    socket.on("UPDATE_MAP", onUpdateMap);
    socket.on("EMERGENCY_RESOLVED", onEmergencyResolved);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("NEW_EMERGENCY", onNewEmergency);
      socket.off("LOCATION_UPDATE", onLocationUpdate);
      socket.off("UPDATE_MAP", onUpdateMap);
      socket.off("EMERGENCY_RESOLVED", onEmergencyResolved);
    };
  }, [role, stopGpsStreaming, pushToast]);

  // ─── Flush offline queue when transitioning online ───────────────────────
  useEffect(() => {
    if (!isOnline) return;

    const items = getQueue();
    if (items.length === 0) return;

    let changed = false;

    (async () => {
      for (const item of items) {
        try {
          if (item.type === "trigger_sos") {
            const res = await sosActions.triggerSos();
            if ("error" in res) {
              // non-retriable or still offline — skip
              if (res.error.includes("connect") || res.error.includes("network")) {
                continue;
              }
              dequeue(item.id);
              changed = true;
              continue;
            }

            // Replace temp ID with real ID in queue
            if (item.tempAlertId) {
              replaceTempId(item.tempAlertId, res.alert.id);
              // Update localStorage
              try {
                const ls =
                  typeof globalThis !== "undefined"
                    ? (globalThis as any).localStorage
                    : null;
                if (ls?.getItem("sos_active_alert_id") === item.tempAlertId) {
                  ls.setItem("sos_active_alert_id", res.alert.id);
                }
              } catch {
                // non-critical
              }
              // Update activeAlert in state
              setState((s) => {
                if (s.activeAlert?.id === item.tempAlertId) {
                  return { ...s, activeAlert: res.alert };
                }
                return s;
              });
              activeAlertRef.current = res.alert;
            }

            dequeue(item.id);
            changed = true;
          }

          if (item.type === "log_location") {
            const { alert_id, latitude, longitude } = item.payload as any;
            const res = await sosActions.logLocation(alert_id, latitude, longitude);
            if ("error" in res) {
              if (res.error.includes("connect") || res.error.includes("network")) {
                continue;
              }
              dequeue(item.id);
              changed = true;
              continue;
            }
            dequeue(item.id);
            changed = true;
          }

          if (item.type === "resolve_alert") {
            const { alertId } = item.payload as any;
            const res = await sosActions.resolveAlert(alertId);
            if ("error" in res) {
              if (res.error.includes("connect") || res.error.includes("network")) {
                continue;
              }
              dequeue(item.id);
              changed = true;
              continue;
            }
            dequeue(item.id);
            changed = true;
          }
        } catch {
          continue;
        }
      }

      if (changed) {
        refreshPendingCount();
        pushToast(
          "Synced",
          "Offline alerts have been sent to the server.",
          "info",
        );
      }
    })();
  }, [isOnline, refreshPendingCount, pushToast]);

  // ─── Read pending count on mount ────────────────────────────────────────
  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // ─── triggerSos ─────────────────────────────────────────────────────────
  const triggerSos = useCallback(async (): Promise<
    ActionError | { success: true; alert: Alert }
  > => {
    setState((s) => ({ ...s, isTriggering: true, error: null }));

    if (!isOnlineRef.current) {
      // Offline — save locally
      const tempId = crypto.randomUUID();
      const tempAlert: Alert = {
        id: tempId,
        user_id: "",
        status: "active",
        created_at: new Date().toISOString(),
        ended_at: null,
      };

      enqueue({
        type: "trigger_sos",
        payload: {},
        tempAlertId: tempId,
      });

      setState((s) => ({
        ...s,
        isTriggering: false,
        activeAlert: tempAlert,
        pendingCount: getQueueLength(),
      }));
      activeAlertRef.current = tempAlert;

      try {
        const ls =
          typeof globalThis !== "undefined"
            ? (globalThis as any).localStorage
            : null;
        ls?.setItem("sos_active_alert_id", tempId);
      } catch {
        // non-critical
      }

      return { success: true as const, alert: tempAlert };
    }

    const res = await sosActions.triggerSos();
    if ("error" in res) {
      setState((s) => ({ ...s, isTriggering: false, error: res.error }));
      return res;
    }
    setState((s) => ({ ...s, isTriggering: false, activeAlert: res.alert }));
    activeAlertRef.current = res.alert;

    try {
      const ls =
        typeof globalThis !== "undefined"
          ? (globalThis as any).localStorage
          : null;
      ls?.setItem("sos_active_alert_id", res.alert.id);
    } catch {
      // non-critical
    }

    try {
      connectSocket();
    } catch {
      // non-critical
    }

    return res;
  }, []);

  // ─── resolveAlert ───────────────────────────────────────────────────────
  const resolveAlert = useCallback(
    async (
      alertId: string,
    ): Promise<
      ActionError | { success: true; message: string; alert: Alert }
    > => {
      if (!isOnlineRef.current) {
        enqueue({
          type: "resolve_alert",
          payload: { alertId },
        });
        setState((s) => ({
          ...s,
          activeAlert:
            s.activeAlert?.id === alertId ? null : s.activeAlert,
          alerts: s.alerts.filter((a) => a.id !== alertId),
          pendingCount: getQueueLength(),
        }));
        if (activeAlertRef.current?.id === alertId) {
          activeAlertRef.current = null;
          stopGpsStreaming();
          try {
            const ls =
              typeof globalThis !== "undefined"
                ? (globalThis as any).localStorage
                : null;
            ls?.removeItem("sos_active_alert_id");
          } catch {
            // non-critical
          }
        }
        return { success: true as const, message: "Saved offline. Will resolve when connected.", alert: { id: alertId, user_id: "", status: "resolved" as const, created_at: "", ended_at: null } };
      }

      const res = await sosActions.resolveAlert(alertId);
      if ("error" in res) {
        setError(res.error);
        return res;
      }
      setState((s) => ({
        ...s,
        activeAlert:
          s.activeAlert?.id === alertId ? null : s.activeAlert,
        alerts: s.alerts.filter((a) => a.id !== alertId),
      }));
      if (activeAlertRef.current?.id === alertId) {
        activeAlertRef.current = null;
        stopGpsStreaming();
        try {
          const ls =
            typeof globalThis !== "undefined"
              ? (globalThis as any).localStorage
              : null;
          ls?.removeItem("sos_active_alert_id");
        } catch {
          // non-critical
        }
      }
      return res;
    },
    [setError, stopGpsStreaming],
  );

  // ─── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        const nav =
          typeof navigator !== "undefined" ? (navigator as any) : null;
        nav?.geolocation?.clearWatch(watchIdRef.current);
      }
      if (role === "user") {
        disconnectSocket();
      }
    };
  }, [role]);

  return (
    <EmergencyContext.Provider
      value={{
        ...state,
        triggerSos,
        resolveAlert,
        startGpsStreaming,
        stopGpsStreaming,
        clearError,
        dismissToast,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency(): EmergencyContextValue {
  const ctx = useContext(EmergencyContext);
  if (!ctx) {
    throw new Error("useEmergency must be used within an EmergencyProvider");
  }
  return ctx;
}
