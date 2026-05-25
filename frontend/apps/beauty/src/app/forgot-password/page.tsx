"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Request failed");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" style={{ fontFamily: "var(--font-heading)", textDecoration: "none" }}>
            <span className="text-[28px] font-normal italic" style={{ color: "var(--text-primary)" }}>appilico</span>
            <span className="text-[28px]" style={{ color: "var(--brand-rose)" }}>*</span>
          </Link>
        </div>

        <div className="p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "4px" }}>
          {sent ? (
            <div className="text-center">
              <div className="text-[48px] mb-4">📬</div>
              <h1 className="text-[22px] font-normal mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Check your inbox
              </h1>
              <p className="text-[14px] mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                If <strong>{email}</strong> is registered, we&apos;ve sent a password reset link. Check your email and follow the instructions.
              </p>
              <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
                Didn&apos;t receive it?{" "}
                <button
                  onClick={() => { setSent(false); }}
                  className="underline"
                  style={{ color: "var(--brand-rose)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Try again
                </button>
              </p>
              <div className="mt-6">
                <Link href="/login" className="text-[13px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  ← Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-[22px] font-normal mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Reset your password
              </h1>
              <p className="text-[14px] mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              {error && (
                <div className="px-4 py-3 mb-4 text-[14px]" style={{ background: "rgba(190,18,60,0.08)", color: "#be123c", border: "1px solid rgba(190,18,60,0.15)", borderRadius: "4px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 text-[15px] bg-transparent focus:outline-none"
                    style={{ border: "1px solid var(--border)", borderRadius: "2px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-[15px] font-medium text-white transition-all"
                  style={{ background: loading ? "var(--text-muted)" : "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <div className="mt-5 text-center text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
                Remembered your password?{" "}
                <Link href="/login" style={{ color: "var(--brand-rose)" }}>Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
