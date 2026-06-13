"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, RefreshCw, Download, Share2, Search, Globe, ShieldAlert, Check } from "lucide-react";
import IPDashboard from "@/components/IPDashboard";
import SecurityDashboard from "@/components/SecurityDashboard";
import MapSection from "@/components/MapSection";
import SystemDetails from "@/components/SystemDetails";

interface IPData {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  postal: string;
  timezone: string;
  latitude: number;
  longitude: number;
  asn: string;
  isp: string;
  countryFlagUrl: string;
  security: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    hosting: boolean;
    riskLevel: string;
  };
  isLocalHost: boolean;
}

export default function HomePage() {
  const [data, setData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchIp, setSearchIp] = useState("");
  const [validationError, setValidationError] = useState("");
  
  // Feedback states
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Validate IPv4 and IPv6
  const validateIP = (ip: string): boolean => {
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    
    if (ipv4Regex.test(ip)) {
      // Check each octet is 0-255
      const octets = ip.split(".");
      return octets.every(octet => parseInt(octet, 10) <= 255);
    }
    
    return ipv6Regex.test(ip);
  };

  const fetchIPData = useCallback(async (ipAddress: string = "") => {
    setLoading(true);
    setError(null);
    setValidationError("");

    try {
      const url = ipAddress ? `/api/ip?ip=${encodeURIComponent(ipAddress)}` : "/api/ip";
      const res = await fetch(url);
      
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Failed to fetch IP details (Status: ${res.status})`);
      }
      
      const ipData: IPData = await res.json();
      setData(ipData);
      
      // Update the search input to the actual IP returned if loading client IP
      if (!ipAddress) {
        setSearchIp(ipData.ip);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading IP data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchIPData();
  }, [fetchIPData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIp = searchIp.trim();
    
    if (!cleanIp) {
      fetchIPData(""); // Search self
      return;
    }
    
    if (!validateIP(cleanIp)) {
      setValidationError("Please enter a valid IPv4 or IPv6 address.");
      return;
    }
    
    fetchIPData(cleanIp);
  };

  // Actions
  const handleCopyIP = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
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
    const text = `IP: ${data.ip} (${data.isp}) - Location: ${data.city}, ${data.country}. Check yours at KnowUrIP!`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      navigator.share({
        title: "KnowUrIP - Geolocation Details",
        text: text,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text} ${shareUrl}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      
      {/* Hero Header Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto pt-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] mb-2">
          <Globe className="h-6 w-6 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-white">KnowUr</span>
          <span className="text-gradient-primary">IP</span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl font-medium">
          "Discover Your Digital Identity"
        </p>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Get real-time insights about your public network presence, geolocation details, server routing, and active connection security markers.
        </p>
      </section>

      {/* Search Input Bar */}
      <section className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchIp}
              onChange={(e) => {
                setSearchIp(e.target.value);
                if (validationError) setValidationError("");
              }}
              placeholder="Search any IP address (e.g. 8.8.8.8)"
              className="w-full pl-11 pr-4 py-3 bg-[#0a0a19]/50 backdrop-blur-md text-sm text-white placeholder-gray-500 rounded-xl border border-white/5 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
            />
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-gray-500" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all cursor-pointer disabled:opacity-55"
          >
            Lookup
          </button>
        </form>
        {validationError && (
          <p className="text-xs text-red-400 mt-2 ml-2 font-medium">{validationError}</p>
        )}
      </section>

      {/* Action Controller Panel */}
      {data && !loading && !error && (
        <section className="flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto">
          <button
            onClick={handleCopyIP}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/25 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy IP</span>
              </>
            )}
          </button>

          <button
            onClick={() => fetchIPData(searchIp)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/25 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/25 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/25 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>{shared ? "Copied Share Link!" : "Share Results"}</span>
          </button>
        </section>
      )}

      {/* Main Content Layout */}
      {loading ? (
        <div className="space-y-8 animate-pulse">
          {/* Skeleton Loaders */}
          <div className="h-10 px-4 w-1/4 bg-white/5 rounded-lg"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 bg-white/5 rounded-2xl shimmer"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-44 bg-white/5 rounded-2xl shimmer"></div>
            <div className="h-44 bg-white/5 rounded-2xl shimmer"></div>
          </div>
        </div>
      ) : error ? (
        <section className="max-w-md mx-auto glass-panel border-red-500/20 p-6 text-center space-y-4 bg-red-500/5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-white text-lg">Failed to resolve IP details</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{error}</p>
          <button
            onClick={() => fetchIPData(searchIp)}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 text-red-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Retry Request
          </button>
        </section>
      ) : data ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* IP Dashboard Grid */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight text-white pl-1">
              General Identity Details
            </h2>
            <IPDashboard data={data} />
          </section>

          {/* Security & Map Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Security Dashboard */}
            <section className="lg:col-span-2 space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-white pl-1">
                Security & Anonymity Parameters
              </h2>
              <SecurityDashboard security={data.security} />
            </section>

            {/* Map Column */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-white pl-1">
                Physical Geolocation
              </h2>
              <MapSection
                latitude={data.latitude}
                longitude={data.longitude}
                city={data.city}
                region={data.region}
                country={data.country}
              />
            </section>
          </div>

          {/* Client Details Section */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight text-white pl-1">
              Client Session details
            </h2>
            <SystemDetails />
          </section>

        </div>
      ) : null}

    </div>
  );
}
