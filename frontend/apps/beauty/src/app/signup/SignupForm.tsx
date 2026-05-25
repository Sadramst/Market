"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

interface AuthResponse {
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

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await response.json().catch(() => null) as {
        success?: boolean; data?: AuthResponse; message?: string;
        errors?: string[] | Record<string, string[]>;
        title?: string;
      } | null;

      if (!response.ok || !json?.success || !json.data) {
        // Handle both our custom format (errors: string[]) and ASP.NET validation format (errors: {Field: string[]})
        let msg = "Registration failed";
        if (json?.errors) {
          if (Array.isArray(json.errors)) {
            msg = json.errors.join(", ") || json?.message || msg;
          } else if (typeof json.errors === "object") {
            const flat = Object.values(json.errors as Record<string, string[]>).flat();
            msg = flat.join(", ") || json?.message || msg;
          }
        } else if (json?.message) {
          msg = json.message;
        } else if (json?.title) {
          msg = json.title;
        }
        throw new Error(msg);
      }

      localStorage.setItem("beauty_access_token", json.data.accessToken);
      localStorage.setItem("beauty_refresh_token", json.data.refreshToken);
      localStorage.setItem("beauty_user", JSON.stringify(json.data.user));
      router.push("/profile?welcome=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3.5 text-[15px] bg-transparent focus:outline-none focus:ring-1";
  const inputStyle = { border: "1px solid var(--border)", borderRadius: "2px", color: "var(--text-primary)" };
  const labelClass = "block text-[12px] font-medium uppercase tracking-wide mb-2";
  const labelStyle = { color: "var(--text-muted)", fontFamily: "var(--font-body)" };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 text-[14px]" style={{ background: "rgba(190,18,60,0.08)", color: "#be123c", border: "1px solid rgba(190,18,60,0.15)", borderRadius: "4px" }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>First Name</label>
          <input type="text" value={form.firstName} onChange={set("firstName")} required className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Last Name</label>
          <input type="text" value={form.lastName} onChange={set("lastName")} required className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Email</label>
        <input type="email" value={form.email} onChange={set("email")} required className={inputClass} style={inputStyle} autoComplete="email" />
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Phone (optional)</label>
        <input type="tel" value={form.phoneNumber} onChange={set("phoneNumber")} className={inputClass} style={inputStyle} autoComplete="tel" />
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Password</label>
        <input type="password" value={form.password} onChange={set("password")} required minLength={8} className={inputClass} style={inputStyle} autoComplete="new-password" />
        <p className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>Min. 8 characters</p>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Confirm Password</label>
        <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} required className={inputClass} style={inputStyle} autoComplete="new-password" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3.5 text-[14px] font-medium text-white transition-all disabled:opacity-50 mt-2"
        style={{ background: "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)" }}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-[13px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium" style={{ color: "var(--brand-rose)" }}>Sign in</Link>
      </p>
    </form>
  );
}
