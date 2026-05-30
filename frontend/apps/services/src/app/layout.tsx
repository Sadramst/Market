import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { ServicesHeader } from "@/components/ServicesHeader";
import { Code } from "lucide-react";
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="font-sans min-h-screen antialiased flex flex-col bg-white text-gray-900">
        <Analytics />
        <ServicesHeader />

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-950 text-gray-300 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                    <Code className="w-4.5 h-4.5 text-white" strokeWidth={2} />
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
