"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.appilico.com.au/api";

const TOKEN_KEY = "services_access_token";
const REFRESH_KEY = "services_refresh_token";
const USER_KEY = "services_user";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    providerId?: string;
  };
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json().catch(() => null) as { success?: boolean; data?: LoginResponse; message?: string } | null;

      if (!response.ok || !json?.success || !json.data) {
        throw new Error(json?.message || "Unable to sign in");
      }

      localStorage.setItem(TOKEN_KEY, json.data.accessToken);
      localStorage.setItem(REFRESH_KEY, json.data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(json.data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 text-[14px] rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 text-[15px] text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
            Password
          </label>
          <Link href="/contact" className="text-[12px] text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 text-[15px] text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3.5 text-[15px] font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-[13px] text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/join" className="text-blue-600 font-medium hover:text-blue-700">
          List your service
        </Link>
      </p>
    </form>
  );
}
