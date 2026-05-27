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
    default: "new game",
    template: "%s | new game",
  },
  description:
    "Play daily word games on gameJack with premium guides, strategy discussion, and one clean challenge every morning.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "new game",
    description:
      "A polished gameJack word-game hub with daily puzzles, premium guides, and strategy discussion.",
    url: "/",
    siteName: "new game",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "new game",
    description:
      "Play today's word puzzle, read strategy guides, and share your result on gameJack.",
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
