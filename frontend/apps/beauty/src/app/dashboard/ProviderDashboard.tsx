"use client";

import { useEffect, useState, useCallback } from "react";
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
  state?: string;
  description?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  address?: string;
  categories?: string[];
  services?: ServiceItem[];
  galleryImages?: GalleryImage[];
}

interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  priceFrom: number;
  priceTo?: number;
  durationMinutes: number;
  categoryName?: string;
}

interface GalleryImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceInterest?: string;
  createdAt: string;
  isRead: boolean;
}

type Tab = "overview" | "profile" | "services" | "gallery" | "enquiries" | "billing";

export function ProviderDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const loadData = useCallback(async (storedToken: string) => {
    const profileResponse = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${storedToken}` } });
    const profileJson = await profileResponse.json().catch(() => null) as { success?: boolean; data?: UserProfile } | null;
    if (!profileResponse.ok || !profileJson?.success || !profileJson.data) {
      localStorage.removeItem("beauty_access_token");
      setLoading(false);
      return;
    }

    setProfile(profileJson.data);
    if (profileJson.data.providerId) {
      const providerResponse = await fetch(`${API_URL}/providers/id/${profileJson.data.providerId}`, { headers: { Authorization: `Bearer ${storedToken}` } });
      const providerJson = await providerResponse.json().catch(() => null) as { success?: boolean; data?: ProviderProfile } | null;
      if (providerResponse.ok && providerJson?.success && providerJson.data) {
        setProvider(providerJson.data);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("beauty_access_token");
    setToken(storedToken);
    if (!storedToken) {
      setLoading(false);
      return;
    }
    loadData(storedToken);
  }, [loadData]);

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
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400 }}>Provider Dashboard</h1>
        <p className="mt-4 text-[15px]" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>Sign in to manage your beauty business listing.</p>
        <Link href="/login" className="mt-7 inline-flex px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>Sign in</Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "profile", label: "Profile", icon: "✏️" },
    { id: "services", label: "Services", icon: "💅" },
    { id: "gallery", label: "Gallery", icon: "📸" },
    { id: "enquiries", label: "Enquiries", icon: "💬" },
    { id: "billing", label: "Billing", icon: "💳" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="text-[13px] font-medium" style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}>Provider Dashboard</p>
          <h1 className="mt-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400 }}>Hello, {profile.firstName}</h1>
        </div>
        <div className="flex items-center gap-3">
          {provider && (
            <Link href={`/provider/${provider.slug}`} className="px-4 py-2 text-[13px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>View Live Profile</Link>
          )}
          <button onClick={logout} className="px-4 py-2 text-[13px] font-medium" style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)' }}>Sign out</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1" style={{ borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors"
            style={{
              fontFamily: 'var(--font-body)',
              color: activeTab === tab.id ? 'var(--brand-rose)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--brand-rose)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab profile={profile} provider={provider} />}
      {activeTab === "profile" && <ProfileTab provider={provider} token={token} onUpdate={() => token && loadData(token)} />}
      {activeTab === "services" && <ServicesTab provider={provider} token={token} onUpdate={() => token && loadData(token)} />}
      {activeTab === "gallery" && <GalleryTab provider={provider} />}
      {activeTab === "enquiries" && <EnquiriesTab provider={provider} token={token} />}
      {activeTab === "billing" && <BillingTab provider={provider} />}
    </div>
  );
}

/* ─── Overview Tab ───────────────────────────────────────────── */
function OverviewTab({ profile, provider }: { profile: UserProfile; provider: ProviderProfile | null }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <Panel label="Account" value={profile.email} meta={profile.roles.join(", ") || "Provider"} />
        <Panel label="Listing" value={provider?.businessName || "No linked listing"} meta={provider ? `Status: ${provider.status}` : "Create or claim a listing"} />
        <Panel label="Data Status" value={provider?.hasRealData ? "Source checked" : "Needs review"} meta={provider?.city ? `${provider.city}, ${provider.state || 'WA'}` : "Perth, WA"} />
      </div>

      {!provider && (
        <div className="p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <span className="text-[48px] block mb-4">💼</span>
          <h3 className="text-[18px] mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>No listing yet</h3>
          <p className="text-[14px] mb-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>Create your free business listing to start getting discovered by Perth locals.</p>
          <Link href="/join" className="px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>List Your Business</Link>
        </div>
      )}

      {provider && (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h3 className="text-[16px] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Quick Actions</h3>
            <div className="space-y-3">
              <Link href={`/provider/${provider.slug}`} className="flex items-center gap-3 p-3 transition-colors" style={{ background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                <span>👁️</span>
                <span className="text-[14px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>View live profile</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-3 p-3 transition-colors" style={{ background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                <span>📧</span>
                <span className="text-[14px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Contact support</span>
              </Link>
            </div>
          </div>

          <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h3 className="text-[16px] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Listing Completeness</h3>
            <div className="space-y-2">
              <CheckItem label="Business name" done={!!provider.businessName} />
              <CheckItem label="Description" done={!!provider.description} />
              <CheckItem label="Contact details" done={!!(provider.phone || provider.email)} />
              <CheckItem label="Website or social" done={!!(provider.website || provider.instagramUrl)} />
              <CheckItem label="Services listed" done={(provider.services?.length ?? 0) > 0} />
              <CheckItem label="Gallery photos" done={(provider.galleryImages?.length ?? 0) > 0} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[11px]" style={{ background: done ? 'rgba(16,185,129,0.1)' : 'var(--bg-secondary)', color: done ? '#10b981' : 'var(--text-muted)' }}>
        {done ? '✓' : '·'}
      </div>
      <span className="text-[13px]" style={{ fontFamily: 'var(--font-body)', color: done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

/* ─── Profile Editor Tab ─────────────────────────────────────── */
function ProfileTab({ provider, token, onUpdate }: { provider: ProviderProfile | null; token: string | null; onUpdate: () => void }) {
  const [form, setForm] = useState({
    businessName: provider?.businessName || '',
    tagline: provider?.tagline || '',
    description: provider?.description || '',
    phone: provider?.phone || '',
    email: provider?.email || '',
    website: provider?.website || '',
    instagramUrl: provider?.instagramUrl || '',
    facebookUrl: provider?.facebookUrl || '',
    city: provider?.city || '',
    address: provider?.address || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!provider) {
    return (
      <div className="p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>No listing to edit. <Link href="/join" className="underline" style={{ color: 'var(--brand-rose)' }}>Create one</Link></p>
      </div>
    );
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  async function save() {
    if (!token || !provider) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/providers/${provider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        onUpdate();
      } else {
        const json = await res.json().catch(() => null);
        setMessage({ type: 'error', text: json?.message || 'Failed to update profile.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h2 className="text-[18px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Edit Profile</h2>

        {message && (
          <div className="p-3 text-[13px]" style={{
            background: message.type === 'success' ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
            borderRadius: '4px',
            color: message.type === 'success' ? '#059669' : '#dc2626',
          }}>{message.text}</div>
        )}

        <FormField label="Business Name" value={form.businessName} onChange={set('businessName')} />
        <FormField label="Tagline" value={form.tagline} onChange={set('tagline')} placeholder="A short description of your business" />
        <FormField label="Description" value={form.description} onChange={set('description')} multiline placeholder="Tell customers what makes your business special..." />
        <FormField label="Suburb" value={form.city} onChange={set('city')} />
        <FormField label="Address" value={form.address} onChange={set('address')} placeholder="Street address (optional)" />
        <FormField label="Phone" value={form.phone} onChange={set('phone')} placeholder="0400 000 000" />
        <FormField label="Email" value={form.email} onChange={set('email')} type="email" />
        <FormField label="Website" value={form.website} onChange={set('website')} placeholder="https://yourbusiness.com" type="url" />
        <FormField label="Instagram" value={form.instagramUrl} onChange={set('instagramUrl')} placeholder="https://instagram.com/yourbusiness" type="url" />
        <FormField label="Facebook" value={form.facebookUrl} onChange={set('facebookUrl')} placeholder="https://facebook.com/yourbusiness" type="url" />

        <button onClick={save} disabled={saving} className="px-6 py-3 text-[14px] font-medium text-white disabled:opacity-50" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = 'text', multiline }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; type?: string; multiline?: boolean;
}) {
  const inputStyle = { border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' };
  return (
    <div>
      <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={onChange} rows={4} placeholder={placeholder} className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none resize-none" style={inputStyle} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={inputStyle} />
      )}
    </div>
  );
}

/* ─── Services Tab ────────────────────────────────────────────── */
function ServicesTab({ provider, token, onUpdate }: { provider: ProviderProfile | null; token: string | null; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', priceFrom: '', priceTo: '', durationMinutes: '60' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!provider) {
    return <div className="p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}><p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>Create a listing first to add services.</p></div>;
  }

  const services = provider.services || [];

  async function addService() {
    if (!token || !provider || !form.name || !form.priceFrom) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/providers/${provider.id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          priceFrom: parseFloat(form.priceFrom),
          priceTo: form.priceTo ? parseFloat(form.priceTo) : undefined,
          durationMinutes: parseInt(form.durationMinutes) || 60,
        }),
      });
      if (res.ok) {
        setForm({ name: '', description: '', priceFrom: '', priceTo: '', durationMinutes: '60' });
        setShowForm(false);
        onUpdate();
      } else {
        setMessage('Failed to add service.');
      }
    } catch {
      setMessage('Network error.');
    }
    setSaving(false);
  }

  async function deleteService(serviceId: string) {
    if (!token || !provider) return;
    await fetch(`${API_URL}/providers/${provider.id}/services/${serviceId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    onUpdate();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Services ({services.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 text-[13px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {message && <div className="p-3 text-[13px]" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px', color: '#dc2626' }}>{message}</div>}

      {showForm && (
        <div className="p-5 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <FormField label="Service Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gel Manicure" />
          <FormField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Price From *" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} placeholder="45" />
            <FormField label="Price To" value={form.priceTo} onChange={(e) => setForm({ ...form, priceTo: e.target.value })} placeholder="65" />
            <FormField label="Duration (min)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} placeholder="60" />
          </div>
          <button onClick={addService} disabled={saving || !form.name || !form.priceFrom} className="px-5 py-2.5 text-[13px] font-medium text-white disabled:opacity-50" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
            {saving ? 'Adding...' : 'Add Service'}
          </button>
        </div>
      )}

      {services.length > 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 className="text-[15px] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{svc.name}</h3>
                {svc.description && <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{svc.description}</p>}
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>⏱ {svc.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${svc.priceFrom}{svc.priceTo && svc.priceTo !== svc.priceFrom ? ` – $${svc.priceTo}` : ''}
                </span>
                <button onClick={() => deleteService(svc.id)} className="text-[12px] px-2 py-1" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <span className="text-[36px] block mb-3">💅</span>
          <p className="text-[14px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>No services yet. Add your first service to help customers find you.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Gallery Tab ─────────────────────────────────────────────── */
function GalleryTab({ provider }: { provider: ProviderProfile | null }) {
  if (!provider) {
    return <div className="p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}><p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>Create a listing first to add gallery photos.</p></div>;
  }

  const images = provider.galleryImages || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Gallery ({images.length})</h2>
      </div>

      <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <p className="text-[14px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          Gallery uploads are coming soon. Contact <Link href="/contact" className="underline" style={{ color: 'var(--brand-rose)' }}>support</Link> to have photos added to your listing.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="aspect-square overflow-hidden" style={{ borderRadius: '8px', background: 'var(--bg-secondary)' }}>
              <img src={img.thumbnailUrl || img.imageUrl} alt={img.altText || ''} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Enquiries Tab ───────────────────────────────────────────── */
function EnquiriesTab({ provider, token }: { provider: ProviderProfile | null; token: string | null }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider || !token) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const res = await fetch(`${API_URL}/enquiries/provider/${provider!.id}`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json().catch(() => null) as { success?: boolean; data?: { items: Enquiry[] } } | null;
        if (res.ok && json?.success && json.data?.items) {
          setEnquiries(json.data.items);
        }
      } catch { /* empty */ }
      setLoading(false);
    }
    load();
  }, [provider, token]);

  if (!provider) {
    return <div className="p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}><p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>Create a listing first to receive enquiries.</p></div>;
  }

  if (loading) {
    return <div className="py-12 text-center text-[14px]" style={{ color: 'var(--text-muted)' }}>Loading enquiries...</div>;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[18px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Enquiries ({enquiries.length})</h2>

      {enquiries.length > 0 ? (
        <div className="space-y-3">
          {enquiries.map((enq) => (
            <div key={enq.id} className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{enq.name}</h3>
                  <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {enq.email}{enq.phone ? ` · ${enq.phone}` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {new Date(enq.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {!enq.isRead && (
                    <span className="block text-[10px] font-medium mt-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(200,115,122,0.12)', color: 'var(--brand-rose)' }}>New</span>
                  )}
                </div>
              </div>
              {enq.serviceInterest && (
                <span className="inline-block mt-2 text-[12px] px-2.5 py-0.5" style={{ background: 'var(--bg-secondary)', borderRadius: '50px', color: 'var(--text-secondary)' }}>
                  {enq.serviceInterest}
                </span>
              )}
              <p className="text-[14px] font-light mt-3 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{enq.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <span className="text-[36px] block mb-3">💬</span>
          <p className="text-[14px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>No enquiries yet. Share your profile to start receiving customer messages.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Panel Component ─────────────────────────────────────────── */
function Panel({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <p className="text-[12px] uppercase tracking-wide" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{label}</p>
      <p className="mt-3 text-[18px] font-medium truncate" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{value}</p>
      <p className="mt-1 text-[13px]" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{meta}</p>
    </div>
  );
}

/* ─── Billing Tab ─────────────────────────────────────────────── */
function BillingTab({ provider }: { provider: ProviderProfile | null }) {
  const providerQuery = provider ? `&providerId=${provider.id}` : "";

  return (
    <div className="space-y-6">
      <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h3 className="text-[16px] font-medium mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[20px] font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Free</p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>Basic listing with core features</p>
          </div>
          {provider ? (
            <Link href="/pricing" className="px-5 py-2.5 text-[13px] font-medium text-white transition-all" style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
              Upgrade Plan
            </Link>
          ) : (
            <Link href="/join" className="px-5 py-2.5 text-[13px] font-medium text-white transition-all" style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
              Create Listing
            </Link>
          )}
        </div>
      </div>

      <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h3 className="text-[16px] font-medium mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Plan Comparison</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { id: 'free', name: 'Free', price: '$0', features: ['Basic listing', '5 photos', 'Enquiry form'] },
            { id: 'pro', name: 'Pro', price: '$29/mo', features: ['Featured placement', 'Unlimited photos', 'Priority search'] },
            { id: 'premium', name: 'Premium', price: '$59/mo', features: ['Homepage feature', 'Verified badge', 'Performance reports'] },
          ].map((plan) => (
            <div key={plan.name} className="p-4" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <p className="text-[15px] font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{plan.name}</p>
              <p className="text-[18px] font-medium mb-3" style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}>{plan.price}</p>
              {plan.features.map((f) => (
                <p key={f} className="text-[12px] py-1" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{f}</p>
              ))}
              {plan.id !== 'free' && provider && (
                <form action={`/api/checkout?plan=${plan.id}${providerQuery}`} method="POST" className="mt-4">
                  <button type="submit" className="w-full py-2 text-[12px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
                    Choose {plan.name}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
