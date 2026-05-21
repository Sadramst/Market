"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@appilico/shared/api";

const categoryOptions = [
  { label: "Nails", value: "nails" },
  { label: "Hair", value: "hair" },
  { label: "Lashes", value: "lashes" },
  { label: "Brows", value: "brows" },
  { label: "Skin Care", value: "skin-care" },
  { label: "Makeup", value: "makeup" },
  { label: "Body", value: "body" },
  { label: "Cosmetic", value: "cosmetic" },
  { label: "Wellness", value: "wellness" },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  businessName: string;
  category: string;
  city: string;
  description: string;
  website: string;
  instagram: string;
};

const initial: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  businessName: "",
  category: "",
  city: "",
  description: "",
  website: "",
  instagram: "",
};

export function JoinForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const validateStep1 = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.businessName || !form.category || !form.city) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const next = () => {
    setError("");
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const back = () => {
    setError("");
    setStep(step - 1);
  };

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      // Step 1: Register account
      const authRes = await apiClient<{ accessToken: string }>("/auth/register", {
        method: "POST",
        body: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          confirmPassword: form.password,
          phoneNumber: form.phone,
        },
      });

      if (!authRes.success || !authRes.data?.accessToken) {
        setError(authRes.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      const token = authRes.data.accessToken;

      // Step 2: Create provider profile
      const providerRes = await apiClient("/providers", {
        method: "POST",
        token,
        body: {
          businessName: form.businessName,
          description: form.description || undefined,
          phone: form.phone || undefined,
          email: form.email,
          website: form.website || undefined,
          providerType: 0, // Beauty
          city: form.city,
          state: "WA",
          instagramUrl: form.instagram || undefined,
        },
      });

      if (!providerRes.success) {
        setError(providerRes.message || "Failed to create provider profile.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
        <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(16,185,129,0.1)' }}>
          <svg className="w-7 h-7" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>Application Submitted!</h2>
        <p className="text-[15px] font-light mb-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          We&apos;ll review your listing and approve it within 24 hours. You&apos;ll receive an email once your profile is live.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 text-[13px] font-medium text-white transition-colors"
          style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const stepLabels = ["Account", "Business", "About", "Review"];

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8 px-4">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ background: i + 1 <= step ? 'var(--brand-rose)' : 'var(--bg-secondary)', color: i + 1 <= step ? '#fff' : 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              {i + 1 <= step - 1 ? "✓" : i + 1}
            </div>
            <span className="ml-2 text-sm hidden sm:inline" style={{ fontFamily: 'var(--font-body)', color: i + 1 === step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i + 1 === step ? 500 : 400 }}>{label}</span>
            {i < stepLabels.length - 1 && (
              <div className="w-8 sm:w-12 h-px mx-2" style={{ background: i + 1 < step ? 'var(--brand-rose)' : 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
        {error && (
          <div className="mb-5 p-3 text-sm" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px', color: '#dc2626' }}>{error}</div>
        )}

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 600, marginBottom: '2px' }}>Create Your Account</h2>
            <p className="text-[13px] mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Start with your personal details</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>First Name *</label>
                <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane"
                  className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Last Name *</label>
                <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith"
                  className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Email *</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Phone</label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="0400 000 000"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Password *</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="Min 8 characters"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter password"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        )}

        {/* Step 2: Business */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 600, marginBottom: '2px' }}>Business Details</h2>
            <p className="text-[13px] mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Tell us about your beauty business</p>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Business Name *</label>
              <input type="text" value={form.businessName} onChange={set("businessName")} placeholder="e.g. Luxe Nails Subiaco"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Category *</label>
              <select value={form.category} onChange={set("category")}
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                <option value="">Select a category</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Suburb *</label>
              <input type="text" value={form.city} onChange={set("city")} placeholder="e.g. Subiaco"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        )}

        {/* Step 3: About */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 600, marginBottom: '2px' }}>About Your Business</h2>
            <p className="text-[13px] mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Help customers learn about you</p>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Description</label>
              <textarea value={form.description} onChange={set("description")} rows={4}
                placeholder="Tell customers what makes your business special..."
                maxLength={500}
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none resize-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{form.description.length}/500</p>
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Website</label>
              <input type="url" value={form.website} onChange={set("website")} placeholder="https://yourbusiness.com"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Instagram</label>
              <input type="url" value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/yourbusiness"
                className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none" style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 600, marginBottom: '2px' }}>Review & Submit</h2>
            <p className="text-[13px] mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Check your details before submitting</p>

            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Name</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{form.firstName} {form.lastName}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{form.email}</span>
              </div>
              {form.phone && (
                <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{form.phone}</span>
                </div>
              )}
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Business</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{form.businessName}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Category</span>
                <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{form.category.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Suburb</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{form.city}</span>
              </div>
              {form.description && (
                <div className="py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="block mb-1" style={{ color: 'var(--text-muted)' }}>Description</span>
                  <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{form.description}</span>
                </div>
              )}
            </div>

            <p className="text-[12px] mt-4" style={{ color: 'var(--text-muted)' }}>
              By submitting, you agree to our Terms of Service and Privacy Policy.
              Your listing will be reviewed and approved within 24 hours.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          {step > 1 ? (
            <button onClick={back} className="px-5 py-2.5 text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button onClick={next} className="px-6 py-3 text-[13px] font-medium text-white transition-all"
              style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
              Continue →
            </button>
          ) : (
            <button onClick={submit} disabled={loading}
              className="px-6 py-3 text-[13px] font-medium text-white transition-all disabled:opacity-50"
              style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
