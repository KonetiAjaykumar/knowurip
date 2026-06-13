import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "KnowUrIP - Discover Your Digital Identity",
  description: "Instantly detect and analyze your public IP address. Discover detailed geolocation, ISP network routing, ASN, and comprehensive privacy/VPN security checks.",
  keywords: [
    "what is my ip",
    "ip address lookup",
    "ip geolocation",
    "vpn detector",
    "proxy checker",
    "asn search",
    "network locator",
    "knowurip"
  ],
  openGraph: {
    title: "KnowUrIP - Instant IP Address Intelligence",
    description: "Discover your digital identity. Get coordinates, country info, ISP routing, and privacy checks in real-time.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#030014] text-[#f3f4f6] antialiased">
        {/* Animated Background Mesh & Grids */}
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030014]">
          {/* Animated floating mesh gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[130px] animate-float-1"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[130px] animate-float-2"></div>
          <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] animate-float-1"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid-overlay opacity-30 pointer-events-none"></div>
          
          {/* Vignette dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-[#030014]/50 pointer-events-none"></div>
        </div>

        {/* Layout wrapper */}
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
