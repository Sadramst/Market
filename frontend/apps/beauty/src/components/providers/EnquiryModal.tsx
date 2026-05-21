"use client";

import { useState } from "react";

type EnquiryModalProps = {
  providerId: string;
  providerName: string;
  services?: Array<{ name: string }>;
  onClose: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function EnquiryModal({ providerId, providerName, services, onClose }: EnquiryModalProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", serviceInterest: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || form.name.trim().length < 2) { setError("Name is required (minimum 2 characters)"); return; }
    if (!form.email.trim() || !form.email.includes("@")) { setError("A valid email address is required"); return; }
    if (!form.message.trim() || form.message.trim().length < 20) { setError("Message must be at least 20 characters"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim() || undefined,
          message: form.message.trim(),
          serviceInterest: form.serviceInterest || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to send enquiry. Please try again or contact hello@appilico.com.au");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(28,20,16,0.5)" }} />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="text-[18px]" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)", fontWeight: 600 }}>
              Contact {providerName}
            </h2>
            <p className="text-[13px] mt-1" style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
              Send a direct enquiry
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" aria-label="Close">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <span className="text-[48px] block mb-4">✉️</span>
            <h3 className="text-[18px] mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>Enquiry Sent!</h3>
            <p className="text-[14px] font-light" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              {providerName} will respond within 1–2 business days.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 text-[14px] font-medium text-white"
              style={{ background: "var(--brand-rose)", borderRadius: "2px" }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-[13px]" style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", borderRadius: "6px" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                Your Name <span style={{ color: "var(--brand-rose)" }}>*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Full name"
                className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none"
                style={{ border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                Email <span style={{ color: "var(--brand-rose)" }}>*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="your@email.com"
                className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none"
                style={{ border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                Phone <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="04XX XXX XXX"
                className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none"
                style={{ border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
              />
            </div>

            {services && services.length > 0 && (
              <div>
                <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                  Service Interest <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>(optional)</span>
                </label>
                <select
                  value={form.serviceInterest}
                  onChange={set("serviceInterest")}
                  className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none"
                  style={{ border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                >
                  <option value="">Select a service...</option>
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                Message <span style={{ color: "var(--brand-rose)" }}>*</span>
              </label>
              <textarea
                value={form.message}
                onChange={set("message")}
                placeholder="Tell them what you're looking for..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none resize-none"
                style={{ border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
              />
              <p className="text-[11px] mt-1 text-right" style={{ color: "var(--text-muted)" }}>
                {form.message.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-[14px] font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)" }}
            >
              {loading ? "Sending..." : "Send Enquiry"}
            </button>

            <p className="text-[11px] text-center" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Your details will be shared with {providerName} only.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
