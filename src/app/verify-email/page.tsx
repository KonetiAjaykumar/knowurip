"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, ShieldCheck, ShieldAlert, RefreshCw, Clock, AlertTriangle, Globe, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes
const RESEND_THROTTLE_SECONDS = 60;

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Countdown timers
  const [expirySeconds, setExpirySeconds] = useState(OTP_EXPIRY_SECONDS);
  const [resendSeconds, setResendSeconds] = useState(RESEND_THROTTLE_SECONDS);
  const [expired, setExpired] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signup_email");
    const storedName = sessionStorage.getItem("signup_name");
    const storedPassword = sessionStorage.getItem("signup_password");

    if (!storedEmail || !storedName || !storedPassword) {
      router.push("/signup");
      return;
    }

    setEmail(storedEmail);
    setFullName(storedName);
    setPassword(storedPassword);

    // Focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, [router]);

  // OTP expiry countdown
  useEffect(() => {
    if (expired) return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          setError("Your verification code has expired. Please request a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expired]);

  // Resend throttle countdown
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const interval = setInterval(() => {
      setResendSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);
    setError(null);

    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const otpValue = otp.join("");
  const isOtpComplete = otpValue.length === OTP_LENGTH;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete || loading || expired) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Verify OTP
      const verifyRes = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Incorrect verification code. Please try again.");
      }

      // Step 2: Complete registration with all stored data
      const completeRes = await fetch("/api/auth/signup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, otp: otpValue }),
      });

      const completeData = await completeRes.json();
      if (!completeRes.ok) {
        throw new Error(completeData.error || "Failed to complete registration.");
      }

      // Clear session storage
      sessionStorage.removeItem("signup_email");
      sessionStorage.removeItem("signup_name");
      sessionStorage.removeItem("signup_password");

      // Auto-login
      login(completeData.user);

      setSuccess("Email verified successfully! Welcome to KnowUrIP 🎉");
      setTimeout(() => router.push("/"), 1500);

    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
      // Shake the inputs on error
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0 || resending || !email) return;

    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/signup/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend verification code.");
      }

      // Reset both countdowns
      setExpirySeconds(OTP_EXPIRY_SECONDS);
      setResendSeconds(RESEND_THROTTLE_SECONDS);
      setExpired(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      setSuccess("A new verification code has been sent to your email.");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || "Failed to resend. Please wait a moment.");
    } finally {
      setResending(false);
    }
  };

  // Expiry color
  const expiryColor = expirySeconds > 120 ? "text-emerald-400" : expirySeconds > 60 ? "text-amber-400" : "text-red-400";
  const expiryBg = expirySeconds > 120 ? "bg-emerald-500/10 border-emerald-500/20" : expirySeconds > 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <Globe className="h-7 w-7 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-black tracking-wider text-white font-mono">
              KNOW<span className="text-cyan-400">UR</span>IP
            </span>
          </Link>

          {/* Email icon badge */}
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Mail className="h-8 w-8 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">Check your inbox</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            We sent a 6-digit verification code to<br />
            <span className="text-white font-semibold">{email}</span>
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Timer */}
          <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold mb-6 ${expiryBg} ${expiryColor}`}>
            <Clock className="h-4 w-4" />
            <span>Code expires in <span className="font-mono font-black">{formatTime(expirySeconds)}</span></span>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 leading-tight">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-300 leading-tight">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={expired || loading}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-2xl font-black font-mono rounded-xl border transition-all focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed
                    ${digit
                      ? "bg-cyan-500/10 border-cyan-500/60 text-cyan-300 focus:ring-cyan-500/30"
                      : "bg-slate-950/60 border-white/15 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    }`}
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isOtpComplete || expired}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying your account...</span>
                </>
              ) : success ? (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified! Redirecting...</span>
                </>
              ) : (
                "Verify & Complete Registration"
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
            <div className="text-center">
              {resendSeconds > 0 ? (
                <p className="text-sm text-slate-400">
                  Resend code in{" "}
                  <span className="text-white font-mono font-bold">{resendSeconds}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                  {resending ? "Sending new code..." : "Resend verification code"}
                </button>
              )}
            </div>

            {/* Check Spam Notice */}
            <div className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                <span className="font-semibold text-amber-300">Can't find the email?</span> Please check your <span className="font-semibold">spam or junk folder</span>. Sometimes verification emails land there. If it's still missing, click resend above.
              </p>
            </div>

            {/* Back to signup */}
            <div className="text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Used a wrong email? Go back to register
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
