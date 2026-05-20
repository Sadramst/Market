"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Browse", href: "/search", icon: "🔍" },
  { label: "Categories", href: "/categories", icon: "✨" },
  { label: "Suburbs", href: "/suburbs", icon: "📍" },
  { label: "About", href: "/about", icon: "💎" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-rose-50/80" : "bg-white/60 backdrop-blur-sm border-b border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm shadow-primary/20 group-hover:shadow-md group-hover:shadow-primary/30 transition-shadow">
                <span className="text-white font-display font-bold text-lg leading-none">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-display font-bold text-gray-900 leading-tight tracking-tight">Appilico</span>
                <span className="text-[10px] font-medium text-primary tracking-[0.2em] uppercase leading-none">Beauty</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50/80 transition-all duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="hidden sm:flex w-9 h-9 items-center justify-center text-gray-400 hover:text-primary rounded-xl hover:bg-primary/5 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50/80 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Log in
              </Link>

              <Link
                href="/join"
                className="hidden sm:inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 active:scale-[0.98]"
              >
                List Your Business
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex w-9 h-9 items-center justify-center text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <div className="relative w-5 h-4">
                  <span className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "top-[7px] rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 top-[7px] w-5 h-0.5 bg-current rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0 scale-0" : "opacity-100"}`} />
                  <span className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel */}
      <div className={`fixed top-[68px] left-0 right-0 z-40 md:hidden transition-all duration-400 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        <nav className="bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-xl shadow-black/5 mx-3 mt-1 rounded-2xl overflow-hidden">
          <div className="p-3 space-y-0.5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-[15px] font-medium"
              >
                <span className="text-lg">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 p-3 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-700 bg-gray-50 text-[15px] font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Log in
            </Link>
            <Link
              href="/join"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl text-[15px] font-semibold hover:bg-gray-800 transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
