"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Globe, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  MapPin, 
  Server, 
  Download, 
  Share2, 
  Monitor, 
  Info,
  ExternalLink 
} from "lucide-react";
import Link from "next/link";
import WorldMap from "@/components/WorldMap";

interface IPData {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  countryFlagUrl: string;
  postal: string;
  timezone: string;
  latitude: number;
  longitude: number;
  asn: string;
  isp: string;
  organization: string;
  security: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    hosting: boolean;
    riskLevel: "Low" | "Medium" | "High";
  };
  isLocalHost: boolean;
}

interface ClientInfo {
  browser: string;
  os: string;
  resolution: string;
  language: string;
  localTime: string;
}

export default function HomePage() {
  const [data, setData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Query states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIp, setActiveIp] = useState<string | null>(null);

  // Interactive Feedbacks
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [liveClock, setLiveClock] = useState("");
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);

  // Fetch IP details from server endpoint (auto-detect or query custom IP)
  const fetchIPData = useCallback(async (ipQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = ipQuery ? `/api/ip?ip=${encodeURIComponent(ipQuery)}` : "/api/ip";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned code ${res.status}: Failed to resolve network identity.`);
      }
      const ipJson: IPData = await res.json();
      setData(ipJson);
      setSearchQuery(ipJson.ip); // Keep input in sync with loaded data
      if (ipQuery) {
        setActiveIp(ipJson.ip);
      } else {
        setActiveIp(null);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to retrieve network details.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchIPData();
  }, [fetchIPData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchIPData(searchQuery.trim());
  };

  const handleReset = () => {
    setSearchQuery("");
    fetchIPData();
  };

  // Update Clock & Client Information
  useEffect(() => {
    // Live clock update
    const updateTime = () => {
      const date = new Date();
      setLiveClock(
        date.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Client device metrics (only on client)
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    let os = "Unknown OS";

    if (ua.includes("Firefox")) browser = "Mozilla Firefox";
    else if (ua.includes("Edg")) browser = "Microsoft Edge";
    else if (ua.includes("Chrome")) browser = "Google Chrome";
    else if (ua.includes("Safari")) browser = "Apple Safari";

    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    setClientInfo({
      browser,
      os,
      resolution: `${window.screen.width} x ${window.screen.height}`,
      language: navigator.language || "en-US",
      localTime: new Date().toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric"
      })
    });

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ ...data, clientInfo }, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `knowurip-${data.ip}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    if (!data) return;
    const shareText = `KnowUrIP Network Identity:\nIP: ${data.ip}\nLocation: ${data.city}, ${data.country}\nISP: ${data.isp}\nVPN Detected: ${data.security.vpn ? "Yes" : "No"}`;
    
    if (navigator.share) {
      navigator.share({
        title: "KnowUrIP - My Network Identity",
        text: shareText,
        url: window.location.origin
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Animated Map Component */}
      {data && !loading && !error && (
        <WorldMap
          userLatitude={data.latitude}
          userLongitude={data.longitude}
          userCity={data.city}
          userCountry={data.country}
          isLocalHost={data.isLocalHost}
        />
      )}

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-grow">
        
        {/* HERO SECTION */}
        <section className="text-center pt-4 max-w-2xl mx-auto space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold font-mono tracking-wider uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse"></span>
            Connection Scanner Online
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Discover Your <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">Digital Identity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-mono tracking-wide"
          >
            Real-time IP Intelligence, Geolocation Mapping & Security Auditing
          </motion.p>
        </section>

        {loading ? (
          /* Light/Dark Cyber Loading Skeleton */
          <div className="space-y-8 animate-pulse pt-6">
            <div className="max-w-xl mx-auto h-40 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl cyber-shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl cyber-shimmer"></div>
              <div className="h-64 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl cyber-shimmer"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl cyber-shimmer"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error Banner */
          <div className="max-w-md mx-auto p-6 border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-950/20 rounded-2xl backdrop-blur-md text-center space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.05)] dark:shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">DNS Resolution Error</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{error}</p>
            <button
              onClick={() => fetchIPData(activeIp || undefined)}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Retry Node Handshake
            </button>
          </div>
        ) : data ? (
          /* Dashboard Layout */
          <div className="space-y-8">
            
            {/* PRIMARY CARD - Giant Glassmorphism Floating IP Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto border border-slate-200 dark:border-white/10 rounded-2xl bg-white/85 dark:bg-slate-900/70 p-6 backdrop-blur-xl text-center shadow-[0_12px_40px_0_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-cyan-500/40 dark:hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500"
            >
              {/* Dynamic top light bar */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                Your Public IP Address
              </span>
              
              <form onSubmit={handleSearch} className="my-4 space-y-4">
                <div className="flex items-center justify-center gap-3 max-w-md mx-auto border-b border-slate-200 dark:border-white/5 focus-within:border-cyan-500/50 transition-colors pb-1.5">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter IP or Domain..."
                    className="w-full text-center text-xl sm:text-2xl md:text-3xl font-extrabold font-mono text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 placeholder-slate-400 dark:placeholder-slate-700 tracking-tight break-all"
                  />
                  {searchQuery !== data.ip && (
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] cursor-pointer transition-all shadow-[0_0_10px_rgba(6,182,212,0.25)] shrink-0 font-mono uppercase"
                    >
                      Go
                    </button>
                  )}
                  <div className="px-2 py-0.5 rounded-full border border-cyan-500/20 dark:border-cyan-400/20 bg-cyan-50/5 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold font-mono uppercase shrink-0">
                    {data.ip.includes(":") ? "IPv6" : "IPv4"}
                  </div>
                </div>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 text-xs font-semibold text-cyan-700 dark:text-white transition-all duration-300 cursor-pointer hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => fetchIPData(activeIp || undefined)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs font-semibold text-slate-700 dark:text-white transition-all duration-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-505 dark:text-slate-400" />
                  <span>Refresh Node</span>
                </button>
                {activeIp && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50/50 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 text-xs font-semibold text-cyan-700 dark:text-white transition-all duration-300 cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-500/20"
                  >
                    <span>Reset to My IP</span>
                  </button>
                )}
              </div>

              {/* Preset IP/Domain Shortcuts */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="text-slate-400">Presets:</span>
                {["8.8.8.8", "1.1.1.1", "google.com", "github.com"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSearchQuery(preset);
                      fetchIPData(preset);
                    }}
                    className="px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/20 transition-all cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* BORDERLESS DIAGNOSTIC CATEGORIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-6">
              
              {/* Category 1: Geolocation & Live Map */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-200 dark:border-cyan-500/20 pb-2">
                  <h3 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">01 // Geolocation & Mapping</h3>
                </div>
                <div className="space-y-5 font-mono text-sm">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">GEOGRAPHY</span>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <img 
                          src={data.countryFlagUrl} 
                          alt={data.country} 
                          className="w-4.5 h-3 object-cover rounded-sm border border-slate-200 dark:border-white/5" 
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <span className="text-slate-900 dark:text-white font-semibold">{data.city}, {data.region}, {data.country}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block pt-0.5">Postal: {data.postal}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">COORDINATES</span>
                      <span className="text-slate-900 dark:text-white font-semibold pt-0.5 block">{data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</span>
                    </div>
                  </div>

                  {/* Embedded Google Map */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 cursor-pointer group/map mt-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, pointerEvents: "none" }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                      className="dark:invert dark:hue-rotate-180 dark:grayscale"
                    ></iframe>
                    <div className="absolute inset-0 bg-cyan-500/0 hover:bg-cyan-500/5 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover/map:opacity-100 transition-opacity duration-300 bg-white/95 dark:bg-slate-950/90 border border-cyan-500/30 text-[10px] text-cyan-600 dark:text-cyan-400 font-mono px-2 py-1 rounded shadow-sm">
                        Open Google Maps
                      </span>
                    </div>
                  </a>
                </div>
              </motion.div>

              {/* Category 2: Network Identity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-200 dark:border-cyan-500/20 pb-2">
                  <h3 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">02 // Network Routing</h3>
                </div>
                <div className="space-y-5 font-mono text-sm">
                  <div className="flex items-start gap-4">
                    <Server className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">ISP PROVIDER</span>
                      <span className="text-slate-900 dark:text-white font-semibold pt-0.5 block">{data.isp}</span>
                      <span className="text-[10px] text-slate-400 block pt-0.5">{data.organization}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Cpu className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">ASN ROUTING</span>
                      <span className="text-slate-900 dark:text-white font-semibold pt-0.5 block">{data.asn}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Info className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">REVERSE DNS</span>
                      <span className="text-slate-900 dark:text-white font-semibold pt-0.5 block text-xs break-all leading-relaxed">{data.hostname}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">TIMEZONE</span>
                      <span className="text-slate-900 dark:text-white font-semibold pt-0.5 block">{data.timezone}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Category 3: Security & Client Audit */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-200 dark:border-cyan-500/20 pb-2">
                  <h3 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">03 // Security & Client Audit</h3>
                </div>
                <div className="space-y-5 font-mono text-xs">
                  {/* Security indicators */}
                  <div className="space-y-3.5 border-b border-slate-100 dark:border-white/5 pb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">VPN Tunnel:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${data.security.vpn ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-transparent" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-transparent"}`}>
                        {data.security.vpn ? "DETECTED" : "CLEAN"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Proxy Shield:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${data.security.proxy ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-transparent" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-transparent"}`}>
                        {data.security.proxy ? "DETECTED" : "CLEAN"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tor Exit Node:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${data.security.tor ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-transparent" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-transparent"}`}>
                        {data.security.tor ? "DETECTED" : "CLEAN"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Cloud Hosting:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${data.security.hosting ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-transparent" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-transparent"}`}>
                        {data.security.hosting ? "DATACENTER" : "RESIDENTIAL"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">Risk Assessment:</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                        data.security.riskLevel === "High" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20" :
                        data.security.riskLevel === "Medium" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" :
                        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                      }`}>
                        {data.security.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>

                  {/* Client device stats */}
                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Operating System:</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{clientInfo?.os}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Web Browser:</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{clientInfo?.browser}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Display Grid:</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{clientInfo?.resolution}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Client Clock:</span>
                      <span className="text-slate-900 dark:text-white font-semibold font-bold">{clientInfo?.localTime} @ {liveClock}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* ACTION PANELS - Export JSON & Share */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-cyan-500/30 text-sm font-semibold text-slate-800 dark:text-white transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm"
              >
                <Download className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span>Export Report (JSON)</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-cyan-500/30 text-sm font-semibold text-slate-800 dark:text-white transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm"
              >
                {shared ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Share Details</span>
                  </>
                )}
              </button>
            </div>
            
          </div>
        ) : null}
      </div>
    </div>
  );
}
