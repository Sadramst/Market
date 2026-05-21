"use client";

import { useState } from "react";

type ReviewFormProps = {
  providerId: string;
  providerName: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function ReviewForm({ providerId, providerName }: ReviewFormProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || name.trim().length < 2) { setError("Please enter your name (minimum 2 characters)"); return; }
    if (rating === 0) { setError("Please select a rating"); return; }
    if (!comment.trim() || comment.trim().length < 20) { setError("Review must be at least 20 characters"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reviews/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          authorName: name.trim(),
          rating,
          comment: comment.trim(),
          source: source || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to submit review. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
        <span className="text-[40px] block mb-3">⭐</span>
        <h3 className="text-[16px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>Thank you!</h3>
        <p className="text-[14px] font-light mt-2" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
          Your review has been submitted and will appear shortly.
        </p>
      </div>
    );
  }

  return (
    <section className="p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
      <h2 className="text-[18px] mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)", fontWeight: 600 }}>Leave a Review</h2>

      <form onSubmit={submit} className="space-y-4">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name & last initial"
            maxLength={50}
            className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none"
            style={{ border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
            Rating <span style={{ color: "var(--brand-rose)" }}>*</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 20 20"
                  fill={(hoverRating || rating) >= star ? "var(--brand-gold)" : "var(--border)"}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
            Your Review <span style={{ color: "var(--brand-rose)" }}>*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Share your experience with ${providerName}...`}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 text-[14px] bg-transparent focus:outline-none resize-none"
            style={{ border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          />
          <p className="text-[11px] mt-1 text-right" style={{ color: "var(--text-muted)" }}>{comment.length}/500</p>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
            How did you find this provider? <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {["Google", "Appilico", "Friend/Referral", "Social Media", "Other"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSource(source === s ? "" : s)}
                className="px-3 py-1.5 text-[12px] transition-all"
                style={{
                  border: `1px solid ${source === s ? "var(--brand-rose)" : "var(--border)"}`,
                  borderRadius: "50px",
                  fontFamily: "var(--font-body)",
                  color: source === s ? "var(--brand-rose)" : "var(--text-secondary)",
                  background: source === s ? "rgba(200,115,122,0.08)" : "transparent",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-[14px] font-medium text-white transition-opacity disabled:opacity-50"
          style={{ background: "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)" }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
}
