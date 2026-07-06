"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, ShieldAlert, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize verification sequence.");
      }

      // Store in sessionStorage to pass validation state between steps
      sessionStorage.setItem("signup_email", email.trim());
      sessionStorage.setItem("signup_name", fullName.trim());

      router.push("/verify-email");
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Dynamic ambient backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-3 py-1 rounded-full">
            Security Protocol // 01
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight pt-1">
            Create Your <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Identity</span>
          </h1>
          <p className="text-xs text-slate-400">
            Establish your user credentials to access protected network routing analytics.
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border border-white/10 rounded-2xl bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3.5 border border-red-500/25 bg-red-950/20 rounded-xl flex items-start gap-2.5"
              >
                <ShieldAlert className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                <span className="text-xs text-red-300 leading-tight font-mono">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleContinue} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Securing Credentials...</span>
                </>
              ) : (
                <>
                  <span>Continue Handshake</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              Already verified?{" "}
              <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
