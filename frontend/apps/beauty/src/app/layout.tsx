import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["300", "400", "500", "600"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], variable: "--font-dm-serif", weight: "400", style: ["normal", "italic"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["300", "400", "500", "600"], style: ["normal", "italic"] });

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
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
      "UHZdMrBhQF3dvWgVJdoX80gBYIQW8RvKpT_u-sdbFJo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? process.env.NEXT_PUBLIC_GADS_ID;

  return (
    <html lang="en-AU" className={`${dmSans.variable} ${dmSerif.variable} ${cormorant.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "UHZdMrBhQF3dvWgVJdoX80gBYIQW8RvKpT_u-sdbFJo"}
        />

        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}', { page_path: window.location.pathname });`,
              }}
            />
          </>
        )}
      </head>
      <body className="font-sans min-h-screen antialiased flex flex-col" style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        <Analytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
