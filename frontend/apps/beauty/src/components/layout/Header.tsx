"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Browse", href: "/search" },
  { label: "Categories", href: "/categories" },
  { label: "Suburbs", href: "/suburbs" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-50" : "bg-white/80 backdrop-blur-sm border-b border-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <img src="/logo.svg" alt="Appilico Beauty" className="h-8 w-auto" />
            <span className="text-sm text-rose-400/80 font-medium">Beauty</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="relative text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-rose-50/50"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/join"
              className="hidden sm:inline-flex items-center px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-all hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]"
            >
              List Your Business
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-rose-50/50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-64 border-t border-rose-50" : "max-h-0"}`}>
        <nav className="bg-white px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-gray-600 hover:bg-rose-50/50 hover:text-primary transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/join"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 mt-2 bg-primary text-white rounded-lg text-sm font-medium text-center hover:bg-primary-dark transition-colors"
          >
            List Your Business
          </Link>
        </nav>
      </div>
    </header>
  );
}
