"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Lock, User, Mail, LogOut, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading, logout, updateUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-950">
        <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  // Password checklist validation
  const checks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const strengthScore = Object.values(checks).filter(Boolean).length;
  const isPasswordValid = strengthScore === 5;
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !passwordsMatch || updating) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password credentials.");
      }

      setSuccess("Identity password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Password modification failed.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar & Identity details */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 border border-white/10 rounded-2xl bg-slate-900/60 p-6 backdrop-blur-md flex flex-col items-center text-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="w-full space-y-4">
            <div className="relative inline-block mt-4">
              <div className="h-24 w-24 rounded-full bg-cyan-500/10 border-2 border-cyan-400/40 flex items-center justify-center text-3xl text-cyan-400 uppercase font-mono font-bold shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                {user.fullName[0]}
              </div>
              <span className="absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse"></span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold font-mono tracking-widest uppercase">
                <ShieldCheck className="h-3 w-3" />
                Verified Node
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight pt-2">{user.fullName}</h2>
              <p className="text-xs text-slate-500 font-mono break-all">{user.email}</p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-left text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                <span>Identity: {user.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>Registered: {user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyan-400" />
                <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-950/15 hover:bg-red-950/30 text-xs font-bold text-red-400 cursor-pointer transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Session</span>
          </button>
        </motion.div>

        {/* Right Side: Change Password Configuration */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 border border-white/10 rounded-2xl bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="pb-4 border-b border-white/5 mb-6">
            <h3 className="text-base font-bold text-white tracking-tight">Override Security Password</h3>
            <p className="text-xs text-slate-500">Configure new password verification keys for your node identity.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 border border-red-500/25 bg-red-950/20 rounded-xl flex items-start gap-2.5"
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
                className="mb-5 p-3.5 border border-emerald-500/25 bg-emerald-950/20 rounded-xl flex items-start gap-2.5"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-300 leading-tight font-mono">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="currPass" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  id="currPass"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="newPass" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </span>
                  <input
                    id="newPass"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmNewPass" className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </span>
                  <input
                    id="confirmNewPass"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className={`p-0.5 rounded-full ${checks.length ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
                  <Check className="h-3 w-3" />
                </div>
                <span>Minimum 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`p-0.5 rounded-full ${checks.uppercase ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
                  <Check className="h-3 w-3" />
                </div>
                <span>Uppercase letter [A-Z]</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`p-0.5 rounded-full ${checks.lowercase ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
                  <Check className="h-3 w-3" />
                </div>
                <span>Lowercase letter [a-z]</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`p-0.5 rounded-full ${checks.number ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
                  <Check className="h-3 w-3" />
                </div>
                <span>Numeric digit [0-9]</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <div className={`p-0.5 rounded-full ${checks.special ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600"}`}>
                  <Check className="h-3 w-3" />
                </div>
                <span>Special character [$, #, @, etc.]</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={updating || !isPasswordValid || !passwordsMatch}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:opacity-50 text-white font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {updating ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2 align-middle"></div>
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <span>Override Credentials</span>
              )}
            </button>
          </form>
        </motion.div>
        
      </div>
    </div>
  );
}
