"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, XCircle, ShieldAlert, Globe } from "lucide-react";

interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checks: PasswordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore = Object.values(checks).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strengthScore <= 1) return { label: "Very Weak", color: "bg-red-500", text: "text-red-400" };
    if (strengthScore === 2) return { label: "Weak", color: "bg-orange-500", text: "text-orange-400" };
    if (strengthScore === 3) return { label: "Fair", color: "bg-yellow-500", text: "text-yellow-400" };
    if (strengthScore === 4) return { label: "Strong", color: "bg-blue-500", text: "text-blue-400" };
    return { label: "Very Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strength = getStrengthLabel();
  const isPasswordValid = strengthScore >= 3;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = fullName.trim() && email.trim() && isPasswordValid && passwordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      // Store registration data in session storage for next step
      sessionStorage.setItem("signup_email", email.trim());
      sessionStorage.setItem("signup_name", fullName.trim());
      sessionStorage.setItem("signup_password", password);

      router.push("/verify-email");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <Globe className="h-7 w-7 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-black tracking-wider text-white font-mono">
              KNOW<span className="text-cyan-400">UR</span>IP
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Join KnowUrIP to explore powerful IP analytics</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Error Alert */}
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
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-500/60 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Strength Bar */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strengthScore ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.text}`}>{strength.label} password</p>
                </div>
              )}

              {/* Requirements Checklist */}
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    { key: "length", label: "8+ characters" },
                    { key: "uppercase", label: "Uppercase letter" },
                    { key: "lowercase", label: "Lowercase letter" },
                    { key: "number", label: "Number (0-9)" },
                    { key: "special", label: "Special character" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-1.5">
                      {checks[key as keyof PasswordChecks] ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                      )}
                      <span className={`text-[11px] ${checks[key as keyof PasswordChecks] ? "text-emerald-400" : "text-slate-600"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full bg-slate-950/60 border rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? "border-emerald-500/50 focus:border-emerald-500/70 focus:ring-emerald-500/20"
                        : "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                      : "border-white/10 focus:border-cyan-500/60 focus:ring-cyan-500/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs font-medium ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
                  {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending verification code...</span>
                </>
              ) : (
                "Create Account & Verify Email"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
