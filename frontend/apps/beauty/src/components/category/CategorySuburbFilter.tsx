"use client";

import { useRouter } from "next/navigation";
import { PERTH_SUBURBS } from "@/lib/suburbs";

export function CategorySuburbFilter({ categorySlug }: { categorySlug: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) router.push(`/${e.target.value}/${categorySlug}`);
        }}
        aria-label="Filter by suburb"
        className="text-[14px]"
        style={{
          padding: "10px 16px",
          border: "1.5px solid rgba(255,255,255,0.7)",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          color: "var(--text-primary)",
          cursor: "pointer",
          minWidth: 220,
        }}
      >
        <option value="">Filter by suburb…</option>
        {PERTH_SUBURBS.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name} ({s.postCode})
          </option>
        ))}
      </select>
      <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
        or browse all below
      </span>
    </div>
  );
}
