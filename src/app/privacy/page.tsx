"use client";

import { motion } from "framer-motion";
import { Shield, EyeOff, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const privacyPoints = [
    {
      title: "Real-time Verification",
      description: "We only process your IP address on the fly. When you load the homepage, our server routes resolve the IP in memory to query IPinfo, return the payload, and instantly purge the session.",
      icon: EyeOff
    },
    {
      title: "Zero Log Policy",
      description: "We do not store database entries, logs, search queries, or network histories. Your IP is yours alone, and we respect your digital footprints.",
      icon: Lock
    },
    {
      title: "No Data Sharing",
      description: "We do not monetize your connections. We never sell, distribute, or share network configurations, geolocation details, or device specs with third-party advertising brokers.",
      icon: Shield
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Background ambient light grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#ffffff_95%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-12">
        {/* Title */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold font-mono tracking-wider uppercase"
          >
            <FileText className="h-3.5 w-3.5" />
            Security & Trust
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Privacy <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">Commitment</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-base"
          >
            Our core mission is transparency. Learn how we handle your network data.
          </motion.p>
        </section>

        {/* Dynamic Accordion/List of points */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {privacyPoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none flex flex-col sm:flex-row gap-5 items-start"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/20 flex items-center justify-center shrink-0">
                  <IconComponent className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-950 dark:text-white text-lg">{point.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{point.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Conclusion card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/5 p-6 rounded-2xl text-center space-y-4 shadow-sm dark:shadow-none"
        >
          <CheckCircle2 className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mx-auto" />
          <h4 className="font-bold text-slate-950 dark:text-white text-base">GDPR & CCPA Compliant Design</h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            By design, KnowUrIP is fully compliant with modern data protection acts (GDPR, CCPA) because we do not collect personal identifiers or build tracking profiles of our visitors.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
