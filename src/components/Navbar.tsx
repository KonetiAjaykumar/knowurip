"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/about", label: "About IP" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Us" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/75 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Globe className="h-6 w-6 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent font-mono">
                KNOW<span className="text-cyan-400">UR</span>IP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                      isActive ? "text-cyan-400" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-border"
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-400"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth Buttons / Dropdown */}
            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
            
            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-cyan-500/30 bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer text-sm font-semibold text-white"
                    >
                      <div className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-[10px] text-cyan-400 uppercase font-mono font-bold">
                        {user.fullName[0]}
                      </div>
                      <span className="max-w-[100px] truncate">{user.fullName}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl"
                        >
                          <div className="px-3 py-2.5 border-b border-white/5 mb-1.5 text-left">
                            <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Account Node</p>
                            <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          
                          <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <User className="h-4 w-4 text-cyan-400" />
                            <span>My Profile</span>
                          </Link>
                          
                          <Link
                            href="/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Settings className="h-4 w-4 text-cyan-400" />
                            <span>Settings</span>
                          </Link>

                          <div className="h-[1px] bg-white/5 my-1.5"></div>

                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout Session</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/login"
                      className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-slate-950/95"
          >
            <div className="space-y-1 px-2 pb-4 pt-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {!loading && (
                <div className="border-t border-white/5 pt-3 mt-3 px-3">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 py-1.5">
                        <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-xs text-cyan-400 uppercase font-mono font-bold">
                          {user.fullName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-none">{user.fullName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-sm text-slate-400 hover:text-white"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-sm text-slate-400 hover:text-white"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                        className="w-full block py-2 text-sm text-red-400 hover:text-red-300 text-left"
                      >
                        Logout Session
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-400 hover:text-white"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
