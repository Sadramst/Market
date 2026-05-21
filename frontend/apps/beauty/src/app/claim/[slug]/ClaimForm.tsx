"use client";

import { useState } from "react";

export function ClaimForm({ slug, businessName }: { slug: string; businessName: string }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    message: "",
  });

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.appilico.com.au/api";
      const res = await fetch(`${apiUrl}/providers/${slug}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <span className="text-5xl">✅</span>
        <h2 className="text-[22px] mt-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 400, fontStyle: 'italic' }}>Claim Request Submitted</h2>
        <p className="text-[14px] font-light mt-3 max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          Thank you, {form.fullName}. Our team will verify your ownership of <strong>{businessName}</strong> and contact you at <strong>{form.email}</strong> within 2 business days.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', fontSize: '14px',
    fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
    background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: '2px', outline: 'none',
  };

  return (
    <div className="p-6 sm:p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h2 className="text-[18px] mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>
        {step === 1 ? "Step 1: Your Details" : "Step 2: Verify Ownership"}
      </h2>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        <div className="h-1 flex-1 rounded-full" style={{ background: 'var(--brand-rose)' }} />
        <div className="h-1 flex-1 rounded-full" style={{ background: step >= 2 ? 'var(--brand-rose)' : 'var(--border)' }} />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Full Name *</label>
            <input type="text" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Your full name" style={inputStyle} />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Email Address *</label>
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" style={inputStyle} />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Phone Number *</label>
            <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="04XX XXX XXX" style={inputStyle} />
          </div>
          <button
            disabled={!form.fullName || !form.email || !form.phone}
            onClick={() => setStep(2)}
            className="w-full mt-2 px-4 py-3.5 text-[14px] font-medium text-white transition-all disabled:opacity-40"
            style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Your Role *</label>
            <select value={form.role} onChange={(e) => updateField("role", e.target.value)} style={inputStyle}>
              <option value="">Select your role...</option>
              <option value="owner">Business Owner</option>
              <option value="manager">Manager</option>
              <option value="authorized">Authorised Representative</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Additional Information</label>
            <textarea
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Anything else that helps us verify your ownership (e.g. 'I am the owner and can verify via the business phone number listed')"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' as const }}
            />
          </div>

          {error && <p className="text-[13px]" style={{ color: '#d32f2f' }}>{error}</p>}

          <div className="flex gap-3 mt-2">
            <button onClick={() => setStep(1)} className="flex-1 px-4 py-3.5 text-[14px] font-medium transition-all" style={{ background: 'var(--bg-secondary)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
              Back
            </button>
            <button
              disabled={!form.role || submitting}
              onClick={handleSubmit}
              className="flex-1 px-4 py-3.5 text-[14px] font-medium text-white transition-all disabled:opacity-40"
              style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}
            >
              {submitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
