"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@appilico/shared/hooks";
import { useSuburbPreference } from "@appilico/shared/hooks";
import { Search, LayoutGrid, MapPin, BookOpen, Info, ArrowRight, User, LogOut, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Browse", href: "/search", icon: Search },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
  { label: "Suburbs", href: "/suburbs", icon: MapPin },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
];

export function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { suburb, detecting, detectLocation } = useSuburbPreference();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMobileOpen(false); setShowUserMenu(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    setShowUserMenu(false);
    router.push("/");
  }

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
              {navLinks.map((l) => {
                // "Browse" link auto-applies location postcode for proximity sorting
                const href = l.label === "Browse" && suburb?.postCode
                  ? `/search?postCode=${suburb.postCode}&sortBy=distance`
                  : l.href;
                return (
                  <Link
                    key={l.href}
                    href={href}
                    className="relative nav-link-underline px-4 py-2 text-[14px] font-normal transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Location chip */}
              <button
                onClick={detectLocation}
                disabled={detecting}
                title={suburb ? `Showing results for ${suburb.name}` : "Detect my location"}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all rounded-full"
                style={{
                  border: '1px solid var(--border)',
                  color: suburb ? 'var(--brand-rose)' : 'var(--text-muted)',
                  background: suburb ? 'rgba(190,18,60,0.05)' : 'transparent',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <MapPin className="w-3 h-3" strokeWidth={2} />
                {detecting ? "Detecting…" : suburb ? `${suburb.name}${suburb.postCode ? ` · ${suburb.postCode}` : ""}` : "Detect location"}
              </button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[14px] font-normal transition-all"
                    style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'var(--brand-rose)' }}>
                      {user.firstName[0]?.toUpperCase()}
                    </span>
                    {user.firstName}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 py-1 z-50 rounded shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <Link href="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors" style={{ color: 'var(--text-secondary)' }}>My Profile</Link>
                      <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors" style={{ color: 'var(--text-secondary)' }}>Dashboard</Link>
                      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors" style={{ color: 'var(--text-secondary)' }}>Sign out</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-[14px] font-normal transition-all duration-200"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-2 text-[14px] font-normal transition-all duration-200"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '2px' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-rose)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    Log in
                  </Link>
                </div>
              )}

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
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
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
            {navLinks.map((l) => {
              const NavIcon = l.icon;
              return (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-normal rounded transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
              >
                <NavIcon className="w-4 h-4" style={{ color: 'var(--brand-rose)' }} strokeWidth={1.5} />
                {l.label}
              </Link>
              );
            })}
          </div>
          <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            {isAuthenticated ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-[15px] font-normal"
                  style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '2px' }}
                >
                  My Profile
                </Link>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-[15px] font-normal"
                  style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '2px' }}
                >
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex w-full items-center justify-center px-4 py-3 text-[15px] font-medium text-white"
                  style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-[15px] font-normal"
                  style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '2px' }}
                >
                  Log in
                </Link>                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-[15px] font-medium"
                  style={{ color: 'var(--brand-rose)', border: '1px solid var(--brand-rose)', borderRadius: '2px', opacity: 0.9 }}
                >
                  Create account
                </Link>                <Link href="/join" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-[15px] font-medium text-white"
                  style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}
                >
                  List Your Business →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
