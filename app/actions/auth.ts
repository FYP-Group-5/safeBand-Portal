"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  RegisterRequest,
  LoginRequest,
  ActionError,
  ApiErrorResponse,
  LoginSuccessResponse,
  UserRole,
} from "@/types/auth";

export async function login(data: LoginRequest): Promise<ActionError | void> {
  let response: Response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    return {
      success: false,
      error: "Unable to connect to server. Please try again.",
    };
  }

  if (!response.ok) {
    try {
      const errorBody: ApiErrorResponse = await response.json();
      return { success: false, error: errorBody.message };
    } catch {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }

  let result: LoginSuccessResponse;

  try {
    result = await response.json();
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
  const role: UserRole = result.user.role;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 365 days (persistent emergency session)
  };

  const cookieStore = await cookies();
  cookieStore.set("session_token", result.token, cookieOptions);
  cookieStore.set("user_role", role, cookieOptions);
  // Set non-httpOnly client_token so WebSocket handshake in browser can read token
  cookieStore.set("client_token", result.token, { ...cookieOptions, httpOnly: false });

  const roleHome: Record<UserRole, string> = {
    admin: "/admin",
    user: "/dashboard",
    responder: "/responder/dashboard",
  };

  redirect(roleHome[role] ?? "/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  cookieStore.delete("user_role");
  cookieStore.delete("client_token");
  redirect("/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token");
}

export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value || cookieStore.get("client_token")?.value || "";
}

export async function register(
  data: RegisterRequest,
): Promise<ActionError | void> {
  let response: Response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    return {
      success: false,
      error: "Unable to connect to server. Please try again.",
    };
  }

  if (!response.ok) {
    try {
      const errorBody: ApiErrorResponse = await response.json();
      return { success: false, error: errorBody.message };
    } catch {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }

  try {
    await response.json();
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }

  redirect("/login");
}
