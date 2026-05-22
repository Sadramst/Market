"use client";

import { useState, useRef, useEffect } from "react";
import { PERTH_SUBURBS } from "@/lib/suburbs";

export function SuburbAutocomplete({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = value.length >= 1
    ? PERTH_SUBURBS.filter(
        (s) =>
          s.name.toLowerCase().includes(value.toLowerCase()) ||
          s.postCode.startsWith(value)
      ).slice(0, 8)
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
      setValue(filtered[highlighted].name);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative sm:w-48">
      <input
        type="text"
        name="suburb"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
          setHighlighted(-1);
        }}
        onFocus={() => value.length >= 1 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Suburb or postcode"
        autoComplete="off"
        className="w-full px-4 py-3.5 text-[15px] bg-transparent focus:outline-none"
        style={{
          border: "1px solid var(--border)",
          borderRadius: "2px",
          fontFamily: "var(--font-body)",
          color: "var(--text-primary)",
        }}
      />
      {open && filtered.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto shadow-lg"
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
                setValue(s.name);
                setOpen(false);
              }}
            >
              <span>{s.name}</span>
              <span
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                {s.postCode}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
