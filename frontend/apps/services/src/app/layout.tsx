import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Appilico Services — Perth IT & Tech Marketplace",
    template: "%s | Appilico Services",
  },
  description:
    "Find trusted IT professionals and tech service providers in Perth. Web development, mobile apps, cloud, cybersecurity, and more.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://service.appilico.com.au"),
  openGraph: {
    siteName: "Appilico Services",
    locale: "en_AU",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="font-sans min-h-screen antialiased flex flex-col bg-white text-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-gray-900 tracking-tight">Appilico</span>
                <span className="text-xs text-blue-500 font-semibold tracking-wider uppercase">Services</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/search" className="relative text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full hover:after:w-full after:transition-all">Browse</Link>
              <Link href="/categories" className="relative text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full hover:after:w-full after:transition-all">Categories</Link>
            </nav>
            <Link href="/join" className="hidden sm:inline-flex px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98]">
              List Your Service
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-950 text-gray-300 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">Appilico <span className="text-blue-400 text-xs uppercase tracking-wider font-semibold">Services</span></span>
                </div>
                <p className="text-sm text-gray-500 max-w-xs">Perth&apos;s marketplace for trusted IT professionals and tech service providers.</p>
              </div>
              <div className="flex gap-12">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/search" className="text-gray-500 hover:text-white transition-colors">Browse Services</Link></li>
                    <li><Link href="/categories" className="text-gray-500 hover:text-white transition-colors">Categories</Link></li>
                    <li><Link href="/join" className="text-gray-500 hover:text-white transition-colors">List Your Service</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Also by Appilico</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="https://beauty.appilico.com.au" className="text-gray-500 hover:text-white transition-colors">Beauty Marketplace</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Appilico. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
