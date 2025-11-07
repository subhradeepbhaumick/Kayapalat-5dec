import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KayaPalat - Interior Design Freelance Platform",
  description: "A full-stack, scalable, and mobile-friendly freelance platform designed to connect interior designers with clients seeking to transform their spaces.",
  verification: {
    google: "22Urv056hxAwWx_19uiE42sdnzLjOXuQJrVQio97zzk",
    // You can add other verification tags here as well
    // yandex: "yandex-verification-code",
    // other: {
    //   "msvalidate.01": "bing-verification-code",
    // },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}