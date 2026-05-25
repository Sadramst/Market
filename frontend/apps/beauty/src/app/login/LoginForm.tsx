"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

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

      localStorage.setItem("beauty_access_token", json.data.accessToken);
      localStorage.setItem("beauty_refresh_token", json.data.refreshToken);
      localStorage.setItem("beauty_user", JSON.stringify(json.data.user));

      // Eagerly fetch full profile to sync suburb → location chip
      try {
        const meRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${json.data.accessToken}` },
        });
        const meJson = await meRes.json().catch(() => null);
        if (meJson?.success && meJson?.data?.suburb && meJson?.data?.postCode) {
          const { suburb, postCode, state } = meJson.data;
          localStorage.setItem("appilico_preferred_suburb", JSON.stringify({
            id: "profile", name: suburb, slug: suburb.toLowerCase().replace(/\s+/g, "-"),
            state: state || "WA", postCode, providerCount: 0, distanceKm: 0,
          }));
        }
      } catch { /* non-critical — location chip can stay unset */ }

      // Customers go to their profile; providers/admins go to the dashboard
      const roles: string[] = json.data.user.roles ?? [];
      const isProviderOrAdmin = roles.some((r) => r === "Provider" || r === "SuperAdmin" || r === "Moderator");
      router.push(isProviderOrAdmin ? "/dashboard" : "/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="px-4 py-3 text-[14px]" style={{ background: 'rgba(190,18,60,0.08)', color: '#be123c', border: '1px solid rgba(190,18,60,0.15)', borderRadius: '4px' }}>{error}</div>}
      <div>
        <label htmlFor="email" className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Email</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full px-4 py-3.5 text-[15px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-primary)' }} />
      </div>
      <div>
        <label htmlFor="password" className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Password</label>
        <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full px-4 py-3.5 text-[15px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-primary)' }} />
      </div>
      <button type="submit" disabled={loading} className="w-full px-6 py-3.5 text-[14px] font-medium text-white transition-all disabled:opacity-50" style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <div className="flex items-center justify-between text-[13px]" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
        <Link href="/signup" className="hover:text-[var(--brand-rose)]">Create account</Link>
        <Link href="/join" className="hover:text-[var(--brand-rose)]">List your business</Link>
        <Link href="/contact" className="hover:text-[var(--brand-rose)]">Need access?</Link>
      </div>
    </form>
  );
}
