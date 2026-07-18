"use server";

import { cookies } from "next/headers";
import type { ActionError, ApiErrorResponse } from "@/types/auth";
import type { Profile, UpdateProfileRequest } from "@/types/profile";

export async function getProfile(): Promise<
  ActionError | { success: true; data: Profile }
> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile`,
      {
        method: "GET",
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
    if (!result.user) return { success: false, error: "Unexpected response format." };
    return { success: true, data: result.user };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<ActionError | { success: true; data: Profile }> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile`,
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
    const user = result.user || result;
    return { success: true, data: user };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
