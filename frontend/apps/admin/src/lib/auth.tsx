"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");
    if (token && user) {
      try {
        setState({ token, user: JSON.parse(user), loading: false });
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setState({ user: null, token: null, loading: false });
      }
    } else {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!json.success || !json.data) {
        return json.message || "Login failed";
      }
      const { accessToken, user } = json.data;
      const isAdmin = user.roles?.some((r: string) => r === "SuperAdmin" || r === "Moderator");
      if (!isAdmin) {
        return "Access denied — admin or moderator role required";
      }
      localStorage.setItem("admin_token", accessToken);
      localStorage.setItem("admin_user", JSON.stringify(user));
      setState({ token: accessToken, user, loading: false });
      return null;
    } catch {
      return "Network error — unable to reach server";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
