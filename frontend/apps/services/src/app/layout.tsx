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
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">Appilico</span>
              <span className="text-sm text-blue-400 font-medium">Services</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-gray-600 hover:text-blue-600 transition-colors">Browse</Link>
              <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">Categories</Link>
            </nav>
            <Link href="/join" className="hidden sm:inline-flex px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
              List Your Service
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xl font-bold text-white">Appilico <span className="text-blue-400 text-sm">Services</span></span>
              <p className="text-sm text-gray-500 mt-1">Perth&apos;s IT & tech marketplace</p>
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Appilico. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
