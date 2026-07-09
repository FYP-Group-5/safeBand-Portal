"use server";

import { cookies } from "next/headers";
import type { ActionError, ApiErrorResponse } from "@/types/auth";
import type {
  InviteResponderRequest,
  InviteResponderSuccessResponse,
  ActivateResponderRequest,
} from "@/types/responder";

/**
 * Sends an invitation email to a new responder.
 * Requires an active session — the token is read from the httpOnly cookie
 * and forwarded as `Authorization: Bearer <token>`.
 */
export async function inviteResponder(
  data: InviteResponderRequest,
): Promise<ActionError | { success: true; message: string }> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  let response: Response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
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

  let result: InviteResponderSuccessResponse;

  try {
    result = await response.json();
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }

  return { success: true, message: result.message };
}

/**
 * Accepts a responder invite — submits the invite token (from the email link)
 * together with the responder's chosen password.
 * This is a public endpoint; no session cookie is required.
 */
export async function activateResponder(
  data: ActivateResponderRequest,
): Promise<ActionError | { success: true }> {
  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/responder-activate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
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

  return { success: true };
}
