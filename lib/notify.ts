export interface Toast {
  id: string;
  title: string;
  message: string;
  type: "emergency" | "resolved" | "info";
  timestamp: number;
}

export function showBrowserNotification(title: string, body: string) {
  const Notify = typeof Notification !== "undefined" ? Notification : null;
  if (!Notify) return;
  if (Notify.permission === "granted") {
    new Notify(title, { body, icon: "/web-app-manifest-192x192.png" });
  } else if (Notify.permission !== "denied") {
    (Notify as any).requestPermission().then((perm: string) => {
      if (perm === "granted") {
        new Notify(title, { body, icon: "/web-app-manifest-192x192.png" });
      }
    });
  }
}

const toastId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function createToast(
  title: string,
  message: string,
  type: Toast["type"],
): Toast {
  return { id: toastId(), title, message, type, timestamp: Date.now() };
}
