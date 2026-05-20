import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    default: "Appilico Beauty — Perth's Beauty & Wellness Marketplace",
    template: "%s | Appilico Beauty",
  },
  description:
    "Discover and book top-rated beauty salons, spas, hairdressers, and wellness professionals in Perth, Western Australia. Compare reviews, prices, and availability.",
  keywords: [
    "beauty services Perth",
    "nail salon Perth",
    "hair salon Perth",
    "lash extensions Perth",
    "beauty marketplace Australia",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://beauty.appilico.com.au"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://beauty.appilico.com.au",
    siteName: "Appilico Beauty",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen antialiased flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
