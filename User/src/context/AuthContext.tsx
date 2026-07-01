import React, { createContext, useContext, useEffect, useState } from "react";
import { User, authApi } from "../services/authApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Gagal verifikasi token", error);
        localStorage.removeItem("auth_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ identifier, password });
      localStorage.setItem("auth_token", response.token);
      setUser(response.user);
    } catch (error) {
      localStorage.removeItem("auth_token");
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      localStorage.setItem("auth_token", response.token);
      setUser(response.user);
    } catch (error) {
      localStorage.removeItem("auth_token");
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Gagal logout di server", error);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
