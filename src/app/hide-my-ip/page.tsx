"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  EyeOff, 
  Server, 
  Globe, 
  Wifi, 
  Smartphone, 
  RefreshCw, 
  Lock, 
  Info, 
  ExternalLink, 
  Check, 
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  ListTodo,
  AlertTriangle,
  Play
} from "lucide-react";

export default function HideMyIpPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [hoveredVpnCard, setHoveredVpnCard] = useState<number | null>(null);

  // Quiz States
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizStep, setQuizStep] = useState<number>(0);
  const [answers, setAnswers] = useState({
    goal: "",
    budget: "",
    technical: ""
  });
  const [quizRecommendation, setQuizRecommendation] = useState<any | null>(null);

  const vpnProviders = [
    {
      name: "NordVPN",
      bestFor: "Overall Performance",
      whyWeLikeIt: "Consistently fast speeds, double data encryption, and excellent security features.",
      speed: 9.8,
      security: 9.9,
      badge: "Fastest Choice",
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-500",
      borderGlow: "hover:shadow-blue-500/10 hover:border-blue-500/30",
      link: "https://nordvpn.com",
      features: ["NordLynx protocol", "Double VPN nodes", "Obfuscated servers", "Threat protection"]
    },
    {
      name: "Proton VPN",
      bestFor: "Strict Privacy",
      whyWeLikeIt: "Based in Switzerland with a strictly audited no-logs policy and a reliable free tier.",
      speed: 9.2,
      security: 10.0,
      badge: "Most Secure",
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-500",
      borderGlow: "hover:shadow-emerald-500/10 hover:border-emerald-500/30",
      link: "https://protonvpn.com",
      features: ["Swiss privacy laws", "Secure Core servers", "NetShield Ad-blocker", "Open source apps"]
    },
    {
      name: "Surfshark",
      bestFor: "Families & Budget",
      whyWeLikeIt: "Affordable plans, fast connections, and allows unlimited simultaneous devices.",
      speed: 9.4,
      security: 9.5,
      badge: "Best Value",
      color: "from-cyan-600 to-blue-600",
      accent: "text-cyan-500",
      borderGlow: "hover:shadow-cyan-500/10 hover:border-cyan-500/30",
      link: "https://surfshark.com",
      features: ["Unlimited devices", "Bypasser split-tunnel", "CleanWeb block list", "MultiHop routing"]
    },
    {
      name: "ExpressVPN",
      bestFor: "Reliability & Speed",
      whyWeLikeIt: "Extremely easy-to-use apps with a massive and reliable global server network.",
      speed: 9.6,
      security: 9.7,
      badge: "Easiest to Use",
      color: "from-red-600 to-orange-600",
      accent: "text-red-500",
      borderGlow: "hover:shadow-red-500/10 hover:border-red-500/30",
      link: "https://expressvpn.com",
      features: ["Lightway protocol", "TrustedServer tech", "30-day money-back", "Router router app"]
    }
  ];

  const alternativeMethods = [
    {
      id: "vpn",
      title: "Virtual Private Network (VPN)",
      subtitle: "The Gold Standard Shield",
      icon: <Shield className="h-5 w-5 text-cyan-500" />,
      safety: "Highest Security",
      safetyColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      speed: "Fast Speed",
      speedColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      desc: "Sends all your device's traffic through a secure, encrypted tunnel to a remote server. Excellent overall balance of speed, privacy, and bypass ability.",
      pros: ["System-wide heavy military grade encryption", "Access content from dozens of countries", "Protects passwords, bank info, and dynamic queries"],
      cons: ["Trustworthy providers require a subscription", "Very cheap free VPNs can trade or log your data"],
      border: "hover:border-cyan-500/30",
      anonymityScore: 9,
      setupEase: "Very Easy",
      longDesc: "A VPN is the ultimate consumer privacy tool. It encrypts all network requests at the OS level, rendering your activity unreadable to ISPs, Wi-Fi hackers, and carrier systems. The destination website only sees the IP and location of the VPN server.",
      howToUse: [
        "Select a premium provider (e.g. Proton, Nord) and sign up.",
        "Download the official client software on your desktop or phone.",
        "Open the application, choose a location server, and click 'Quick Connect'.",
        "Keep the app running in the background while you browse."
      ],
      whenToUse: [
        "Everyday web browsing, shopping, and online banking.",
        "Streaming geo-restricted video content (Netflix, YouTube, etc.) at full speed.",
        "Securing your device while working on public Wi-Fi networks."
      ],
      whenNotToUse: [
        "When performing tasks requiring absolute zero network signature (in heavy oppressive regions, Tor might be preferred)."
      ]
    },
    {
      id: "proxy",
      title: "Proxy Servers",
      subtitle: "The Quick Web Bypass",
      icon: <Server className="h-5 w-5 text-indigo-500" />,
      safety: "No Encryption",
      safetyColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      speed: "Fast Speed",
      speedColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      desc: "Acts as a middleman. It masks your IP address for browser requests, but does not encrypt your network traffic.",
      pros: ["Quick setup & often 100% free", "Good for bypassing simple location blocks on school or office networks"],
      cons: ["ISP can still inspect your traffic payloads", "Vulnerable to network eavesdroppers on public hotspots"],
      border: "hover:border-indigo-500/30",
      anonymityScore: 4,
      setupEase: "Very Easy",
      longDesc: "A Proxy Server acts as an intermediary gateway between your device and the internet. When you configure a proxy, all browser requests are funneled through the proxy server first. The destination website only sees the proxy's IP address rather than yours. However, standard proxies do not encrypt your traffic, meaning your ISP (and anyone snooping on your network) can still see exactly what websites you are visiting and inspect the data you transfer.",
      howToUse: [
        "For Web Proxies: Simply visit a public web proxy site (e.g., CroxyProxy or Hidester) and paste the URL you want to visit directly into their browser search bar.",
        "For System-Wide Proxies: Open your OS Settings -> Network & Internet -> Proxy. Toggle 'Use a proxy server' on, enter the proxy's IP address and Port, and click Save.",
        "For Browser Extensions: Install a browser extension like FoxyProxy to easily toggle proxy routing on and off for specific sites."
      ],
      whenToUse: [
        "Quickly bypassing geo-blocked websites that do not employ heavy anti-bot/anti-proxy measures.",
        "Accessing web content when a local router block (like a school or corporate firewall) restricts access."
      ],
      whenNotToUse: [
        "When sending highly sensitive information such as bank passwords, personal emails, or credit cards.",
        "When using public Wi-Fi where active traffic monitoring (sniffing) might occur."
      ]
    },
    {
      id: "tor",
      title: "Tor Browser",
      subtitle: "The Ultimate Anonymity Shield",
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      safety: "Military Grade",
      safetyColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      speed: "Slow Speed",
      speedColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      desc: "Routes your connection through three separate encrypted volunteer servers worldwide, erasing your digital path.",
      pros: ["Exceptional multi-layered privacy (onion routing)", "100% Free, open source, and run by volunteers"],
      cons: ["Noticeable speed drop makes streaming tough", "Some websites flag or block Tor exit nodes"],
      border: "hover:border-purple-500/30",
      anonymityScore: 10,
      setupEase: "Medium",
      longDesc: "The Tor (The Onion Router) Browser is a specialized, open-source web browser designed for extreme privacy. When you use Tor, your internet traffic is wrapped in multiple layers of encryption (like an onion) and routed through three randomly selected servers (nodes) run by volunteers across the globe. Each node only knows the identity of the node immediately before and after it, ensuring that no single server can trace the connection from your device to the target website.",
      howToUse: [
        "Download and install the Tor Browser installer only from the official Tor Project website (torproject.org).",
        "Launch the browser and click 'Connect' to initialize your link to the Tor network circuit.",
        "Browse anonymously. Avoid installing add-ons or torrenting over Tor, as this can leak your real IP address."
      ],
      whenToUse: [
        "Accessing information under oppressive regimes or highly censored internet regions.",
        "Journalists, activists, or whistleblowers needing to protect their identity and source paths.",
        "Performing high-anonymity research without leaving tracking links back to your household."
      ],
      whenNotToUse: [
        "High-definition video streaming (Netflix, YouTube) or downloading massive files due to server bandwidth limits.",
        "Online gaming where low latency (ping) is essential."
      ]
    },
    {
      id: "wifi",
      title: "Public Wi-Fi Networks",
      subtitle: "Network Hopping",
      icon: <Wifi className="h-5 w-5 text-cyan-500" />,
      safety: "High Risk",
      safetyColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      speed: "Varies",
      speedColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      desc: "Connecting to a local library or cafe's Wi-Fi network temporarily replaces your home external IP address.",
      pros: ["Instant and free IP location shift", "Requires zero configuration or app setups"],
      cons: ["High risk of network snooping by neighbors", "Network operator logs all DNS queries and activities"],
      border: "hover:border-cyan-500/30",
      anonymityScore: 3,
      setupEase: "Easy",
      longDesc: "Connecting to a public Wi-Fi network (at a local coffee shop, library, or airport) temporarily replaces your home network's external IP address with the public network's external IP address. This hides your physical location and breaks the tracking link to your home internet connection. However, public Wi-Fi is notoriously insecure; without a VPN, other users on the same network can intercept your unencrypted data, and the network operator can track all your browsing history.",
      howToUse: [
        "Turn on Wi-Fi on your device and look for public networks in cafes, libraries, or hotels.",
        "Select the network and complete any required login portal steps.",
        "Ensure that you only visit websites that use HTTPS (look for the lock icon in the address bar)."
      ],
      whenToUse: [
        "Bypassing location blocks temporarily when your primary connection is restricted.",
        "Quickly masking your home router's footprint for non-critical, casual browsing tasks."
      ],
      whenNotToUse: [
        "Logging into personal or professional email, online banking apps, or shopping portals.",
        "Entering or typing passwords, personal identification numbers, or credit card details."
      ]
    },
    {
      id: "hotspot",
      title: "Mobile Hotspot",
      subtitle: "Carrier Routing",
      icon: <Smartphone className="h-5 w-5 text-amber-500" />,
      safety: "Medium Security",
      safetyColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
      speed: "Fast Speed",
      speedColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      desc: "Switching off Wi-Fi routes your connection through your cellular carrier's rotating IP pools.",
      pros: ["Quick, clean IP rotation", "Separated from physical copper/fiber lines"],
      cons: ["Consumes cellular bandwidth limits", "Web traffic remains unencrypted against your mobile carrier"],
      border: "hover:border-amber-500/30",
      anonymityScore: 6,
      setupEase: "Very Easy",
      longDesc: "Turning off your device's Wi-Fi and switching to mobile data (or using your smartphone as a personal hotspot) routes your connection through your cellular carrier's towers. Cellular networks assign dynamic IP addresses from a large pool of rotating IPs shared among thousands of users. This breaks direct tracking chains linked to your home or office broadband connection and is generally much safer than using unsecured public Wi-Fi networks.",
      howToUse: [
        "On your smartphone, open settings and enable 'Personal Hotspot' or 'Tethering'. Set a strong password.",
        "On your computer or secondary device, select your phone's hotspot name from the list of available Wi-Fi networks.",
        "Enter the hotspot password to connect and begin browsing over your cellular plan."
      ],
      whenToUse: [
        "Working remotely in public spaces (like coffee shops) as a secure alternative to public Wi-Fi.",
        "Quickly rotating your IP address (toggling airplane mode on and off often forces your carrier to issue a new IP)."
      ],
      whenNotToUse: [
        "Data-intensive activities like streaming 4K video or downloading massive files if you have limited bandwidth caps.",
        "When absolute privacy from telecom providers is required, as cellular carriers log all traffic metadata."
      ]
    },
    {
      id: "router",
      title: "Restart Your Router",
      subtitle: "Dynamic IP Reset",
      icon: <RefreshCw className="h-5 w-5 text-teal-500" />,
      safety: "No Protection",
      safetyColor: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20",
      speed: "No Impact",
      speedColor: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20",
      desc: "Power-cycling your home router forces your ISP to release your old IP and assign a fresh one.",
      pros: ["100% Free and requires zero software", "Resets cookie-less IP trackers and site rate limits"],
      cons: ["Does not encrypt connection payload", "Cannot change your general geographic region"],
      border: "hover:border-teal-500/30",
      anonymityScore: 2,
      setupEase: "Easy (Hardware)",
      longDesc: "Most residential Internet Service Providers (ISPs) assign dynamic IP addresses to their customers. When your modem is powered off for a sufficient period, the DHCP lease expires and your previous IP address returns to the ISP's pool. When you turn the modem back on, the ISP assigns a new IP address. While this resets your IP, it does not encrypt your connection, prevent ISP logging, or change your general geographic location.",
      howToUse: [
        "Locate the power cord at the back of your home router or modem.",
        "Unplug the cord and leave the device completely powered off for at least 5 to 10 minutes to allow the IP lease to reset.",
        "Plug the cord back in. Wait for all status lights (Power, DSL/Cable, Wi-Fi) to turn solid green before reconnecting."
      ],
      whenToUse: [
        "Resetting website-level trackers or IP-based limits (e.g., download limits or vote counters).",
        "Fixing connectivity issues or refreshing a slow network connection."
      ],
      whenNotToUse: [
        "Protecting your active web traffic from interceptors or hackers.",
        "Hiding your online activity from your ISP, government agencies, or websites that use browser fingerprinting."
      ]
    }
  ];

  // Handle Checklist Toggles
  const toggleStep = (methodId: string, index: number) => {
    const key = `${methodId}-${index}`;
    setCheckedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Recommendations Quiz Logic
  const handleAnswerSelect = (key: "goal" | "budget" | "technical", value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    // Auto-advance or compute recommendation
    if (key === "goal") setQuizStep(1);
    if (key === "budget") setQuizStep(2);
    if (key === "technical") {
      setQuizStep(3);
      computeRecommendation(newAnswers);
    }
  };

  const computeRecommendation = (finalAnswers: typeof answers) => {
    const { goal, budget, technical } = finalAnswers;
    
    if (goal === "anonymous") {
      setQuizRecommendation({
        title: "Tor Browser",
        subtitle: "The Ultimate Anonymity Shield",
        description: "Since your main priority is ultimate privacy and bypassing strict censorship, Tor Browser is the perfect tool. It is 100% free and open-source, routing your connection through three encrypted nodes.",
        safety: 10,
        speed: 3,
        setup: "Easy (Browser Download)",
        id: "tor",
        icon: <Globe className="h-6 w-6 text-purple-500" />
      });
      return;
    }

    if (goal === "stream" || goal === "public_wifi") {
      if (budget === "paid" || technical === "easy") {
        setQuizRecommendation({
          title: "Premium VPN",
          subtitle: "Highly Recommended for Performance & Security",
          description: "A Virtual Private Network (VPN) fits your needs perfectly. It offers high speeds (perfect for streaming video) and system-wide military grade encryption to secure your passwords on public Wi-Fi. Just install the app and click connect.",
          safety: 9,
          speed: 9.5,
          setup: "Very Easy (One-click app)",
          id: "vpn",
          icon: <Shield className="h-6 w-6 text-cyan-500" />
        });
      } else {
        // Free/Medium
        setQuizRecommendation({
          title: "Mobile Hotspot / Free VPN Tier",
          subtitle: "Secure on a Budget",
          description: "Since you want protection without spending money, tethering your computer to your smartphone's Mobile Hotspot is a great option, or using a audited free VPN service (like Proton VPN Free). This shields your traffic from local snoops.",
          safety: 7.5,
          speed: 8,
          setup: "Easy (Tethering or App setup)",
          id: "hotspot",
          icon: <Smartphone className="h-6 w-6 text-amber-500" />
        });
      }
      return;
    }

    if (goal === "bypass_tracker") {
      setQuizRecommendation({
        title: "Restart Your Router",
        subtitle: "Hardware IP Rotation",
        description: "To bypass website rate counters or reset dynamic IP blocks without installing any software or signing up for accounts, power-cycling your home router for 5-10 minutes is the best solution.",
        safety: 2,
        speed: 10,
        setup: "Hardware Power Cycle",
        id: "router",
        icon: <RefreshCw className="h-6 w-6 text-teal-500" />
      });
      return;
    }

    if (goal === "bypass_simple") {
      setQuizRecommendation({
        title: "Proxy Servers",
        subtitle: "The Quick Web Bypass",
        description: "For a quick bypass of local filters (such as school or corporate firewalls) to access a simple webpage, a free web proxy requires zero setup and works instantly.",
        safety: 4,
        speed: 8.5,
        setup: "Very Easy (Paste URL)",
        id: "proxy",
        icon: <Server className="h-6 w-6 text-indigo-500" />
      });
      return;
    }

    // Default Fallback
    setQuizRecommendation({
      title: "Virtual Private Network (VPN)",
      subtitle: "The Gold Standard Shield",
      description: "For the majority of browsing needs, a VPN is the best balance. It keeps your connection encrypted and fully masks your IP address across all applications.",
      safety: 9,
      speed: 9.5,
      setup: "Very Easy",
      id: "vpn",
      icon: <Shield className="h-6 w-6 text-cyan-500" />
    });
  };

  const resetQuiz = () => {
    setAnswers({ goal: "", budget: "", technical: "" });
    setQuizStep(0);
    setQuizRecommendation(null);
  };

  // Jump to detail method
  const jumpToMethod = (id: string) => {
    const index = alternativeMethods.findIndex(m => m.id === id);
    if (index !== -1) {
      setActiveTab(index);
      const element = document.getElementById("methods-explorer");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // SVGs for visual route explanation in details
  const renderVisualSchema = (id: string) => {
    switch (id) {
      case "vpn":
        return (
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 350 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="30" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">CLIENT</text>
            
            <circle cx="320" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="320" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">WEBSITE</text>
            
            <rect x="145" y="25" width="60" height="40" rx="6" className="fill-cyan-500/10 stroke-cyan-500/40" strokeWidth="1.5"/>
            <text x="175" y="44" textAnchor="middle" className="fill-cyan-800 font-mono text-[8px] font-bold">VPN SERVER</text>
            <text x="175" y="53" textAnchor="middle" className="fill-slate-600 font-mono text-[6px]">IP changed</text>

            {/* Encrypted Tunnel Box */}
            <rect x="52" y="36" width="85" height="18" rx="4" className="fill-emerald-500/5 stroke-emerald-500/35" strokeWidth="1"/>
            <text x="94" y="47" textAnchor="middle" className="fill-emerald-700 font-mono text-[6px] font-bold">ENCRYPTED TUNNEL</text>
            
            <line x1="205" y1="45" x2="306" y2="45" className="stroke-slate-300" strokeWidth="1" strokeDasharray="3 3"/>
            
            {/* SNOOPER BLOCKED */}
            <circle cx="94" cy="78" r="8" className="fill-rose-500/10 stroke-rose-500/45" strokeWidth="1"/>
            <text x="94" y="80.5" textAnchor="middle" className="fill-rose-700 font-mono text-[5px] font-bold">ISP/SNOOP</text>
            <path d="M 94 70 L 94 54" className="stroke-rose-400/60" strokeWidth="0.8" strokeDasharray="1.5 1.5"/>
            <text x="110" y="68" className="fill-red-650 font-mono text-[5px] font-bold">BLOCKED</text>

            <motion.circle cx="48" cy="45" r="2.5" className="fill-emerald-500" animate={{ cx: [48, 145] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
            <motion.circle cx="205" cy="45" r="2.5" className="fill-cyan-500" animate={{ cx: [205, 306] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </svg>
        );
      case "proxy":
        return (
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 350 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="30" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">CLIENT</text>
            
            <circle cx="320" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="320" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">WEBSITE</text>
            
            <rect x="145" y="25" width="60" height="40" rx="6" className="fill-indigo-500/10 stroke-indigo-500/40" strokeWidth="1.5"/>
            <text x="175" y="44" textAnchor="middle" className="fill-indigo-800 font-mono text-[8px] font-bold">PROXY</text>
            <text x="175" y="53" textAnchor="middle" className="fill-slate-650 font-mono text-[6px]">No Encryption</text>

            <line x1="44" y1="45" x2="145" y2="45" className="stroke-amber-500" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="205" y1="45" x2="306" y2="45" className="stroke-slate-300" strokeWidth="1" strokeDasharray="3 3"/>

            {/* SNOOPER READS TRAFFIC */}
            <circle cx="94" cy="78" r="8" className="fill-rose-500/10 stroke-rose-500/45" strokeWidth="1"/>
            <text x="94" y="80.5" textAnchor="middle" className="fill-rose-700 font-mono text-[5px] font-bold">ISP/SNOOP</text>
            <path d="M 94 70 L 94 45" className="stroke-rose-500" strokeWidth="0.8"/>
            <text x="110" y="68" className="fill-amber-605 font-mono text-[5px] font-bold">READING PAYLOAD</text>

            <motion.circle cx="44" cy="45" r="2.5" className="fill-amber-500" animate={{ cx: [44, 145] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
            <motion.circle cx="205" cy="45" r="2.5" className="fill-indigo-500" animate={{ cx: [205, 306] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </svg>
        );
      case "tor":
        return (
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 350 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="45" r="10" className="fill-slate-50 stroke-slate-300" strokeWidth="1.2"/>
            <text x="20" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[6px] font-bold">CLIENT</text>
            
            <circle cx="330" cy="45" r="10" className="fill-slate-50 stroke-slate-300" strokeWidth="1.2"/>
            <text x="330" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[6px] font-bold">WEBSITE</text>
            
            {/* 3 Nodes */}
            <circle cx="85" cy="30" r="12" className="fill-purple-500/10 stroke-purple-500/40" strokeWidth="1.2"/>
            <text x="85" y="33" textAnchor="middle" className="fill-purple-800 font-mono text-[5px] font-bold">GUARD</text>

            <circle cx="175" cy="60" r="12" className="fill-purple-500/10 stroke-purple-500/40" strokeWidth="1.2"/>
            <text x="175" y="63" textAnchor="middle" className="fill-purple-800 font-mono text-[5px] font-bold">RELAY</text>

            <circle cx="265" cy="30" r="12" className="fill-purple-500/10 stroke-purple-500/40" strokeWidth="1.2"/>
            <text x="265" y="33" textAnchor="middle" className="fill-purple-800 font-mono text-[5px] font-bold">EXIT</text>

            <path d="M 30 45 Q 60 35 73 31" className="stroke-purple-500/60" strokeWidth="1" strokeDasharray="2 2"/>
            <path d="M 97 34 Q 135 50 163 56" className="stroke-purple-500/60" strokeWidth="1" strokeDasharray="2 2"/>
            <path d="M 187 56 Q 220 45 253 34" className="stroke-purple-500/60" strokeWidth="1" strokeDasharray="2 2"/>
            <path d="M 277 31 Q 310 40 320 45" className="stroke-slate-300" strokeWidth="1" strokeDasharray="3 3"/>

            <motion.circle cx="30" cy="45" r="2" className="fill-purple-500" animate={{ cx: [30, 73], cy: [45, 31] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
            <motion.circle cx="97" cy="34" r="2" className="fill-purple-500" animate={{ cx: [97, 163], cy: [34, 56] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
            <motion.circle cx="187" cy="56" r="2" className="fill-purple-500" animate={{ cx: [187, 253], cy: [56, 34] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
          </svg>
        );
      case "wifi":
        return (
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 350 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="30" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">CLIENT</text>
            
            <circle cx="320" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="320" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">WEBSITE</text>
            
            <rect x="145" y="25" width="60" height="40" rx="6" className="fill-cyan-500/10 stroke-cyan-500/40" strokeWidth="1.5"/>
            <text x="175" y="42" textAnchor="middle" className="fill-cyan-800 font-mono text-[8px] font-bold">(( PUBLIC ))</text>
            <text x="175" y="52" textAnchor="middle" className="fill-slate-600 font-mono text-[6px]">CAFE WI-FI</text>

            <line x1="44" y1="45" x2="145" y2="45" className="stroke-red-500 stroke-[1.5]" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="205" y1="45" x2="306" y2="45" className="stroke-slate-300" strokeWidth="1" strokeDasharray="3 3"/>

            {/* NEIGHBOR SNOOPER */}
            <circle cx="94" cy="78" r="8" className="fill-red-500/10 stroke-red-500/45" strokeWidth="1"/>
            <text x="94" y="80.5" textAnchor="middle" className="fill-red-700 font-mono text-[4px] font-bold">ROGUE USER</text>
            <path d="M 94 70 L 94 45" className="stroke-red-400" strokeWidth="0.8"/>
            <text x="110" y="68" className="fill-red-600 font-mono text-[5px] font-bold">MONITORING WIRELESS</text>

            <motion.circle cx="44" cy="45" r="2.5" className="fill-red-500" animate={{ cx: [44, 145] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
            <motion.circle cx="205" cy="45" r="2.5" className="fill-slate-450 animate-pulse" animate={{ cx: [205, 306] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </svg>
        );
      case "hotspot":
        return (
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 350 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="30" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">LAPTOP</text>
            
            <circle cx="320" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="320" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">WEBSITE</text>
            
            <rect x="145" y="25" width="60" height="40" rx="6" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="1.5"/>
            <text x="175" y="40" textAnchor="middle" className="fill-amber-800 font-mono text-[7px] font-bold">SMARTPHONE</text>
            <text x="175" y="50" textAnchor="middle" className="fill-slate-600 font-mono text-[6px]">CELLULAR DATA</text>

            <line x1="44" y1="45" x2="145" y2="45" className="stroke-emerald-500" strokeWidth="1" strokeDasharray="2 2"/>
            <line x1="205" y1="45" x2="306" y2="45" className="stroke-slate-300" strokeWidth="1" strokeDasharray="3 3"/>

            {/* ROTATING IP SYMBOL */}
            <path d="M 230 75 A 8 8 0 1 1 245 75" className="stroke-cyan-500" strokeWidth="1.2" strokeDasharray="2 1"/>
            <text x="260" y="77" className="fill-cyan-600 font-mono text-[5px] font-bold">ROTATING IPS</text>

            <motion.circle cx="44" cy="45" r="2.5" className="fill-emerald-500" animate={{ cx: [44, 145] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
            <motion.circle cx="205" cy="45" r="2.5" className="fill-amber-500" animate={{ cx: [205, 306] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </svg>
        );
      case "router":
        return (
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 350 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="30" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">CLIENT</text>
            
            <circle cx="320" cy="45" r="14" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5"/>
            <text x="320" y="48.5" textAnchor="middle" className="fill-slate-900 font-mono text-[8px] font-bold">WEBSITE</text>
            
            <rect x="145" y="25" width="60" height="40" rx="6" className="fill-teal-500/10 stroke-teal-500/40" strokeWidth="1.5"/>
            <text x="175" y="42" textAnchor="middle" className="fill-teal-800 font-mono text-[8px] font-bold">ROUTER</text>
            <text x="175" y="52" textAnchor="middle" className="fill-slate-600 font-mono text-[6px]">IP LEASE RESET</text>

            <line x1="44" y1="45" x2="145" y2="45" className="stroke-teal-500 animate-pulse" strokeWidth="1"/>
            <line x1="205" y1="45" x2="306" y2="45" className="stroke-slate-300" strokeWidth="1" strokeDasharray="3 3"/>

            {/* CYCLING ANIMATION ARROW */}
            <motion.path 
              d="M 175 10 A 8 8 0 1 1 180 15" 
              className="stroke-teal-500" 
              strokeWidth="1" 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              style={{ transformOrigin: "175px 10px" }}
            />

            <motion.circle cx="44" cy="45" r="2.5" className="fill-teal-500" animate={{ cx: [44, 145] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
            <motion.circle cx="205" cy="45" r="2.5" className="fill-teal-600 animate-pulse" animate={{ cx: [205, 306] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden font-sans">
      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#ffffff_95%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_95%)]"></div>

      {/* Cyberpunk Blur Nodes */}
      <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-16">
        
        {/* HEADER SECTION */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold font-mono tracking-wider uppercase"
          >
            <Shield className="h-3.5 w-3.5 animate-pulse" />
            Privacy Protection Center
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            How to <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">Hide Your IP Address</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Every device online leaks geographic location, ISP details, and tracking identifiers. Take control of your internet fingerprint with this interactive privacy guide.
          </motion.p>
        </section>

        {/* 1. INTERACTIVE PRIVACY SHIELD FINDER (WIZARD QUIZ) */}
        <section className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 backdrop-blur-md shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Perfect Shield Finder</h3>
                <p className="text-xs text-slate-500">Answer 3 simple questions to find the best IP hiding method for you.</p>
              </div>
            </div>
            
            {!quizActive && !quizRecommendation && (
              <button 
                onClick={() => setQuizActive(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono tracking-wider uppercase shadow-sm transition-all hover:scale-102 flex items-center gap-1 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                Start Finder Quiz
              </button>
            )}

            {(quizActive || quizRecommendation) && (
              <button 
                onClick={resetQuiz}
                className="px-3 py-1.5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold cursor-pointer"
              >
                Reset Finder
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!quizActive && !quizRecommendation && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-center space-y-2">
                    <span className="text-xl">🎯</span>
                    <h5 className="text-xs font-bold text-slate-955 dark:text-white">Goal-Oriented Recommendations</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">Filters solutions based on streaming vs. absolute military-grade confidentiality.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-center space-y-2">
                    <span className="text-xl">💳</span>
                    <h5 className="text-xs font-bold text-slate-955 dark:text-white">Cost Optimization</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">Compares premium features with instant, zero-cost hardware workarounds.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-center space-y-2">
                    <span className="text-xl">⚙️</span>
                    <h5 className="text-xs font-bold text-slate-955 dark:text-white">Skill Compatibility</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">Selects options based on whether you want an automated app or can tweak routers.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {quizActive && quizStep === 0 && (
              <motion.div 
                key="step0"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center text-xs font-mono text-cyan-600">
                  <span>QUESTION 1 OF 3</span>
                  <span>Goal Selection</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">What is your primary reason for hiding your IP?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { key: "stream", label: "Watch geo-blocked videos / stream global content" },
                    { key: "anonymous", label: "Ultimate privacy & political whistleblower security" },
                    { key: "public_wifi", label: "Security against hackers on public Wi-Fi networks" },
                    { key: "bypass_tracker", label: "Reset IP blocks / dynamic limits on websites" },
                    { key: "bypass_simple", label: "Quickly bypass standard school/office firewalls" }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswerSelect("goal", opt.key)}
                      className="p-3.5 text-left rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-400 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all hover:bg-cyan-500/[0.01] cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {quizActive && quizStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center text-xs font-mono text-cyan-600">
                  <span>QUESTION 2 OF 3</span>
                  <span>Budget Preferences</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">What is your budget limit?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { key: "free", label: "Absolutely $0 (Strictly Free Tools)" },
                    { key: "paid", label: "Willing to spend a few dollars for high-speed & logs audit" }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswerSelect("budget", opt.key)}
                      className="p-3.5 text-left rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-400 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all hover:bg-cyan-500/[0.01] cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setQuizStep(0)}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-650"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to goal
                </button>
              </motion.div>
            )}

            {quizActive && quizStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center text-xs font-mono text-cyan-600">
                  <span>QUESTION 3 OF 3</span>
                  <span>Setup Comfort</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">How comfortable are you with configurations?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { key: "easy", label: "I want an automated one-click or no-software solution" },
                    { key: "medium", label: "I don't mind editing browser extensions or resetting hardware" }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswerSelect("technical", opt.key)}
                      className="p-3.5 text-left rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-400 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all hover:bg-cyan-500/[0.01] cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setQuizStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-650"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to budget
                </button>
              </motion.div>
            )}

            {quizStep === 3 && quizRecommendation && (
              <motion.div 
                key="result"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 border border-cyan-500/30 bg-cyan-500/[0.03] dark:bg-cyan-950/20 rounded-xl space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center border border-cyan-500/20">
                    {quizRecommendation.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider block">RECOMMENDED CHOICE</span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{quizRecommendation.title}</h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans max-w-3xl">
                  {quizRecommendation.description}
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 dark:border-white/5 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-400 block">ANONYMITY GAUGE</span>
                    <span className="font-bold text-slate-955 dark:text-white">{quizRecommendation.safety}/10 Safety</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">SPEED SCORE</span>
                    <span className="font-bold text-slate-955 dark:text-white">{quizRecommendation.speed}/10 Speed</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">SETUP COMPLEXITY</span>
                    <span className="font-bold text-slate-955 dark:text-white">{quizRecommendation.setup}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => jumpToMethod(quizRecommendation.id)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Read Step-by-Step Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Take Quiz Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ANATOMY OF IP SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                What is an IP Address?
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              An <strong>IP (Internet Protocol)</strong> address acts as your digital mailing address. Whenever you visit a site, your device broadcasts its IP so the destination server knows where to send back files.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              However, because this IP is public, external servers use it as a persistent tracker. It identifies:
            </p>
            
            <ul className="space-y-3 font-mono text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                <span>Your physical location (down to neighborhood blocks).</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                <span>Your exact Internet Service Provider (ISP).</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                <span>Your general network nodes used to profile advertising logs.</span>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none backdrop-blur-md relative overflow-hidden">
            <div className="text-[10px] font-mono text-red-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-3 mb-4 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Connection Profile Without Masking
            </div>
            
            <div className="w-full h-44 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="55" width="70" height="50" rx="6" className="fill-slate-55 dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5"/>
                <text x="55" y="80" textAnchor="middle" className="fill-slate-900 dark:fill-white font-mono text-[9px] font-bold">YOUR DEVICE</text>
                <text x="55" y="93" textAnchor="middle" className="fill-red-500 font-mono text-[8px] font-semibold">IP exposed</text>

                <rect x="310" y="55" width="70" height="50" rx="6" className="fill-slate-55 dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5"/>
                <text x="345" y="80" textAnchor="middle" className="fill-slate-900 dark:fill-white font-mono text-[9px] font-bold">WEBSITE</text>
                <text x="345" y="93" textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">Public Server</text>

                <path d="M 90 80 L 310 80" className="stroke-red-500/60" strokeWidth="2" strokeDasharray="4 4"/>
                
                <circle cx="200" cy="130" r="24" className="fill-rose-50 dark:fill-rose-950/20 stroke-rose-300 dark:stroke-rose-900" strokeWidth="1.5"/>
                <text x="200" y="128" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 font-mono text-[8px] font-bold">ISP / SNOOP</text>
                <text x="200" y="139" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">Reading logs</text>

                <path d="M 200 80 L 200 106" className="stroke-rose-400 dark:stroke-rose-700" strokeWidth="1"/>
                
                <motion.circle 
                  cx="90" 
                  cy="80" 
                  r="4" 
                  className="fill-red-500"
                  animate={{ cx: [90, 310] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
              </svg>
            </div>
          </div>
        </section>

        {/* 2. THE DETAILED METHODS EXPLORER (SIDE-BY-SIDE / TABBED) */}
        <section id="methods-explorer" className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              IP Shielding Methods Explorer
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Select an option below to explore detailed setup guides, pros/cons, and network routing flowcharts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* Left selector sidebar (5 columns) */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-3 lg:pb-0 scrollbar-none shrink-0">
              {alternativeMethods.map((method, index) => {
                const isActive = activeTab === index;
                return (
                  <button
                    key={method.id}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left min-w-[200px] sm:min-w-[240px] lg:min-w-0 transition-all cursor-pointer select-none ${
                      isActive 
                        ? "border-cyan-500/40 bg-cyan-500/5 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 shadow-sm"
                        : "border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-white/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                      isActive 
                        ? "bg-cyan-500/10 border-cyan-500/20"
                        : "bg-slate-100 dark:bg-slate-955 border-slate-200 dark:border-white/5"
                    }`}>
                      {method.icon}
                    </div>
                    
                    <div className="truncate">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">{method.title}</h4>
                      <span className="text-[10px] text-slate-400 block font-mono tracking-wide">{method.subtitle}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right details content explorer (8 columns) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-slate-900/40 p-6 shadow-sm space-y-6 relative"
                >
                  {/* Title Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{alternativeMethods[activeTab].title}</h3>
                      <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{alternativeMethods[activeTab].subtitle}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 font-mono text-[9px]">
                      <span className={`px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${alternativeMethods[activeTab].safetyColor}`}>
                        {alternativeMethods[activeTab].safety}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${alternativeMethods[activeTab].speedColor}`}>
                        {alternativeMethods[activeTab].speed}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                    {alternativeMethods[activeTab].longDesc}
                  </p>

                  {/* Diagram Explainer */}
                  <div className="border border-slate-200 rounded-xl bg-white p-4">
                    <span className="text-[8px] font-mono text-cyan-600 block tracking-widest uppercase mb-3">CONNECTION FLOW SCHEMATIC</span>
                    <div className="h-24 w-full flex items-center justify-center overflow-x-auto">
                      {renderVisualSchema(alternativeMethods[activeTab].id)}
                    </div>
                  </div>

                  {/* Metrics & Pros/Cons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* The Good */}
                    <div className="space-y-2 p-4 border border-emerald-500/10 dark:border-emerald-500/5 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] rounded-xl">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold block uppercase tracking-wide">Advantages:</span>
                      <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-sans text-xs">
                        {alternativeMethods[activeTab].pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-mono font-bold shrink-0">+</span>
                            <span className="text-[11px] leading-relaxed">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* The Bad */}
                    <div className="space-y-2 p-4 border border-rose-500/10 dark:border-rose-500/5 bg-rose-500/[0.02] dark:bg-rose-500/[0.01] rounded-xl">
                      <span className="text-[10px] text-rose-500 font-mono font-bold block uppercase tracking-wide">Drawbacks:</span>
                      <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-sans text-xs">
                        {alternativeMethods[activeTab].cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-500 font-mono font-bold shrink-0">-</span>
                            <span className="text-[11px] leading-relaxed">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Interactive Checklist (Very User Friendly!) */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <ListTodo className="h-4 w-4" />
                      Step-by-Step Setup Checklist
                    </span>
                    <div className="space-y-2 font-sans text-xs text-slate-600 dark:text-slate-400">
                      {alternativeMethods[activeTab].howToUse.map((step, idx) => {
                        const isChecked = checkedSteps[`${alternativeMethods[activeTab].id}-${idx}`] || false;
                        return (
                          <div 
                            key={idx}
                            onClick={() => toggleStep(alternativeMethods[activeTab].id, idx)}
                            className={`flex gap-3 items-start border p-3 rounded-xl transition-all cursor-pointer ${
                              isChecked 
                                ? "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/30 text-slate-500 dark:text-slate-400"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <button
                              className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                                isChecked 
                                  ? "bg-cyan-500 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                                  : "border-slate-400 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-400 bg-transparent"
                              }`}
                            >
                              {isChecked && <Check className="h-3 w-3 stroke-[3px]" />}
                            </button>
                            <span className={`text-[11px] leading-relaxed font-sans select-none ${isChecked ? 'line-through decoration-slate-400/60 dark:decoration-slate-500/60' : ''}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Case Scenarios (Ideal/Avoid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-white/5 font-sans text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold block uppercase tracking-wide">
                        💡 Ideal For:
                      </span>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400 pl-1">
                        {alternativeMethods[activeTab].whenToUse.map((item, idx) => (
                          <li key={idx} className="marker:text-emerald-500 text-[11px] leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-500 font-mono font-bold block uppercase tracking-wide">
                        ⚠️ Avoid For:
                      </span>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400 pl-1">
                        {alternativeMethods[activeTab].whenNotToUse.map((item, idx) => (
                          <li key={idx} className="marker:text-amber-500 text-[11px] leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 3. PREMIUM CARD-BASED VPN COMPARISONS */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recommended VPN Providers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              If you want the simplest, fastest, and most secure protection, select a verified no-logs VPN provider.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vpnProviders.map((vpn, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredVpnCard(idx)}
                onMouseLeave={() => setHoveredVpnCard(null)}
                className={`border border-slate-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 relative flex flex-col justify-between overflow-hidden group shadow-sm ${vpn.borderGlow}`}
              >
                {/* Visual Top Branding Bar */}
                <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${vpn.color}`}></div>
                
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="font-bold text-slate-955 dark:text-white text-base leading-tight">{vpn.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono">{vpn.bestFor}</span>
                    </div>
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                      {vpn.badge}
                    </span>
                  </div>

                  {/* Summary Text */}
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed min-h-[48px]">
                    {vpn.whyWeLikeIt}
                  </p>

                  {/* Meter Ratings */}
                  <div className="space-y-2 border-t border-b border-slate-100 dark:border-white/5 py-3 font-mono text-[9px]">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">SPEED RATING</span>
                        <span className="font-bold text-slate-955 dark:text-white">{vpn.speed}/10</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5">
                        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${vpn.speed * 10}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">SECURITY AUDIT</span>
                        <span className="font-bold text-slate-955 dark:text-white">{vpn.security}/10</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${vpn.security * 10}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold font-mono text-cyan-600 dark:text-cyan-400 tracking-wider uppercase block">HIGHLIGHT FEATURES</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                      {vpn.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call To Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-white/5">
                  <a
                    href={vpn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-950 dark:text-white text-xs font-bold font-mono flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Visit Reference</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WRAP UP FOOTER */}
        <section className="text-center pt-8 border-t border-slate-200 dark:border-white/5 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready to Audit Your Connection?</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Switch on your proxy, Tor browser, or VPN and return to the main dashboard to verify if your location metadata and routing host coordinates update in real time.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold cursor-pointer transition-all shadow-sm"
          >
            <span>Return to Connection Scanner</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </section>

      </div>
    </div>
  );
}
