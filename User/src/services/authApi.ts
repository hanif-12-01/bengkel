import { apiFetch } from "./apiClient";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin" | "mechanic";
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
}

export const authApi = {
  login: async (credentials: { email: string; password?: string }): Promise<LoginResponse> => {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<RegisterResponse> => {
    return apiFetch<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me: async (): Promise<User> => {
    return apiFetch<User>("/auth/me");
  },

  logout: async (): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  },
};