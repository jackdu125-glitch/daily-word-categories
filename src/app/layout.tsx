import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jackdu2.me"),
  title: {
    default: "Daily Word Categories",
    template: "%s | Daily Word Categories",
  },
  description:
    "Play a sharp daily English word category puzzle with premium guides, strategy discussion, and one clean challenge every morning.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Daily Word Categories",
    description:
      "A polished daily word game with 16 words, 4 hidden categories, premium guides, and strategy discussion.",
    url: "/",
    siteName: "Daily Word Categories",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Word Categories",
    description:
      "Play today's 16-word category puzzle, read strategy guides, and share your result.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
