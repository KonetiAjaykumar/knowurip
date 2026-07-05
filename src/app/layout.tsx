import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "KnowUrIP - Discover Your Digital Identity",
  description: "Real-time, detailed public IP address details, location geolocation map, network routing metadata, security/privacy threat scanning details, and client details.",
  keywords: ["IP lookup", "my IP", "geolocation", "ASN", "ISP details", "VPN checker", "privacy indicators", "KnowUrIP"],
  authors: [{ name: "KnowUrIP Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-slate-950 text-slate-100 flex flex-col min-h-screen antialiased`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
