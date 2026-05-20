import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Beauty Services Near You | Appilico Beauty",
    template: "%s | Appilico Beauty",
  },
  description:
    "Find and book the best beauty services in Perth. Nails, hair, lashes, brows, skin care, makeup artists and more. Compare prices, read reviews, and book instantly.",
  keywords: [
    "beauty services Perth",
    "nail salon Perth",
    "hair salon Perth",
    "lash extensions Perth",
    "beauty marketplace Australia",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://beauty.appilico.com.au",
    siteName: "Appilico Beauty",
  },
  // TODO: Add Twitter card metadata
  // TODO: Add structured data (JSON-LD) in each page
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* TODO: Add AuthProvider context */}
        {/* TODO: Add Header component */}
        <main>{children}</main>
        {/* TODO: Add Footer component */}
      </body>
    </html>
  );
}
