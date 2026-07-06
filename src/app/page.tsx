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
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden flex flex-col justify-between">
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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-semibold font-mono tracking-wider uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Connection Scanner Online
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
          >
            Discover Your <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">Digital Identity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base font-mono tracking-wide"
          >
            Real-time IP Intelligence, Geolocation Mapping & Security Auditing
          </motion.p>
        </section>

        {/* SEARCH BAR */}
        <div className="max-w-md mx-auto relative z-20 space-y-2.5">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search IP / Domain (e.g. 8.8.8.8 or google.com)"
                className="w-full bg-slate-900/60 border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0"
            >
              Lookup
            </button>
            {activeIp && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-white transition-all cursor-pointer hover:bg-white/10 shrink-0"
              >
                Reset
              </button>
            )}
          </form>

          {/* Preset IP/Domain Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Presets:</span>
            {["8.8.8.8", "1.1.1.1", "google.com", "github.com"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSearchQuery(preset);
                  fetchIPData(preset);
                }}
                className="px-2 py-0.5 rounded border border-white/5 bg-slate-900/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          /* Dark Cyber Loading Skeleton */
          <div className="space-y-8 animate-pulse pt-6">
            <div className="max-w-xl mx-auto h-40 bg-slate-900/50 border border-white/5 rounded-2xl cyber-shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-900/50 border border-white/5 rounded-2xl cyber-shimmer"></div>
              <div className="h-64 bg-slate-900/50 border border-white/5 rounded-2xl cyber-shimmer"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 bg-slate-900/50 border border-white/5 rounded-2xl cyber-shimmer"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error Banner */
          <div className="max-w-md mx-auto p-6 border border-red-500/20 bg-red-950/20 rounded-2xl backdrop-blur-md text-center space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
            <h3 className="text-white font-bold text-lg">DNS Resolution Error</h3>
            <p className="text-slate-400 text-sm">{error}</p>
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
              className="max-w-xl mx-auto border border-white/10 rounded-2xl bg-slate-900/70 p-6 backdrop-blur-xl text-center shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500"
            >
              {/* Dynamic top light bar */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                Your Public IP Address
              </span>
              
              <div className="my-4 flex items-center justify-center gap-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono text-white select-all tracking-tight break-all">
                  {data.ip}
                </h2>
                <div className="px-2.5 py-0.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold font-mono uppercase shrink-0">
                  {data.ip.includes(":") ? "IPv6" : "IPv4"}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/40 text-xs font-semibold text-white transition-all duration-300 cursor-pointer hover:bg-cyan-500/20"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => fetchIPData(activeIp || undefined)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-white transition-all duration-300 cursor-pointer hover:bg-white/10"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Refresh Node</span>
                </button>
              </div>
            </motion.div>

            {/* GRID OF DETAILS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEFT CARD - Security Audit Indicators */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="border border-white/10 rounded-2xl bg-slate-900/75 p-6 backdrop-blur-xl hover:border-cyan-500/20 transition-all duration-500 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
                    <div className="flex items-center gap-2.5">
                      <Shield className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-bold text-white text-base">Security & Privacy Audit</h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ENCRYPTED
                    </span>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">VPN Tunnel:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${data.security.vpn ? "bg-red-500/10 text-red-400 border border-red-500/25" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"}`}>
                        {data.security.vpn ? "VPN DETECTED" : "NO VPN DETECTED"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Proxy Connection:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${data.security.proxy ? "bg-red-500/10 text-red-400 border border-red-500/25" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"}`}>
                        {data.security.proxy ? "PROXY DETECTED" : "NO PROXY DETECTED"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Tor Exit Node:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${data.security.tor ? "bg-red-500/10 text-red-400 border border-red-500/25" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"}`}>
                        {data.security.tor ? "TOR EXIT DETECTED" : "NO TOR EXIT DETECTED"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Hosting / Datacenter:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${data.security.hosting ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"}`}>
                        {data.security.hosting ? "DATACENTER / CLOUD" : "RESIDENTIAL / ISP"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />
                    <span className="text-xs text-slate-400">Threat Risk Assessment:</span>
                  </div>
                  <span className={`text-xs font-bold font-mono tracking-wider px-3 py-1 rounded-lg ${
                    data.security.riskLevel === "High" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : data.security.riskLevel === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {data.security.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </motion.div>

              {/* RIGHT CARD - Browser, Device & OS Analytics */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="border border-white/10 rounded-2xl bg-slate-900/75 p-6 backdrop-blur-xl hover:border-cyan-500/20 transition-all duration-500 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
                    <div className="flex items-center gap-2.5">
                      <Monitor className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-bold text-white text-base">Device & Browser Analytics</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Client Data</span>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Operating System:</span>
                      <span className="text-white font-semibold">{clientInfo?.os || "Loading..."}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Web Browser:</span>
                      <span className="text-white font-semibold">{clientInfo?.browser || "Loading..."}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Display Resolution:</span>
                      <span className="text-white font-semibold">{clientInfo?.resolution || "Loading..."}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">System Language:</span>
                      <span className="text-white font-semibold">{clientInfo?.language || "Loading..."}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-cyan-400" />
                    <span className="text-xs text-slate-400">Client Local Time:</span>
                  </div>
                  <span className="text-xs text-white font-mono font-bold">
                    {clientInfo?.localTime ? `${clientInfo.localTime} @ ${liveClock}` : "Loading..."}
                  </span>
                </div>
              </motion.div>

            </div>

            {/* GRID OF 6 DETAILS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Geolocation */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="border border-white/10 rounded-2xl bg-slate-900/70 p-5 backdrop-blur-xl hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Location Data</span>
                  <h4 className="font-bold text-white text-sm">Geographical</h4>
                  <div className="flex items-center gap-2 pt-1">
                    <img 
                      src={data.countryFlagUrl} 
                      alt={data.country} 
                      className="w-5 h-3.5 object-cover rounded-sm border border-white/5 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <p className="text-xs text-slate-300 font-mono truncate max-w-[150px]">
                      {data.city}, {data.region}, {data.country}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">Postal: {data.postal}</span>
                </div>
              </motion.div>

              {/* Card 2: Coordinates */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="border border-white/10 rounded-2xl bg-slate-900/70 p-5 backdrop-blur-xl hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="space-y-1 flex-grow">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Positioning</span>
                    <h4 className="font-bold text-white text-sm">Coords (Lat, Long)</h4>
                    <p className="text-xs text-slate-300 font-mono pt-1">
                      {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Small Clickable Google Maps Preview */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full h-32 rounded-xl overflow-hidden border border-white/5 bg-slate-950 cursor-pointer group/map"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(10%)", pointerEvents: "none" }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                  <div className="absolute inset-0 bg-cyan-500/0 hover:bg-cyan-500/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover/map:opacity-100 transition-opacity duration-300 bg-slate-950/80 border border-cyan-500/30 text-[10px] text-cyan-400 font-mono px-2.5 py-1 rounded">
                      Open in Google Maps
                    </span>
                  </div>
                </a>
              </motion.div>

              {/* Card 3: ISP / Network */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="border border-white/10 rounded-2xl bg-slate-900/70 p-5 backdrop-blur-xl hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Server className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Internet Provider</span>
                  <h4 className="font-bold text-white text-sm truncate max-w-[180px]">{data.isp}</h4>
                  <p className="text-xs text-slate-300 font-mono truncate max-w-[180px] pt-1">
                    {data.organization}
                  </p>
                </div>
              </motion.div>

              {/* Card 4: ASN Block */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="border border-white/10 rounded-2xl bg-slate-900/70 p-5 backdrop-blur-xl hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Network Block</span>
                  <h4 className="font-bold text-white text-sm">{data.asn}</h4>
                  <p className="text-xs text-slate-300 font-mono truncate max-w-[180px] pt-1">
                    Autonomous System Routing
                  </p>
                </div>
              </motion.div>

              {/* Card 5: Timezone */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="border border-white/10 rounded-2xl bg-slate-900/70 p-5 backdrop-blur-xl hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Timezone Grid</span>
                  <h4 className="font-bold text-white text-sm truncate max-w-[180px]">{data.timezone}</h4>
                  <p className="text-xs text-slate-300 font-mono pt-1">
                    Local Timezone Registry
                  </p>
                </div>
              </motion.div>

              {/* Card 6: Reverse DNS Hostname */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="border border-white/10 rounded-2xl bg-slate-900/70 p-5 backdrop-blur-xl hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Info className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Reverse DNS</span>
                  <h4 className="font-bold text-white text-xs truncate max-w-[180px]">{data.hostname}</h4>
                  <p className="text-xs text-slate-300 font-mono pt-1">
                    Hostname Mapping
                  </p>
                </div>
              </motion.div>

            </div>

            {/* ACTION PANELS - Export JSON & Share */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-sm font-semibold text-white transition-all cursor-pointer hover:bg-slate-800"
              >
                <Download className="h-4 w-4 text-cyan-400" />
                <span>Export Report (JSON)</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-sm font-semibold text-white transition-all cursor-pointer hover:bg-slate-800"
              >
                {shared ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-cyan-400" />
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
