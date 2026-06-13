"use client";

import { useState, useEffect } from "react";
import { Laptop, Cpu, Shield, Clock, Languages } from "lucide-react";

export default function SystemDetails() {
  const [mounted, setMounted] = useState(false);
  const [details, setDetails] = useState({
    browser: "Detecting...",
    os: "Detecting...",
    resolution: "Detecting...",
    language: "Detecting...",
    localTime: "Detecting...",
  });

  useEffect(() => {
    setMounted(true);

    const getBrowserAndOS = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      let os = "Unknown OS";

      // Detect OS
      if (ua.indexOf("Win") !== -1) os = "Windows";
      else if (ua.indexOf("Mac") !== -1) os = "macOS";
      else if (ua.indexOf("X11") !== -1) os = "Linux";
      else if (ua.indexOf("Linux") !== -1) os = "Linux";
      else if (/Android/.test(ua)) os = "Android";
      else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

      // Detect Browser
      if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";
      else if (ua.indexOf("SamsungBrowser") !== -1) browser = "Samsung Internet";
      else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera";
      else if (ua.indexOf("Trident") !== -1) browser = "Internet Explorer";
      else if (ua.indexOf("Edge") !== -1 || ua.indexOf("Edg") !== -1) browser = "Microsoft Edge";
      else if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
      else if (ua.indexOf("Safari") !== -1) browser = "Apple Safari";

      return { browser, os };
    };

    const updateClock = () => {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const sys = getBrowserAndOS();
    
    // Set initial details
    setDetails({
      browser: sys.browser,
      os: sys.os,
      resolution: `${window.screen.width} x ${window.screen.height} px`,
      language: navigator.language || "en-US",
      localTime: updateClock(),
    });

    // Tick the clock every second
    const timer = setInterval(() => {
      setDetails((prev) => ({
        ...prev,
        localTime: updateClock(),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="glass-panel p-5 space-y-4">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <Laptop className="h-5 w-5 text-indigo-400" />
          <span>System & Connection Details</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 4, 5].map((i) => (
            <div key={i} className="h-14 shimmer rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const systemItems = [
    {
      label: "Operating System",
      value: details.os,
      icon: <Laptop className="h-4 w-4 text-indigo-400" />,
    },
    {
      label: "Browser Engine",
      value: details.browser,
      icon: <Cpu className="h-4 w-4 text-purple-400" />,
    },
    {
      label: "Screen Resolution",
      value: details.resolution,
      icon: <Shield className="h-4 w-4 text-teal-400" />,
    },
    {
      label: "System Language",
      value: details.language,
      icon: <Languages className="h-4 w-4 text-emerald-400" />,
    },
    {
      label: "Local Client Time",
      value: details.localTime,
      icon: <Clock className="h-4 w-4 text-amber-400" />,
      highlight: true,
    },
  ];

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="space-y-1">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <Laptop className="h-5 w-5 text-indigo-400" />
          <span>System & Connection Details</span>
        </h3>
        <p className="text-xs text-gray-400">
          Client-side parameters exposed by your browser session
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {systemItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border bg-white/[0.01] transition-all flex items-center gap-3 ${
              item.highlight 
                ? "border-indigo-500/20 sm:col-span-2 shadow-[inset_0_0_10px_rgba(99,102,241,0.03)]" 
                : "border-white/5"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5">
              {item.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                {item.label}
              </span>
              <p className={`text-sm font-mono font-medium ${
                item.highlight ? "text-indigo-300 font-bold" : "text-white"
              }`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
