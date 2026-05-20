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
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100/80 p-8 text-center shadow-xl shadow-gray-200/30">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Application Submitted!</h2>
        <p className="text-[15px] text-gray-400 mb-6">
          We&apos;ll review your listing and approve it within 24 hours. You&apos;ll receive an email once your profile is live.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 transition-colors"
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              i + 1 <= step ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {i + 1 <= step - 1 ? "✓" : i + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline ${
              i + 1 === step ? "text-gray-900 font-medium" : "text-gray-400"
            }`}>{label}</span>
            {i < stepLabels.length - 1 && (
              <div className={`w-8 sm:w-12 h-px mx-2 ${i + 1 < step ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-8 shadow-xl shadow-gray-200/30">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-1">Create Your Account</h2>
            <p className="text-sm text-gray-400 mb-4">Start with your personal details</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="0400 000 000"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="Min 8 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>
          </div>
        )}

        {/* Step 2: Business */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-1">Business Details</h2>
            <p className="text-sm text-gray-400 mb-4">Tell us about your beauty business</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
              <input type="text" value={form.businessName} onChange={set("businessName")} placeholder="e.g. Luxe Nails Subiaco"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.category} onChange={set("category")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm bg-white">
                <option value="">Select a category</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suburb *</label>
              <input type="text" value={form.city} onChange={set("city")} placeholder="e.g. Subiaco"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>
          </div>
        )}

        {/* Step 3: About */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-1">About Your Business</h2>
            <p className="text-sm text-gray-400 mb-4">Help customers learn about you</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={set("description")} rows={4}
                placeholder="Tell customers what makes your business special..."
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm resize-none" />
              <p className="text-xs text-gray-400 mt-1">{form.description.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={form.website} onChange={set("website")} placeholder="https://yourbusiness.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input type="url" value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/yourbusiness"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none text-sm" />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-1">Review & Submit</h2>
            <p className="text-sm text-gray-400 mb-4">Check your details before submitting</p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Name</span>
                <span className="text-gray-900 font-medium">{form.firstName} {form.lastName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Email</span>
                <span className="text-gray-900 font-medium">{form.email}</span>
              </div>
              {form.phone && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-gray-900 font-medium">{form.phone}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Business</span>
                <span className="text-gray-900 font-medium">{form.businessName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Category</span>
                <span className="text-gray-900 font-medium capitalize">{form.category.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Suburb</span>
                <span className="text-gray-900 font-medium">{form.city}</span>
              </div>
              {form.description && (
                <div className="py-2 border-b border-gray-50">
                  <span className="text-gray-400 block mb-1">Description</span>
                  <span className="text-gray-700 text-xs">{form.description}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              By submitting, you agree to our Terms of Service and Privacy Policy.
              Your listing will be reviewed and approved within 24 hours.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
          {step > 1 ? (
            <button onClick={back} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button onClick={next} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 transition-all">
              Continue \u2192
            </button>
          ) : (
            <button onClick={submit} disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 transition-all disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
