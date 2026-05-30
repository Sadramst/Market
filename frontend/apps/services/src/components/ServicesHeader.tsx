"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSuburbPreference } from "@appilico/shared/hooks";
import { MapPin, Search, LayoutGrid, Code, ChevronDown, LogOut, Menu, X } from "lucide-react";

const USER_KEY = "services_user";
const TOKEN_KEY = "services_access_token";

interface ServiceUser {
  firstName: string;
  email: string;
}

export function ServicesHeader() {
  const router = useRouter();
  const [user, setUser] = useState<ServiceUser | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { suburb, detecting, detectLocation } = useSuburbPreference();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      if (token && userStr) setUser(JSON.parse(userStr) as ServiceUser);
    } catch { /* ignore */ }
  }, []);

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("services_refresh_token");
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setShowMenu(false);
    router.push("/");
  }

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? "border-gray-200 shadow-sm" : "border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo — improved */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-md shadow-blue-500/30" />
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Code className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-bold text-gray-900 tracking-tight">appilico</span>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-blue-500">Services</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/search" className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors font-medium">Browse</Link>
            <Link href="/categories" className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors font-medium">Categories</Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Location chip */}
            <button
              onClick={detectLocation}
              disabled={detecting}
              title={suburb ? `Showing results near ${suburb.name}` : "Detect my location"}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full border transition-all"
              style={{ borderColor: suburb ? 'rgba(37,99,235,0.3)' : '#e5e7eb', color: suburb ? '#2563eb' : '#9ca3af', background: suburb ? 'rgba(37,99,235,0.05)' : 'transparent' }}
            >
              <MapPin className="w-3 h-3" strokeWidth={2} />
              {detecting ? "Detecting…" : suburb ? suburb.name : "Detect location"}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {user.firstName[0]?.toUpperCase()}
                  </span>
                  {user.firstName}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <Link href="/dashboard" onClick={() => setShowMenu(false)} className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">Dashboard</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center px-4 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Sign in
              </Link>
            )}
            <Link href="/join" className="hidden sm:inline-flex px-4 py-2 bg-blue-600 text-white rounded-xl text-[13px] font-semibold hover:bg-blue-700 transition-all hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98]">
              List Your Service
            </Link>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500 hover:text-gray-700" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-lg md:hidden">
          <nav className="px-4 py-4 space-y-2">
            <Link href="/search" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">Browse</Link>
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">Categories</Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">Sign out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors">Sign in</Link>
            )}
            <Link href="/join" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-blue-600 text-white font-medium rounded-xl text-center hover:bg-blue-700 transition-colors">List Your Service</Link>
          </nav>
        </div>
      )}
    </>
  );
}
