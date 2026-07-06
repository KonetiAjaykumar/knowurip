"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, RefreshCw, KeyRound } from "lucide-react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const signupEmail = sessionStorage.getItem("signup_email");
    if (!signupEmail) {
      router.push("/signup");
      return;
    }
    setEmail(signupEmail);
  }, [router]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !email) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Store OTP key to proceed to password setup
      sessionStorage.setItem("signup_otp", otp);
      setSuccess("OTP verification successful. Handshaking secure password setup...");
      
      setTimeout(() => {
        router.push("/create-password");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Incorrect verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;

    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      const fullName = sessionStorage.getItem("signup_name") || "";
      const res = await fetch("/api/auth/signup/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }

      setSuccess("New verification code dispatched to your mailbox.");
      setCountdown(60); // 60 seconds block
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please wait.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-3 py-1 rounded-full">
            Security Protocol // 02
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight pt-1">
            Email <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Verification</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            A secure 6-digit OTP code has been dispatched to: <br/>
            <span className="text-white font-semibold font-mono break-all">{email}</span>
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3.5 border border-emerald-500/25 bg-emerald-950/20 rounded-xl flex items-start gap-2.5"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-300 leading-tight font-mono">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="otp" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider text-center">
                Enter Verification Code (6-Digits)
              </label>
              <div className="relative max-w-[240px] mx-auto">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  className="w-full text-center tracking-[0.6em] bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-9 pr-3 py-3 text-lg font-extrabold font-mono text-white placeholder-slate-700 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:opacity-50 text-white font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Node Code...</span>
                </>
              ) : (
                <span>Verify & Confirm Identity</span>
              )}
            </button>
          </form>

          {/* Resend Trigger */}
          <div className="mt-6 text-center border-t border-white/5 pt-4">
            {countdown > 0 ? (
              <p className="text-xs text-slate-500">
                Resend code in <span className="text-cyan-400 font-mono font-bold">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-semibold cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
                <span>Resend Code Package</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
