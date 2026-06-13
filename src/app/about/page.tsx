import { BookOpen, Network, ShieldCheck, Compass, HelpCircle } from "lucide-react";

export default function AboutPage() {
  const infoCards = [
    {
      title: "What is an IP Address?",
      desc: "An Internet Protocol (IP) address is a unique numerical identifier assigned to every device connected to a computer network. It serves two main functions: hosting or network interface identification, and location addressing.",
      icon: <Network className="h-5 w-5 text-indigo-400" />,
    },
    {
      title: "IPv4 vs. IPv6",
      desc: "IPv4 uses a 32-bit address scheme allowing ~4.3 billion unique addresses (e.g. 192.168.1.1). Due to address exhaustion, IPv6 was created, using a 128-bit address space allowing 340 undecillion addresses (e.g. 2001:db8::ff00:42:8329) written in hexadecimal.",
      icon: <HelpCircle className="h-5 w-5 text-purple-400" />,
    },
    {
      title: "How Geolocation Works",
      desc: "IP Geolocation translates an IP address into physical coordinates. Because IPs are registered to ISPs and allocated in large blocks to specific regions, databases compile this mapping. Note that it provides an approximate city-level area, not a pinpoint house address.",
      icon: <Compass className="h-5 w-5 text-teal-400" />,
    },
    {
      title: "ASNs & ISP Routing",
      desc: "An Autonomous System Number (ASN) identifies a massive network (or collection of networks) controlled by a single administrative entity (like an ISP or tech company). ASNs participate in BGP routing to direct global internet traffic between systems.",
      icon: <BookOpen className="h-5 w-5 text-amber-400" />,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          About <span className="text-gradient-primary">IP Intelligence</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Learn how IP addressing, geolocation databases, and network routing govern your online footprint.
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {infoCards.map((card, idx) => (
          <div key={idx} className="glass-panel p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-md">
                {card.icon}
              </div>
              <h3 className="font-bold text-white text-lg">{card.title}</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pt-2">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Trust Badge / Details */}
      <div className="glass-panel p-6 border-indigo-500/10 bg-indigo-500/5 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 glow-ring-indigo">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-white text-base">Privacy & Verification First</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
            KnowUrIP queries verified registry data from IPinfo in real-time. We never store your queries, IP logs, or system indicators. Geolocation lookups happen entirely on the server-side, protecting your details from frontend leaks.
          </p>
        </div>
      </div>
    </div>
  );
}
