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
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-500 text-sm">We&apos;ll get back to you within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input type="text" value={form.name} onChange={set("name")} required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" value={form.email} onChange={set("email")} required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
        <select value={form.subject} onChange={set("subject")} required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm bg-white">
          <option value="">Select a subject</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea value={form.message} onChange={set("message")} rows={5} required maxLength={2000}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm resize-none" />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again or email hello@appilico.com.au directly.</p>
      )}
      <button type="submit" disabled={status === "loading"}
        className="w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all disabled:opacity-50">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
