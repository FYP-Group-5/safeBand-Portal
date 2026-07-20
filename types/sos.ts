export interface Alert {
  id: string;
  user_id: string;
  status: "active" | "resolved";
  created_at: string;
  ended_at: string | null;
  victim_name?: string;
  victim_phone?: string;
}

export interface LocationPoint {
  id: string;
  alert_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface TriggerSosResponse {
  success: true;
  alert: Alert;
}

export interface LogLocationResponse {
  success: true;
  data: LocationPoint;
}

export interface LocationHistoryResponse {
  success: true;
  path: LocationPoint[];
}

export interface ResolveAlertResponse {
  success: true;
  message: string;
  alert: Alert;
}

export interface ActiveAlertsResponse {
  success: true;
  active_alerts: Alert[];
}

export interface NewEmergencyEvent {
  alert_id: string;
  user_name: string;
  timestamp: string;
}

export interface LocationUpdateEvent {
  id: string;
  alert_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface UpdateMapEvent {
  alert_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface EmergencyResolvedEvent {
  alert_id: string;
}

export interface SosTrackingPayload {
  alert_id: string;
  latitude: number;
  longitude: number;
}
