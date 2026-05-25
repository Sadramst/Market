"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  addressLine1?: string;
  suburb?: string;
  postCode?: string;
  state?: string;
  roles: string[];
  providerId?: string;
  createdAt?: string;
}

function AvatarCircle({ name, size = 64 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--brand-rose)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: size / 2.5,
        fontWeight: 600,
        fontFamily: "var(--font-heading)",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export function ProfileClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Check welcome flag from signup redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") === "1") setWelcome(true);

    const token = localStorage.getItem("beauty_access_token");
    if (!token) { router.push("/login"); return; }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setProfile(json.data);
          setForm(json.data);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const set = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const token = localStorage.getItem("beauty_access_token");
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          addressLine1: form.addressLine1,
          suburb: form.suburb,
          postCode: form.postCode,
          state: form.state,
        }),
      });
      const json = await res.json();
      if (json?.success && json?.data) {
        setProfile(json.data);
        setForm(json.data);
        // Also update localStorage user object
        const stored = localStorage.getItem("beauty_user");
        if (stored) {
          const user = JSON.parse(stored);
          user.firstName = json.data.firstName;
          user.lastName = json.data.lastName;
          localStorage.setItem("beauty_user", JSON.stringify(user));
        }
        setSuccess(true);
        setEditing(false);
      } else {
        throw new Error(json?.message || "Update failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    ["beauty_access_token", "beauty_refresh_token", "beauty_user"].forEach((k) =>
      localStorage.removeItem(k)
    );
    router.push("/");
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-[15px]" style={{ color: "var(--text-muted)" }}>Loading…</div>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const inputStyle = { border: "1px solid var(--border)", borderRadius: "2px", color: "var(--text-primary)" };
  const labelStyle = { color: "var(--text-muted)", fontFamily: "var(--font-body)" };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome banner */}
      {welcome && (
        <div className="mb-6 px-5 py-4 rounded-lg text-[15px]" style={{ background: "rgba(190,18,60,0.06)", border: "1px solid rgba(190,18,60,0.15)", color: "var(--brand-rose)", fontFamily: "var(--font-body)" }}>
          🎉 Welcome to Appilico! Complete your profile to get personalised recommendations.
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <AvatarCircle name={fullName} size={72} />
        <div>
          <h1 className="text-[28px] font-normal" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>{fullName}</h1>
          <p className="text-[14px] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{profile.email}</p>
          {profile.postCode && (
            <p className="text-[13px] mt-1 font-medium" style={{ color: "var(--brand-rose)", fontFamily: "var(--font-body)" }}>
              📍 {profile.suburb ? `${profile.suburb}, ` : ""}{profile.postCode}
            </p>
          )}
        </div>
        <div className="ml-auto flex gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-[13px] font-medium"
              style={{ border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
            >
              Edit profile
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 text-[13px] font-medium"
            style={{ border: "1px solid rgba(190,18,60,0.3)", borderRadius: "4px", color: "#be123c", fontFamily: "var(--font-body)" }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Success/Error */}
      {success && (
        <div className="mb-4 px-4 py-3 text-[14px] rounded" style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", color: "#15803d" }}>
          Profile updated successfully.
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 text-[14px] rounded" style={{ background: "rgba(190,18,60,0.08)", border: "1px solid rgba(190,18,60,0.15)", color: "#be123c" }}>
          {error}
        </div>
      )}

      {/* Profile card */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <form onSubmit={saveProfile}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-[16px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>Personal details</h2>
          </div>

          <div className="px-6 py-6 space-y-5">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>First name</label>
                {editing
                  ? <input type="text" value={form.firstName || ""} onChange={set("firstName")} required className="w-full px-3 py-2.5 text-[15px] bg-transparent focus:outline-none" style={inputStyle} />
                  : <p className="text-[15px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{profile.firstName}</p>
                }
              </div>
              <div>
                <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>Last name</label>
                {editing
                  ? <input type="text" value={form.lastName || ""} onChange={set("lastName")} required className="w-full px-3 py-2.5 text-[15px] bg-transparent focus:outline-none" style={inputStyle} />
                  : <p className="text-[15px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{profile.lastName}</p>
                }
              </div>
            </div>

            {/* Email — always read-only */}
            <div>
              <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>Email</label>
              <p className="text-[15px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{profile.email}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>Phone</label>
              {editing
                ? <input type="tel" value={form.phoneNumber || ""} onChange={set("phoneNumber")} className="w-full px-3 py-2.5 text-[15px] bg-transparent focus:outline-none" style={inputStyle} />
                : <p className="text-[15px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{profile.phoneNumber || <span style={{ color: "var(--text-muted)" }}>Not set</span>}</p>
              }
            </div>
          </div>

          {/* Address section */}
          <div className="px-6 py-4 border-t border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-[16px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>Address</h2>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Used to show you nearby providers first</p>
          </div>

          <div className="px-6 py-6 space-y-5">
            {/* Address line */}
            <div>
              <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>Street address</label>
              {editing
                ? <input type="text" value={form.addressLine1 || ""} onChange={set("addressLine1")} placeholder="e.g. 12 Marine Parade" className="w-full px-3 py-2.5 text-[15px] bg-transparent focus:outline-none" style={inputStyle} />
                : <p className="text-[15px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{profile.addressLine1 || <span style={{ color: "var(--text-muted)" }}>Not set</span>}</p>
              }
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>Suburb</label>
                {editing
                  ? <input type="text" value={form.suburb || ""} onChange={set("suburb")} placeholder="e.g. Subiaco" className="w-full px-3 py-2.5 text-[15px] bg-transparent focus:outline-none" style={inputStyle} />
                  : <p className="text-[15px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{profile.suburb || <span style={{ color: "var(--text-muted)" }}>Not set</span>}</p>
                }
              </div>
              <div>
                <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>Postcode</label>
                {editing
                  ? <input type="text" value={form.postCode || ""} onChange={set("postCode")} placeholder="e.g. 6008" maxLength={4} pattern="[0-9]{4}" className="w-full px-3 py-2.5 text-[15px] bg-transparent focus:outline-none" style={inputStyle} />
                  : <p className="text-[15px] font-semibold" style={{ color: profile.postCode ? "var(--brand-rose)" : "var(--text-muted)", fontFamily: "var(--font-body)" }}>{profile.postCode || "Not set"}</p>
                }
              </div>
              <div>
                <label className="block text-[12px] font-medium uppercase tracking-wide mb-2" style={labelStyle}>State</label>
                {editing
                  ? <input type="text" value={form.state || ""} onChange={set("state")} placeholder="WA" maxLength={3} className="w-full px-3 py-2.5 text-[15px] bg-transparent focus:outline-none" style={inputStyle} />
                  : <p className="text-[15px]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{profile.state || <span style={{ color: "var(--text-muted)" }}>Not set</span>}</p>
                }
              </div>
            </div>

            {/* Save/Cancel buttons */}
            {editing && (
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-[14px] font-medium text-white disabled:opacity-50"
                  style={{ background: "var(--brand-rose)", borderRadius: "4px", fontFamily: "var(--font-body)" }}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setForm(profile); setError(null); }}
                  className="px-6 py-2.5 text-[14px] font-medium"
                  style={{ border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <a
          href={`/search?postCode=${profile.postCode || ""}&sortBy=distance`}
          className="block p-5 rounded-lg text-center"
          style={{ border: "1px solid var(--border)", background: "var(--bg-card)", textDecoration: "none" }}
        >
          <div className="text-2xl mb-2">📍</div>
          <div className="text-[14px] font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Providers near you</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {profile.postCode ? `Near ${profile.postCode}` : "Set your postcode above"}
          </div>
        </a>
        <a
          href="/search"
          className="block p-5 rounded-lg text-center"
          style={{ border: "1px solid var(--border)", background: "var(--bg-card)", textDecoration: "none" }}
        >
          <div className="text-2xl mb-2">✨</div>
          <div className="text-[14px] font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Browse all providers</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Explore Perth's best beauty</div>
        </a>
      </div>
    </div>
  );
}
