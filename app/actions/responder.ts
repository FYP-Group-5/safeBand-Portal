"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionError, ApiErrorResponse } from "@/types/auth";
import type {
  InviteResponderRequest,
  InviteResponderSuccessResponse,
  ActivateResponderRequest,
  ActivateResponderSuccessResponse,
  UserInfo,
  Responder,
} from "@/types/responder";

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

export async function activateResponder(
  data: ActivateResponderRequest,
): Promise<ActionError | void> {
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

  let result: ActivateResponderSuccessResponse;

  try {
    result = await response.json();
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };

  const cookieStore = await cookies();
  cookieStore.set("session_token", result.token, cookieOptions);
  cookieStore.set("user_role", result.user.role, cookieOptions);

  redirect("/responder/dashboard");
}

export async function getInviter(
  userId: number,
): Promise<ActionError | { success: true; data: UserInfo }> {
  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      { method: "GET" },
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
    const result = await response.json();
    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateResponder(
  id: string,
  data: Partial<InviteResponderRequest>,
): Promise<
  ActionError | { success: true; message: string; data: Responder }
> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/responders/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
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
      if (response.status === 404) {
        return { success: false, error: "Responder not found or unauthorized" };
      }
      return { success: false, error: errorBody.message };
    } catch {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }

  try {
    const result = await response.json();
    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteResponder(
  id: string,
): Promise<ActionError | { success: true; message: string }> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/responders/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
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
      if (response.status === 404) {
        return { success: false, error: "Responder not found or unauthorized" };
      }
      return { success: false, error: errorBody.message };
    } catch {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }

  try {
    const result = await response.json();
    return { success: true, message: result.message };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getResponders(): Promise<
  ActionError | { success: true; data: Responder[] }
> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  let response: Response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
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
    const result = await response.json();
    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
