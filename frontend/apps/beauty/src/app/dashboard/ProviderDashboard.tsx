"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  providerId?: string;
}

interface ProviderProfile {
  id: string;
  businessName: string;
  slug: string;
  status: string;
  isClaimed: boolean;
  hasRealData: boolean;
  city?: string;
}

export function ProviderDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("beauty_access_token");
    setToken(storedToken);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    async function load() {
      const profileResponse = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${storedToken}` } });
      const profileJson = await profileResponse.json().catch(() => null) as { success?: boolean; data?: UserProfile } | null;
      if (!profileResponse.ok || !profileJson?.success || !profileJson.data) {
        localStorage.removeItem("beauty_access_token");
        setLoading(false);
        return;
      }

      setProfile(profileJson.data);
      if (profileJson.data.providerId) {
        const providerResponse = await fetch(`${API_URL}/providers/id/${profileJson.data.providerId}`);
        const providerJson = await providerResponse.json().catch(() => null) as { success?: boolean; data?: ProviderProfile } | null;
        if (providerResponse.ok && providerJson?.success && providerJson.data) {
          setProvider(providerJson.data);
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  function logout() {
    localStorage.removeItem("beauty_access_token");
    localStorage.removeItem("beauty_refresh_token");
    localStorage.removeItem("beauty_user");
    setToken(null);
    setProfile(null);
    setProvider(null);
  }

  if (loading) {
    return <div className="py-24 text-center text-[14px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Loading dashboard...</div>;
  }

  if (!token || !profile) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400 }}>Provider dashboard</h1>
        <p className="mt-4 text-[15px]" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>Sign in to manage provider details, claims, and listing readiness.</p>
        <Link href="/login" className="mt-7 inline-flex px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>Sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="text-[13px] font-medium" style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}>Provider dashboard</p>
          <h1 className="mt-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400 }}>Hello, {profile.firstName}</h1>
        </div>
        <button onClick={logout} className="px-4 py-2 text-[13px] font-medium" style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)' }}>Sign out</button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Panel label="Account" value={profile.email} meta={profile.roles.join(", ") || "User"} />
        <Panel label="Listing" value={provider?.businessName || "No linked listing"} meta={provider?.status || "Claim or create a listing"} />
        <Panel label="Data status" value={provider?.hasRealData ? "Source checked" : "Needs review"} meta={provider?.city || "Perth, WA"} />
      </div>

      <section className="mt-8 p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h2 className="text-[22px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Listing actions</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {provider ? <Link href={`/provider/${provider.slug}`} className="px-5 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>View profile</Link> : <Link href="/join" className="px-5 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>List business</Link>}
          <Link href="/contact" className="px-5 py-3 text-[14px] font-medium" style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)' }}>Contact support</Link>
        </div>
      </section>
    </div>
  );
}

function Panel({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <p className="text-[12px] uppercase tracking-wide" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{label}</p>
      <p className="mt-3 text-[18px] font-medium truncate" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{value}</p>
      <p className="mt-1 text-[13px]" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{meta}</p>
    </div>
  );
}
