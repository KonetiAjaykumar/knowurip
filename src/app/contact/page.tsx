"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    // Simulate API request delay
    setTimeout(() => {
      setSubmitting(false);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Contact <span className="text-gradient-primary">Support</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Have questions or feedback about our IP intelligence service? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Contact Info (2 Cols) */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-400" />
              <span>Get in Touch</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We welcome partnerships, feature requests, and inquiry reports. Our team typically replies within 24 hours.
            </p>
            
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-indigo-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">Email Support</span>
                  <span className="font-mono text-gray-300">support@knowurip.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 bg-indigo-500/5 border-indigo-500/10">
            <h4 className="font-semibold text-white text-sm">Enterprise Queries</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              For high-volume query access, custom geofencing feeds, or threat intelligence integrations, please contact our business desk directly at <span className="text-indigo-300 font-mono">enterprise@knowurip.com</span>.
            </p>
          </div>
        </div>

        {/* Contact Form (3 Cols) */}
        <div className="md:col-span-3">
          {status === "success" ? (
            <div className="glass-panel p-8 text-center border-emerald-500/25 bg-emerald-500/5 space-y-4 h-full flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 glow-ring-green">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">Message Sent Successfully</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out! We've received your query and will be in touch with you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-[#0a0a19]/50 text-sm text-white placeholder-gray-600 rounded-lg border border-white/5 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-[#0a0a19]/50 text-sm text-white placeholder-gray-600 rounded-lg border border-white/5 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Feature feedback / API inquiry"
                  className="w-full px-4 py-2.5 bg-[#0a0a19]/50 text-sm text-white placeholder-gray-600 rounded-lg border border-white/5 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2.5 bg-[#0a0a19]/50 text-sm text-white placeholder-gray-600 rounded-lg border border-white/5 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all resize-none"
                ></textarea>
              </div>

              {status === "error" && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Failed to send message. Please try again.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
