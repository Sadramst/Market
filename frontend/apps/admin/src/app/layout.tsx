import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s | Appilico Admin" },
  description: "Manage providers, reviews, content, and platform settings.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="font-sans min-h-screen antialiased bg-gray-50 text-gray-900">
        {/* TODO: Auth guard — redirect to login if not SuperAdmin/Moderator */}
        {children}
      </body>
    </html>
  );
}
