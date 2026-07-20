"use server";

import { cookies } from "next/headers";
import type { ActionError, ApiErrorResponse } from "@/types/auth";
import type {
  TriggerSosResponse,
  LogLocationResponse,
  LocationHistoryResponse,
  ResolveAlertResponse,
  ActiveAlertsResponse,
  LocationPoint,
} from "@/types/sos";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<
  { "Content-Type": string; Authorization: string } | ActionError
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { success: false, error: "Session expired. Please log in again." };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function triggerSos(): Promise<
  ActionError | { success: true; alert: TriggerSosResponse["alert"] }
> {
  const headers = await getAuthHeaders();
  if ("error" in headers) return headers;

  let res: Response;
  try {
    res = await fetch(`${API}/trigger`, {
      method: "POST",
      headers,
    });
  } catch {
    return { success: false, error: "Unable to connect to server. Please try again." };
  }

  if (!res.ok) {
    try {
      const body: ApiErrorResponse = await res.json();
      return { success: false, error: body.message };
    } catch {
      return { success: false, error: "Could not start SOS." };
    }
  }

  const result: TriggerSosResponse = await res.json();
  return { success: true, alert: result.alert };
}

export async function logLocation(
  alert_id: string,
  latitude: number,
  longitude: number,
): Promise<ActionError | { success: true; data: LocationPoint }> {
  const headers = await getAuthHeaders();
  if ("error" in headers) return headers;

  let res: Response;
  try {
    res = await fetch(`${API}/location`, {
      method: "POST",
      headers,
      body: JSON.stringify({ alert_id, latitude, longitude }),
    });
  } catch {
    return { success: false, error: "Unable to connect to server. Please try again." };
  }

  if (!res.ok) {
    try {
      const body: ApiErrorResponse = await res.json();
      if (res.status === 400) return { success: false, error: body.message || "Invalid spatial coordinates provided." };
      return { success: false, error: body.message || "Error logging location." };
    } catch {
      return { success: false, error: "Error logging location." };
    }
  }

  const result: LogLocationResponse = await res.json();
  return { success: true, data: result.data };
}

export async function getLocationHistory(
  alertId: string,
): Promise<ActionError | { success: true; path: LocationPoint[] }> {
  const headers = await getAuthHeaders();
  if ("error" in headers) return headers;

  let res: Response;
  try {
    res = await fetch(`${API}/history/${alertId}`, {
      method: "GET",
      headers: { Authorization: headers.Authorization },
    });
  } catch {
    return { success: false, error: "Unable to connect to server. Please try again." };
  }

  if (!res.ok) {
    try {
      const body: ApiErrorResponse = await res.json();
      return { success: false, error: body.message };
    } catch {
      return { success: false, error: "Error fetching history." };
    }
  }

  const result: LocationHistoryResponse = await res.json();
  return { success: true, path: result.path };
}

export async function resolveAlert(
  alertId: string,
): Promise<ActionError | { success: true; message: string; alert: ResolveAlertResponse["alert"] }> {
  const headers = await getAuthHeaders();
  if ("error" in headers) return headers;

  let res: Response;
  try {
    res = await fetch(`${API}/resolve/${alertId}`, {
      method: "PATCH",
      headers: { Authorization: headers.Authorization },
    });
  } catch {
    return { success: false, error: "Unable to connect to server. Please try again." };
  }

  if (!res.ok) {
    try {
      const body: ApiErrorResponse = await res.json();
      return { success: false, error: body.message || "Alert context missing or unauthorized access." };
    } catch {
      return { success: false, error: "Could not resolve alert." };
    }
  }

  const result: ResolveAlertResponse = await res.json();
  return { success: true, message: result.message, alert: result.alert };
}

export async function getActiveAlerts(): Promise<
  ActionError | { success: true; active_alerts: ActiveAlertsResponse["active_alerts"] }
> {
  const headers = await getAuthHeaders();
  if ("error" in headers) return headers;

  let res: Response;
  try {
    res = await fetch(`${API}/responders/alerts`, {
      method: "GET",
      headers: { Authorization: headers.Authorization },
    });
  } catch {
    return { success: false, error: "Unable to connect to server. Please try again." };
  }

  if (!res.ok) {
    try {
      const body: ApiErrorResponse = await res.json();
      return { success: false, error: body.message || "Error fetching active alerts." };
    } catch {
      return { success: false, error: "Error fetching active alerts." };
    }
  }

  const result: ActiveAlertsResponse = await res.json();
  return { success: true, active_alerts: result.active_alerts };
}
