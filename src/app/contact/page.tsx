"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle2, User, Globe } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Background ambient light grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 w-full max-w-lg space-y-8">
        {/* Title */}
        <section className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-semibold font-mono tracking-wider uppercase"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Contact Operations
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-white"
          >
            Get In <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-400 text-sm max-w-sm mx-auto"
          >
            Have feedback, feature requests, or reviews? Send your thoughts to <span className="text-cyan-400 font-semibold font-mono">konetiajaykumar0@gmail.com</span> or fill out the dashboard transmission module below.
          </motion.p>
        </section>

        {/* Contact Form Wrapper */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-white/10 rounded-2xl bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
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
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-mono font-bold text-slate-400 block uppercase">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </span>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono font-bold text-slate-400 block uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono font-bold text-slate-400 block uppercase">
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
                      className="w-full bg-slate-950/50 border border-white/15 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors resize-none"
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
                <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-white font-extrabold text-xl">Review Dispatch Success!</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                  Your message has been routed to <span className="text-cyan-400 font-semibold font-mono">konetiajaykumar0@gmail.com</span> successfully. Thank you for your feedback!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-white transition-all cursor-pointer hover:bg-white/10"
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
