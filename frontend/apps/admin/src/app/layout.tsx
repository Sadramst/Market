import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Appilico Admin Dashboard",
  description: "Manage providers, reviews, content, and platform settings.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen antialiased">
        {/* TODO: Add admin auth guard */}
        {/* TODO: Add sidebar navigation */}
        <main>{children}</main>
      </body>
    </html>
  );
}
