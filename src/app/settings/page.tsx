"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Trash2, Save, User, Bell, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AVAILABLE_AVATARS = [
  { id: "cyber-avatar-1", color: "from-cyan-400 to-blue-500", label: "Neon Cyan" },
  { id: "cyber-avatar-2", color: "from-purple-400 to-pink-500", label: "Cyber Pink" },
  { id: "cyber-avatar-3", color: "from-emerald-400 to-teal-500", label: "Matrix Green" },
  { id: "cyber-avatar-4", color: "from-amber-400 to-orange-500", label: "Solar Gold" },
];

export default function SettingsPage() {
  const { user, loading, logout, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "cyber-avatar-1");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Deletion logic states
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleting, setDeleting] = useState(false);
  
  // Mock notifications toggles
  const [prefNetwork, setPrefNetwork] = useState(true);
  const [prefSecurity, setPrefSecurity] = useState(true);
  const [prefWeekly, setPrefWeekly] = useState(false);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || updating) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), avatar: selectedAvatar }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile settings.");
      }

      setSuccess("Profile settings updated successfully.");
      // Sync global context
      updateUser({ fullName: data.user.fullName, avatar: data.user.avatar });
    } catch (err: any) {
      setError(err.message || "Settings update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "DELETE" || deleting) return;

    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to terminate database node account.");
      }

      setSuccess("Account terminated. Purging credentials...");
      logout();
    } catch (err: any) {
      setError(err.message || "Account deletion failed.");
      setDeleting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-3 py-1 rounded-full">
            Settings Console
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight pt-1">
            System <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-xs text-slate-400">
            Customize node parameters, toggle notifications, or manage account identity logs.
          </p>
        </div>

        <div className="space-y-6">
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 border border-red-500/25 bg-red-950/20 rounded-xl flex items-start gap-2.5"
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
                className="p-3.5 border border-emerald-500/25 bg-emerald-950/20 rounded-xl flex items-start gap-2.5"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-300 leading-tight font-mono">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Section: Profile details & Predefined Avatar selectors */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="border border-white/10 rounded-2xl bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-6"
          >
            <div className="pb-4 border-b border-white/5">
              <h3 className="text-sm font-bold text-white tracking-tight">Identity Profile Attributes</h3>
              <p className="text-[11px] text-slate-500">Configure parameters associated with your session node.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
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

              {/* Predefined Avatar Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                  Select Cyber Profile Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {AVAILABLE_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? "border-cyan-500 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                            : "border-white/10 bg-slate-950/30 hover:border-white/20 hover:bg-slate-950/50"
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center border border-white/10`}>
                          {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{avatar.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={updating || !fullName.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:opacity-50 text-white font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Save className="h-4 w-4" />
                <span>Save Attributes</span>
              </button>
            </form>
          </motion.div>

          {/* Email Preferences (Mocked Toggle Switches) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-white/10 rounded-2xl bg-slate-900/60 p-6 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-5"
          >
            <div className="pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Notification Channels</h3>
              </div>
              <p className="text-[11px] text-slate-500">Enable or disable dynamic email alerts routed via SMTP.</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-semibold">Security Audit Alerts</p>
                  <p className="text-[10px] text-slate-500">Notify immediately upon VPN/Proxy threat detection events.</p>
                </div>
                <button
                  onClick={() => setPrefSecurity(!prefSecurity)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${prefSecurity ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "bg-slate-800 border border-white/10"}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${prefSecurity ? "translate-x-5" : "translate-x-0"}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-semibold">Network Latency Bulletins</p>
                  <p className="text-[10px] text-slate-500">Alert if client resolution or ISP gateway changes.</p>
                </div>
                <button
                  onClick={() => setPrefNetwork(!prefNetwork)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${prefNetwork ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "bg-slate-800 border border-white/10"}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${prefNetwork ? "translate-x-5" : "translate-x-0"}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-semibold">Weekly Diagnostic Digest</p>
                  <p className="text-[10px] text-slate-500">Receive weekly PDF exports summarizing logged lookups.</p>
                </div>
                <button
                  onClick={() => setPrefWeekly(!prefWeekly)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${prefWeekly ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "bg-slate-800 border border-white/10"}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${prefWeekly ? "translate-x-5" : "translate-x-0"}`}></span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Critical: Account Deletion */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-red-500/20 rounded-2xl bg-red-950/5 p-6 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-4"
          >
            <div className="pb-3 border-b border-red-500/10">
              <div className="flex items-center gap-2 text-red-400">
                <Trash2 className="h-4.5 w-4.5" />
                <h3 className="text-sm font-bold tracking-tight">Danger Zone // Identity Purge</h3>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">Wipes user credentials, sessions, and logs permanently from the database.</p>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-red-300/80 leading-relaxed font-mono">
                Warning: This action cannot be undone. To authorize account deletion, type <span className="text-white font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">DELETE</span> inside the validator input.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="flex-grow bg-slate-950/60 border border-red-500/20 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none transition-colors font-mono"
                />
                <button
                  onClick={handleDeleteAccount}
                  disabled={confirmDelete !== "DELETE" || deleting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-950/50 disabled:opacity-50 text-white font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] shrink-0"
                >
                  {deleting ? "Purging Node..." : "Terminate Account Node"}
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
