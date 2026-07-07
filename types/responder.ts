// ─── Invite ────────────────────────────────────────────────────────────────

export interface InviteResponderRequest {
  name: string;
  email: string;
  phone?: string;
  relationship: string;
}

export interface Responder {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  relationship: string;
  status: "pending" | "verified";
  created_at: string;
}

export interface InviteResponderSuccessResponse {
  success: true;
  message: string;
  data: Responder;
}

// ─── Activation ────────────────────────────────────────────────────────────

export interface ActivateResponderRequest {
  code: string;
  password: string;
}

export interface ActivateResponderSuccessResponse {
  success: true;
  message: string;
}
