"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Check, X, Lock } from "lucide-react";

function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setError("Secure verification reset token is missing from the query path.");
      return;
    }
    setToken(t);
  }, [searchParams]);

  // Validation checks
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore = Object.values(checks).filter(Boolean).length;
  const isPasswordValid = strengthScore === 5;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !isPasswordValid || !passwordsMatch || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete password reset.");
      }

      setSuccess("Credential nodes override successful. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Reset request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="pass" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-500" />
            </span>
            <input
              id="pass"
              type="password"
              required
              disabled={!token}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Strength Meter */}
        {password.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500">STRENGTH MODULE:</span>
              <span className={
                strengthScore <= 2 ? "text-red-400" :
                strengthScore <= 4 ? "text-amber-400" :
                "text-cyan-400"
              }>
                {strengthScore <= 2 ? "WEAK" : strengthScore <= 4 ? "MODERATE" : "STRONG PROTOCOL"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-grow transition-all duration-500 ${
                    i < strengthScore
                      ? strengthScore <= 2 ? "bg-red-500" :
                        strengthScore <= 4 ? "bg-amber-500" :
                        "bg-cyan-500"
                      : "bg-white/5"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="confirmPass" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-500" />
            </span>
            <input
              id="confirmPass"
              type="password"
              required
              disabled={!token}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="p-3.5 bg-slate-950/40 rounded-xl border border-white/5 space-y-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <div className={`p-0.5 rounded-full ${checks.length ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
              {checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </div>
            <span>Minimum 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-0.5 rounded-full ${checks.uppercase ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
              {checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </div>
            <span>At least one uppercase character</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-0.5 rounded-full ${checks.lowercase ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
              {checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </div>
            <span>At least one lowercase character</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-0.5 rounded-full ${checks.number ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
              {checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </div>
            <span>At least one numeric digit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-0.5 rounded-full ${checks.special ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
              {checks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </div>
            <span>At least one special character</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !token || !isPasswordValid || !passwordsMatch}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:opacity-50 text-white font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Resetting Credentials...</span>
            </>
          ) : (
            <span>Update Identity Password</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-3 py-1 rounded-full">
            Credential Override
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight pt-1">
            Reset <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Password</span>
          </h1>
          <p className="text-xs text-slate-400">
            Define new access credentials for your account terminal.
          </p>
        </div>

        <Suspense fallback={
          <div className="h-64 border border-white/10 rounded-2xl bg-slate-900/60 p-8 backdrop-blur-md flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
