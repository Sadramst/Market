"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const tokenFromUrl = searchParams.get("token") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) throw new Error(json?.message || "Reset failed");
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
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
          {done ? (
            <div className="text-center">
              <div className="text-[48px] mb-4">✅</div>
              <h1 className="text-[22px] font-normal mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Password reset!
              </h1>
              <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                Your password has been updated. Redirecting to sign in…
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-[22px] font-normal mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Set a new password
              </h1>
              <p className="text-[14px] mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Enter the reset code from your email and choose a new password.
              </p>

              {error && (
                <div className="px-4 py-3 mb-4 text-[14px]" style={{ background: "rgba(190,18,60,0.08)", color: "#be123c", border: "1px solid rgba(190,18,60,0.15)", borderRadius: "4px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                {!emailFromUrl && (
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
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    Reset code
                  </label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste the code from your email"
                    className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none font-mono"
                    style={{ border: "1px solid var(--border)", borderRadius: "2px", fontFamily: "monospace", color: "var(--text-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    New password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 text-[15px] bg-transparent focus:outline-none"
                    style={{ border: "1px solid var(--border)", borderRadius: "2px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    Confirm password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    className="w-full px-4 py-3 text-[15px] bg-transparent focus:outline-none"
                    style={{
                      border: `1px solid ${confirmPassword && confirmPassword !== newPassword ? "#be123c" : "var(--border)"}`,
                      borderRadius: "2px",
                      fontFamily: "var(--font-body)",
                      color: "var(--text-primary)",
                    }}
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-[12px] mt-1" style={{ color: "#be123c", fontFamily: "var(--font-body)" }}>Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (!!confirmPassword && confirmPassword !== newPassword)}
                  className="w-full py-3.5 text-[15px] font-medium text-white transition-all"
                  style={{ background: loading ? "var(--text-muted)" : "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Resetting…" : "Reset password"}
                </button>
              </form>

              <div className="mt-5 text-center text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
                <Link href="/forgot-password" style={{ color: "var(--brand-rose)" }}>Resend reset email</Link>
                {" · "}
                <Link href="/login" style={{ color: "var(--text-muted)" }}>Back to sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
