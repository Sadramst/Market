import Link from "next/link";

const footerLinks = {
  discover: [
    { label: "Browse Providers", href: "/search" },
    { label: "Categories", href: "/categories" },
    { label: "Perth Suburbs", href: "/suburbs" },
  ],
  services: [
    { label: "Nails", href: "/category/nails" },
    { label: "Hair", href: "/category/hair" },
    { label: "Lashes", href: "/category/lashes" },
    { label: "Brows", href: "/category/brows" },
    { label: "Skin Care", href: "/category/skin-care" },
    { label: "Makeup", href: "/category/makeup" },
  ],
  business: [
    { label: "List Your Business", href: "/join" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
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
          <p className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            Made with <span style={{ color: 'var(--brand-rose)' }}>♥</span> in Perth, Western Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
