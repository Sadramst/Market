"use client";
import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  providerId?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const TOKEN_KEY = "beauty_access_token";
const REFRESH_KEY = "beauty_refresh_token";
const USER_KEY = "beauty_user";

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      if (token && userStr) {
        const user = JSON.parse(userStr) as AuthUser;
        setState({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    } catch {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  return { ...state, logout };
}
