import Link from "next/link";

const footerLinks = {
  marketplace: [
    { label: "Browse Providers", href: "/search" },
    { label: "Categories", href: "/categories" },
    { label: "Suburbs", href: "/suburbs" },
  ],
  business: [
    { label: "List Your Business", href: "/join" },
    { label: "Provider Login", href: "/login" },
    // TODO: { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-display font-bold text-white">
              Appilico <span className="text-rose-400 text-sm">Beauty</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Perth&apos;s premier beauty and wellness marketplace. Discover top-rated salons, spas, and beauty professionals near you.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Marketplace</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">For Business</h3>
            <ul className="space-y-2">
              {footerLinks.business.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Appilico. All rights reserved.</p>
          <p className="text-sm text-gray-500 mt-2 sm:mt-0">Perth, Western Australia</p>
        </div>
      </div>
    </footer>
  );
}
