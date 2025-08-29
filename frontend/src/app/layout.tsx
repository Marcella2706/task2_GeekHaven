import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/header/Navbar";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ASSIGNMENT_SEED, generateColorFromSeed } from "@/utils/seed";

const inter = Inter({ subsets: ["latin"] });

const seedColors = generateColorFromSeed(ASSIGNMENT_SEED);

export const metadata: Metadata = {
  title: {
    default: "ReSellHub - Premium Marketplace with Wooden Aesthetics",
    template: "%s | ReSellHub"
  },
  description: "Experience the warmth of natural wood design in our premium reselling marketplace. Buy and sell with style and sophistication.",
  keywords: [
    "reselling", "marketplace", "buy", "sell", "second-hand", "pre-owned", 
    "electronics", "fashion", "home", "books", "deals", "online shopping", "wood design", "premium"
  ],
  authors: [{ name: "ReSellHub Team" }],
  creator: "ReSellHub",
  publisher: "ReSellHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    title: "ReSellHub - Premium Marketplace with Wooden Aesthetics",
    description: "Experience the warmth of natural wood design in our premium reselling marketplace",
    siteName: "ReSellHub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ReSellHub - Premium Marketplace with Wooden Aesthetics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReSellHub - Premium Marketplace with Wooden Aesthetics",
    description: "Experience the warmth of natural wood design in our premium reselling marketplace",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": seedColors.primary,
    "theme-color": seedColors.primary,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: seedColors.primary },
    { media: "(prefers-color-scheme: dark)", color: seedColors.primary },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --seed-primary: ${seedColors.primary};
                --seed-secondary: ${seedColors.secondary};
                --seed-accent: ${seedColors.accent};
                --seed-gradient: ${seedColors.gradient};
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased wood-texture`}>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="mt-auto py-8 px-6">
                <div className="max-w-6xl mx-auto text-center text-white/60 space-y-2">
                  <p>&copy; 2024 ReSellHub. All rights reserved.</p>
                  <p className="text-xs">
                    Powered by {ASSIGNMENT_SEED} • Built with Next.js & TypeScript • Wood Theme
                  </p>
                </div>
              </footer>
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}