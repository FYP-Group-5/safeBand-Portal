export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin" | "responder";
  created_at: string;
}

export interface UpdateProfileRequest {
  name: string;
  phone?: string;
}
