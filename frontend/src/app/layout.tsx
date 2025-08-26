import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/header/Navbar";

export const metadata: Metadata = {
  title: "ReSellHub",
  description: "Buy & Sell with Ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-100">
        <Navbar />  
        <main>{children}</main>
      </body>
    </html>
  );
}
