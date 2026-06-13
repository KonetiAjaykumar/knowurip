import Link from "next/link";
import { Globe, Mail, Shield, BookOpen } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#030014]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-400" />
              <span className="text-lg font-bold tracking-tight text-white">
                KnowUr<span className="text-indigo-400">IP</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Discover your digital identity. Get accurate, real-time details about your IP address, network, and security parameters in one place.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  Check IP Address
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  About IP Geolocation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3 col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact & Info</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>support@knowurip.com</span>
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-400" />
                <span>Secure Server SSL Lookup</span>
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span>Powered by IPinfo Intelligence</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} KnowUrIP. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Disclaimer: Geolocation is approximate and based on your network provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
