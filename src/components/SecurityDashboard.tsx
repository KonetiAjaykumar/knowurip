import { Shield, ShieldAlert, ShieldCheck, HelpCircle } from "lucide-react";

interface SecurityData {
  vpn: boolean;
  proxy: boolean;
  tor: boolean;
  hosting: boolean;
  riskLevel: string;
}

interface SecurityDashboardProps {
  security: SecurityData;
}

export default function SecurityDashboard({ security }: SecurityDashboardProps) {
  const indicators = [
    {
      name: "VPN Connection",
      detected: security.vpn,
      desc: "Virtual Private Network connection",
    },
    {
      name: "Proxy Server",
      detected: security.proxy,
      desc: "Intermediary request proxy service",
    },
    {
      name: "Tor Exit Node",
      detected: security.tor,
      desc: "Anonymizing Tor network node",
    },
    {
      name: "Hosting / Datacenter",
      detected: security.hosting,
      desc: "Cloud provider or hosting facility range",
    },
  ];

  const getRiskStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return {
          bg: "bg-red-500/10 border-red-500/30",
          text: "text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
          label: "High Risk",
          desc: "Anonymizers (VPN, Tor) or suspicious proxy servers detected. Higher likelihood of automated tools or privacy cloaking.",
        };
      case "medium":
        return {
          bg: "bg-amber-500/10 border-amber-500/30",
          text: "text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
          label: "Medium Risk",
          desc: "Hosting ranges or server-side networks detected. Common for bots, crawlers, or dev servers.",
        };
      default:
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30",
          text: "text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]",
          label: "Low Risk",
          desc: "Standard residential or corporate connection. No active anonymizers or VPN proxies detected.",
        };
    }
  };

  const risk = getRiskStyles(security.riskLevel);

  return (
    <div className="space-y-6">
      {/* Risk Level Banner */}
      <div className={`border p-6 rounded-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-transparent to-white/[0.01] ${risk.bg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Security Assessment</span>
          </div>
          <h3 className={`text-2xl font-bold ${risk.text}`}>{risk.label}</h3>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed mt-1">
            {risk.desc}
          </p>
        </div>
        <div className="flex items-center justify-center">
          {security.riskLevel.toLowerCase() === "low" ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 glow-ring-green">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
          ) : (
            <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-opacity-10 border ${
              security.riskLevel.toLowerCase() === "high" 
                ? "bg-red-500/10 border-red-500/20 glow-ring-red" 
                : "bg-amber-500/10 border-amber-500/20 glow-ring-indigo"
            }`}>
              <ShieldAlert className="h-8 w-8 text-current" />
            </div>
          )}
        </div>
      </div>

      {/* Grid of Indicators */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map((item, idx) => (
          <div key={idx} className="glass-panel glass-panel-hover p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">{item.name}</span>
                {item.detected ? (
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                    <ShieldAlert className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-normal">{item.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-400">Status:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                item.detected 
                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {item.detected ? "Detected" : "Clean"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
