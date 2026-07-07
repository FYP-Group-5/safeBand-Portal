"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  RegisterRequest,
  LoginRequest,
  ActionError,
  ApiErrorResponse,
  RegisterSuccessResponse,
  LoginSuccessResponse,
  UserRole,
} from "@/types/auth";

export async function login(data: LoginRequest): Promise<ActionError | void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json();
    return { success: false, error: errorBody.message };
  }

  const result: LoginSuccessResponse = await response.json();
  const role: UserRole = result.user.role;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };

  const cookieStore = await cookies();
  cookieStore.set("session_token", result.token, cookieOptions);
  cookieStore.set("user_role", role, cookieOptions);

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
  redirect("/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token");
}

export async function register(
  data: RegisterRequest,
): Promise<ActionError | void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json();
    return { success: false, error: errorBody.message };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _result: RegisterSuccessResponse = await response.json();

  redirect("/login");
}
