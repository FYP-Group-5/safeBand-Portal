// ─── Request bodies ────────────────────────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── API response shapes ────────────────────────────────────────────────────

/** Returned on any 4xx / 5xx */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface RegisterSuccessResponse {
  success: true;
  message: string;
  data: RegisteredUser;
}

export type UserRole = "admin" | "user" | "responder";

export interface LoggedInUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  role: UserRole;
}

export interface LoginSuccessResponse {
  message: string;
  user: LoggedInUser;
  token: string;
}

// ─── Server-action return type ──────────────────────────────────────────────

/**
 * Returned by server actions when the backend reports an error.
 * On success the action calls `redirect()` and never reaches the client.
 */
export type ActionError = { success: false; error: string };
