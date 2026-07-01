import { apiFetch } from "./apiClient";

export interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: "customer" | "admin" | "mechanic";
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: { identifier: string; password: string }): Promise<LoginResponse> => {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }): Promise<RegisterResponse> => {
    return apiFetch<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me: async (): Promise<User> => {
    const response = await apiFetch<{ user: User }>("/auth/me");
    return response.user;
  },

  logout: async (): Promise<null> => {
    return apiFetch<null>("/auth/logout", {
      method: "POST",
    });
  },
};
