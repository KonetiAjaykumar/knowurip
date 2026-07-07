"use client";

import { motion } from "framer-motion";
import { Info, HelpCircle, Shield, ShieldCheck, Globe, Server, Cpu } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Background ambient light grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#ffffff_95%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold font-mono tracking-wider uppercase"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Learn IP Intelligence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Decoding <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">IP Geolocation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto"
          >
            Everything you need to know about how your digital address coordinates routing across the global web.
          </motion.p>
        </section>

        {/* Content Blocks */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Card 1: What is an IP */}
          <motion.div
            variants={itemVariants}
            className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none backdrop-blur-md space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20 flex items-center justify-center">
                <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-slate-950 dark:text-white text-lg">What is an IP Address?</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              An **Internet Protocol (IP)** address is a unique numerical label assigned to every device connected to a computer network. 
              It serves two principal functions: host or network interface identification, and location addressing. 
              Think of it as a physical mailing address for your digital device, allowing routing nodes to deliver packets of data back and forth.
            </p>
          </motion.div>

          {/* Card 2: IPv4 vs IPv6 */}
          <motion.div
            variants={itemVariants}
            className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none backdrop-blur-md space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20 flex items-center justify-center">
                <Server className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-slate-950 dark:text-white text-lg">IPv4 vs. IPv6</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              **IPv4** is the traditional 32-bit format (e.g., `8.8.8.8`) allowing for roughly 4.3 billion unique combinations, which are now nearly exhausted.
              **IPv6** is the modern 128-bit format (e.g., `2001:4860:4860::8888`) that offers an practically infinite number of addresses, ensuring that every internet-of-things device can have its own clean public identifier.
            </p>
          </motion.div>

          {/* Card 3: Geolocation Accuracy */}
          <motion.div
            variants={itemVariants}
            className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none backdrop-blur-md space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20 flex items-center justify-center">
                <Info className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-slate-950 dark:text-white text-lg">How Geolocation Works</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              IP Geolocation maps an IP address to the geographic location of the device. 
              This is resolved by querying databases maintained by ISPs and network groups. 
              While it accurately resolves country and state, city-level lookups have a varying precision of 80% to 95%. 
              It is not GPS tracking and cannot pinpoint a specific physical address or household.
            </p>
          </motion.div>

          {/* Card 4: ASN and Organization */}
          <motion.div
            variants={itemVariants}
            className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none backdrop-blur-md space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-slate-950 dark:text-white text-lg">ASNs and Networks</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              An **Autonomous System Number (ASN)** is a unique global ID given to a collection of IP routing prefixes managed by a single administrative organization (such as Comcast, Google, or AWS). 
              ASNs are the foundational building blocks of the BGP protocol, routing traffic across transit networks.
            </p>
          </motion.div>
        </motion.div>

        {/* Informational Callout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/15 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-sm dark:shadow-none"
        >
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-950 dark:text-white text-base">Security Indicators & VPNs</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              VPN, Proxy, and Tor detectors evaluate if traffic is originating from standard residential connections or masked relay hubs. 
              Routing endpoints through datacenters or known proxies raises the risk level indicator as it masks identity, which is commonly audited by secure financial platforms.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
