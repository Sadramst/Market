import Link from "next/link";

const footerLinks = {
  marketplace: [
    { label: "Browse Providers", href: "/search" },
    { label: "Categories", href: "/categories" },
    { label: "Suburbs", href: "/suburbs" },
  ],
  categories: [
    { label: "Nails", href: "/category/nails" },
    { label: "Hair", href: "/category/hair" },
    { label: "Lashes", href: "/category/lashes" },
    { label: "Makeup", href: "/category/makeup" },
    { label: "Skin Care", href: "/category/skin-care" },
  ],
  business: [
    { label: "List Your Business", href: "/join" },
    { label: "Provider Login", href: "/login" },
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
    <footer className="bg-gray-950 text-gray-400">
      {/* Newsletter CTA */}
      <div className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-display font-bold text-white">Stay in the loop</h3>
              <p className="text-sm text-gray-500 mt-1">Get the latest beauty trends and new providers in Perth</p>
            </div>
            <form className="flex gap-2 max-w-md w-full" action="#">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 text-sm transition-colors"
              />
              <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-display font-bold text-white">Appilico</span>
              <span className="text-rose-400/80 text-sm ml-1">Beauty</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Perth&apos;s premier beauty &amp; wellness marketplace. Discover top-rated professionals near you.
            </p>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">Marketplace</h3>
            <ul className="space-y-2.5">
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
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">Categories</h3>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">For Business</h3>
            <ul className="space-y-2.5">
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
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">Company</h3>
            <ul className="space-y-2.5">
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

        <div className="border-t border-gray-800/50 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Appilico. All rights reserved.</p>
          <p className="text-xs text-gray-600">Perth, Western Australia 🇦🇺</p>
        </div>
      </div>
    </footer>
  );
}
