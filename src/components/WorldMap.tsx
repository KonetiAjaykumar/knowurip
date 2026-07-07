"use client";

import { motion } from "framer-motion";

interface WorldMapProps {
  userLatitude: number;
  userLongitude: number;
  userCity: string;
  userCountry: string;
  isLocalHost: boolean;
}

export default function WorldMap({
  userLatitude,
  userLongitude,
  userCity,
  userCountry,
  isLocalHost
}: WorldMapProps) {
  // Convert latitude and longitude to percentage coordinates for SVG (Equirectangular)
  const x = ((userLongitude + 180) / 360) * 100;
  const y = ((90 - userLatitude) / 180) * 100;

  // Paths representing simplified, stylized continents for the network grid aesthetic
  const continents = [
    // North America
    "M 5,22 L 25,12 L 40,25 L 38,40 L 28,45 L 24,35 L 18,32 L 8,30 Z",
    // Greenland
    "M 33,6 L 43,8 L 38,15 Z",
    // South America
    "M 26,46 L 33,52 L 35,65 L 30,85 L 26,80 L 24,65 L 24,52 Z",
    // Eurasia (Europe + Asia)
    "M 45,15 L 75,10 L 95,18 L 92,40 L 88,52 L 78,55 L 72,48 L 65,52 L 58,45 L 45,30 Z",
    // India sub-continent detail
    "M 65,42 L 70,42 L 72,48 L 68,48 Z",
    // Africa
    "M 43,35 L 53,35 L 60,45 L 56,65 L 48,75 L 44,65 L 40,50 L 40,40 Z",
    // Australia
    "M 80,60 L 88,62 L 90,72 L 80,70 Z",
    // Japan
    "M 89,30 L 92,35 L 90,40 Z",
    // United Kingdom
    "M 43,21 L 45,21 L 44,24 Z"
  ];

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-white dark:bg-slate-950/90 select-none transition-colors duration-300">
      {/* Grid Overlay for Cyberpunk/Network look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Radial fade to hide outer edges of the map */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#ffffff_95%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_20%,#020617_95%)]"></div>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-60 dark:opacity-35"
      >
        {/* Draw continent paths */}
        {continents.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="currentColor"
            className="text-cyan-500/35 dark:text-cyan-400/25"
            strokeWidth="0.4"
            strokeDasharray="1,1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
          />
        ))}

        {/* Dynamic connection ping lines from center or top if active */}
        {!isLocalHost && (
          <motion.line
            x1="50"
            y1="0"
            x2={x}
            y2={y}
            stroke="currentColor"
            className="text-cyan-500/40 dark:text-cyan-400/20"
            strokeWidth="0.25"
            strokeDasharray="2,2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        )}
      </svg>

      {/* Pulsing Locator Indicator */}
      {!isLocalHost && (
        <div
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Glowing dot with blinking location background */}
          <div className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500/40 opacity-75"></span>
            <span className="absolute inline-flex h-12 w-12 animate-pulse rounded-full bg-cyan-400/20"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-cyan-600 dark:bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)] border border-white dark:border-slate-950"></span>
          </div>

          {/* Location tooltip text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="absolute left-9 top-0 -translate-y-1/2 whitespace-nowrap rounded-md border border-cyan-500/20 bg-white/95 dark:bg-slate-900/90 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 backdrop-blur-sm shadow-md transition-colors duration-300"
          >
            PING LOCATED // {userCity.toUpperCase()}, {userCountry.toUpperCase()}
          </motion.div>
        </div>
      )}
    </div>
  );
}
