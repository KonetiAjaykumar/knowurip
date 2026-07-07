"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle2, User, Globe, ShieldAlert, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !reason.trim() || !message.trim()) return;
    
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), reason: reason.trim(), message: message.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to transmit message.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setReason("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
      {/* Background ambient light grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#ffffff_95%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 w-full max-w-lg space-y-8">
        {/* Title */}
        <section className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold font-mono tracking-wider uppercase"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Contact Operations
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Get In <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto"
          >
            Have feedback, feature requests, or reviews? Send your thoughts to <span className="text-cyan-600 dark:text-cyan-400 font-semibold font-mono">konetiajaykumar0@gmail.com</span> or fill out the dashboard transmission module below.
          </motion.p>
        </section>

        {/* Contact Form Wrapper */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/85 dark:bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3.5 border border-red-200 dark:border-red-500/25 bg-red-50 dark:bg-red-950/20 rounded-xl flex items-start gap-2.5"
                    >
                      <ShieldAlert className="h-4.5 w-4.5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-red-700 dark:text-red-300 leading-tight font-mono">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </span>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <label htmlFor="reason" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                    Reason for Contact
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HelpCircle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </span>
                    <select
                      id="reason"
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-slate-400 dark:text-slate-600">Select a reason...</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Business Inquiry">Business Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                    Transmission Content
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your packet message here..."
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/15 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dispatching Packet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="text-center py-8 space-y-4"
              >
                <CheckCircle2 className="h-14 w-14 text-emerald-500 dark:text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-slate-950 dark:text-white font-extrabold text-xl">Review Dispatch Success!</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                  Your message has been routed to <span className="text-cyan-600 dark:text-cyan-400 font-semibold font-mono">konetiajaykumar0@gmail.com</span> successfully. Thank you for your feedback!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  New Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
