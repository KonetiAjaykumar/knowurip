import { Shield, EyeOff, Lock, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data We Process",
      desc: "When you visit KnowUrIP, our server automatically reads your public IP address from the request headers to fetch geolocation details. This data is transmitted securely to our IP intelligence partner (IPinfo) using SSL encryption.",
      icon: <EyeOff className="h-5 w-5 text-indigo-400" />,
    },
    {
      title: "No Persistent Logs",
      desc: "We do not store your IP address, browser cookies, geolocation results, or device details in any database. All lookups happen dynamically in memory. Once your request completes, the details are discarded.",
      icon: <Lock className="h-5 w-5 text-purple-400" />,
    },
    {
      title: "Third Party API Services",
      desc: "We query the IPinfo.io API to obtain network metadata (ISP, ASN, coordinates). No identifying details (like names, emails, or hardware configurations) are shared. IPinfo handles requests in accordance with their privacy guidelines.",
      icon: <Shield className="h-5 w-5 text-teal-400" />,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-md">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Privacy <span className="text-gradient-primary">Policy</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Transparent, secure, and zero-storage IP address lookup.
        </p>
      </div>

      {/* Content Cards */}
      <div className="space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="glass-panel p-6 flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5 shadow-sm">
              {sec.icon}
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white text-lg">{sec.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{sec.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="text-center text-xs text-gray-500 font-mono">
        Last updated: June 13, 2026 | KnowUrIP Compliance Team
      </div>
    </div>
  );
}
