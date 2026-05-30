"use client";

import { useState, useRef, useEffect } from "react";
import { PERTH_SUBURBS } from "@/lib/suburbs";
import { Search, MapPin } from "lucide-react";

export function HeroSearchForm() {
  const [suburb, setSuburb] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = suburb.length >= 1
    ? PERTH_SUBURBS.filter(
        (s) =>
          s.name.toLowerCase().includes(suburb.toLowerCase()) ||
          s.postCode.startsWith(suburb)
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      setSuburb(filtered[highlighted].name);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <form action="/search" method="GET" className="animate-fade-in-up animation-delay-300 mt-10 max-w-[540px]">
      <div className="flex gap-0" style={{ border: "1px solid var(--border)", background: "var(--bg-card)", borderRadius: '4px' }}>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
          <input
            type="text"
            name="q"
            placeholder="Service or salon name"
            className="w-full pl-11 pr-4 py-4 border-0 bg-transparent focus:outline-none text-[15px]"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          />
        </div>
        <div ref={wrapperRef} className="flex-1 relative" style={{ borderLeft: "1px solid var(--border)" }}>
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
          <input
            type="text"
            name="suburb"
            value={suburb}
            onChange={(e) => {
              setSuburb(e.target.value);
              setOpen(true);
              setHighlighted(-1);
            }}
            onFocus={() => suburb.length >= 1 && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Suburb or postcode"
            autoComplete="off"
            className="w-full pl-11 pr-4 py-4 border-0 bg-transparent focus:outline-none text-[15px]"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          />
          {open && filtered.length > 0 && (
            <ul
              className="absolute z-50 w-full mt-1 left-0 max-h-56 overflow-y-auto shadow-lg"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            >
              {filtered.map((s, i) => (
                <li
                  key={s.slug}
                  className="px-4 py-2.5 cursor-pointer flex justify-between items-center text-[14px]"
                  style={{
                    fontFamily: "var(--font-body)",
                    background: i === highlighted ? "var(--bg-secondary)" : "transparent",
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                  onMouseDown={() => {
                    setSuburb(s.name);
                    setOpen(false);
                  }}
                >
                  <span>{s.name}</span>
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {s.postCode}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-4 text-[14px] font-medium text-white shrink-0 transition-all duration-200 flex items-center gap-2"
          style={{ background: "var(--brand-rose)", fontFamily: "var(--font-body)", borderRadius: 0 }}
        >
          <Search className="w-4 h-4" strokeWidth={2} />
          Search
        </button>
      </div>
    </form>
  );
}
