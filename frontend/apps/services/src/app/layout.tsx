import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IT & Tech Services | Appilico Services",
    template: "%s | Appilico Services",
  },
  description:
    "Find trusted IT professionals and tech service providers in Perth. Web development, mobile apps, cloud, cybersecurity, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
