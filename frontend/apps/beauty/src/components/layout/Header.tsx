"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Browse", href: "/search" },
  { label: "Categories", href: "/categories" },
  { label: "Suburbs", href: "/suburbs" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="shrink-0" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="text-[22px] font-normal italic" style={{ color: 'var(--text-primary)' }}>
                appilico
              </span>
              <span className="text-[22px]" style={{ color: 'var(--brand-rose)' }}>*</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative nav-link-underline px-4 py-2 text-[14px] font-normal transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:flex items-center px-4 py-2 text-[14px] font-normal transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-rose)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                Log in
              </Link>

              <Link
                href="/join"
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-[14px] font-medium text-white transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'var(--brand-rose)',
                  borderRadius: '2px',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-rose-dark)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--brand-rose)')}
              >
                List Your Business
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex w-10 h-10 items-center justify-center"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <div className="relative w-5 h-4">
                  <span className={`absolute left-0 w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? "top-[7px] rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 top-[7px] w-5 h-[1.5px] bg-current transition-all duration-200 ${mobileOpen ? "opacity-0 scale-0" : "opacity-100"}`} />
                  <span className={`absolute left-0 w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: 'rgba(28,20,16,0.3)' }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile dropdown */}
      <div className={`fixed top-16 left-0 right-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"}`}>
        <div className="mx-4 mt-2 overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }}>
          <div className="p-4 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-[15px] font-normal rounded transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center px-4 py-3 text-[15px] font-normal"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '2px' }}
            >
              Log in
            </Link>
            <Link href="/join" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center px-4 py-3 text-[15px] font-medium text-white"
              style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}
            >
              List Your Business →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
