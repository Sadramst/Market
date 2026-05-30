import Link from "next/link";
import { Search, Tag, MapPin, BookOpen, Store, DollarSign, Users, Mail, ShieldCheck, FileText, Heart } from "lucide-react";

const footerLinks = {
  discover: [
    { label: "Browse Providers", href: "/search", icon: Search },
    { label: "Categories", href: "/categories", icon: Tag },
    { label: "Perth Suburbs", href: "/suburbs", icon: MapPin },
    { label: "Beauty Blog", href: "/blog", icon: BookOpen },
  ],
  services: [
    { label: "Nails", href: "/category/nails" },
    { label: "Hair", href: "/category/hair" },
    { label: "Lashes", href: "/category/lashes" },
    { label: "Brows", href: "/category/brows" },
    { label: "Skin Care", href: "/category/skin-care" },
    { label: "Makeup", href: "/category/makeup" },
    { label: "Body", href: "/category/body" },
    { label: "Massage", href: "/category/massage" },
    { label: "Cosmetic", href: "/category/cosmetic" },
    { label: "Wellness", href: "/category/wellness" },
  ],
  business: [
    { label: "List Your Business", href: "/join", icon: Store },
    { label: "Pricing", href: "/pricing", icon: DollarSign },
    { label: "About Us", href: "/about", icon: Users },
    { label: "Contact", href: "/contact", icon: Mail },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
    { label: "Terms of Service", href: "/terms", icon: FileText },
  ],
};

const popularSuburbs = [
  { label: "Perth CBD", href: "/perth" },
  { label: "Subiaco", href: "/subiaco" },
  { label: "Fremantle", href: "/fremantle" },
  { label: "Joondalup", href: "/joondalup" },
  { label: "Claremont", href: "/claremont" },
  { label: "Mt Lawley", href: "/mount-lawley" },
  { label: "Scarborough", href: "/scarborough" },
  { label: "Nedlands", href: "/nedlands" },
];

export function Footer() {
  return (
    <footer className="mt-auto" style={{ background: 'var(--gradient-dark)' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="text-[22px] font-normal italic" style={{ color: 'var(--text-on-dark)' }}>appilico</span>
              <span className="text-[22px]" style={{ color: 'var(--brand-rose)' }}>*</span>
            </Link>
            <p className="mt-4 text-[14px] leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              Perth&apos;s premium beauty marketplace. Discover top-rated salons, spas, and beauty professionals near you.
            </p>

            {/* Popular suburbs */}
            <div className="mt-6">
              <h4 className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Popular Areas</h4>
              <div className="flex flex-wrap gap-1.5">
                {popularSuburbs.map((s) => (
                  <Link key={s.href} href={s.href} className="px-2.5 py-1 text-[11px] transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-[11px] font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13px] transition-colors duration-200 hover:text-white" style={{ color: 'rgba(250,247,244,0.6)', fontFamily: 'var(--font-body)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>&copy; {new Date().getFullYear()} Appilico Pty Ltd &middot; Perth, WA</p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/appilico" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://facebook.com/appilico" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <span className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              Made with <Heart className="w-3 h-3" style={{ color: 'var(--brand-rose)' }} fill="currentColor" strokeWidth={0} /> in Perth
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
