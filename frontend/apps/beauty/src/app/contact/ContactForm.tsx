"use client";

import { useState } from "react";
import { apiClient } from "@appilico/shared/api";

const subjects = [
  "General Enquiry",
  "Provider Support",
  "Report an Issue",
  "Partnership",
];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setStatus("loading");
    try {
      const res = await apiClient("/contact", { method: "POST", body: form });
      setStatus(res.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(16,185,129,0.1)' }}>
          <svg className="w-6 h-6" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-[18px] mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Message Sent!</h3>
        <p className="text-[14px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>We&apos;ll get back to you within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Name *</label>
        <input type="text" value={form.name} onChange={set("name")} required
          className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none"
          style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
      </div>
      <div>
        <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Email *</label>
        <input type="email" value={form.email} onChange={set("email")} required
          className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none"
          style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
      </div>
      <div>
        <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Subject *</label>
        <select value={form.subject} onChange={set("subject")} required
          className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none"
          style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          <option value="">Select a subject</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[13px] font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Message *</label>
        <textarea value={form.message} onChange={set("message")} rows={5} required maxLength={2000}
          className="w-full px-4 py-2.5 text-[14px] bg-transparent focus:outline-none resize-none"
          style={{ border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }} />
      </div>
      {status === "error" && (
        <p className="text-[13px]" style={{ color: '#dc2626' }}>Something went wrong. Please try again or email hello@appilico.com.au directly.</p>
      )}
      <button type="submit" disabled={status === "loading"}
        className="w-full px-6 py-3 text-[14px] font-medium text-white transition-all disabled:opacity-50"
        style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
