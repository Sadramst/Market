import Link from "next/link";

const footerLinks = {
  discover: [
    { label: "Browse Providers", href: "/search" },
    { label: "Categories", href: "/categories" },
    { label: "Perth Suburbs", href: "/suburbs" },
    { label: "Nails", href: "/category/nails" },
    { label: "Hair", href: "/category/hair" },
    { label: "Lashes", href: "/category/lashes" },
  ],
  services: [
    { label: "Brows", href: "/category/brows" },
    { label: "Skin Care", href: "/category/skin-care" },
    { label: "Makeup", href: "/category/makeup" },
    { label: "Body", href: "/category/body" },
    { label: "Cosmetic", href: "/category/cosmetic" },
    { label: "Wellness", href: "/category/wellness" },
  ],
  business: [
    { label: "List Your Business", href: "/join" },
    { label: "Provider Login", href: "/login" },
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
];

export function Footer() {
  return (
    <footer className="bg-[#0F0F0F] text-gray-400 mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm leading-none">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-display font-bold text-white leading-tight">Appilico</span>
                <span className="text-[9px] font-medium text-primary tracking-[0.2em] uppercase leading-none">Beauty</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs">
              Perth&apos;s premium beauty marketplace. Discover top-rated salons, spas, and beauty professionals near you.
            </p>

            {/* Popular suburbs */}
            <div className="mt-6">
              <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Areas</h4>
              <div className="flex flex-wrap gap-1.5">
                {popularSuburbs.map((s) => (
                  <Link key={s.href} href={s.href} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[11px] text-gray-500 hover:text-white transition-colors">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Discover</h3>
            <ul className="space-y-2.5">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Business</h3>
            <ul className="space-y-2.5">
              {footerLinks.business.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-gray-600">&copy; {new Date().getFullYear()} Appilico Pty Ltd. All rights reserved.</p>
          <p className="text-[11px] text-gray-600 flex items-center gap-1.5">
            Made with <span className="text-primary text-xs">♥</span> in Perth, Western Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
