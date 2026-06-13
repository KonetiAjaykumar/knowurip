import { Globe, MapPin, Cpu, Compass, Hash, Clock, Server, Eye } from "lucide-react";

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
}

interface IPDashboardProps {
  data: IPData;
}

export default function IPDashboard({ data }: IPDashboardProps) {
  const dashboardItems = [
    {
      title: "Public IP Address",
      value: data.ip,
      icon: <Globe className="h-5 w-5 text-indigo-400" />,
      description: "Your public IPv4 address",
      highlight: true,
    },
    {
      title: "ISP / Organization",
      value: data.isp,
      icon: <Server className="h-5 w-5 text-purple-400" />,
      description: "Internet Service Provider name",
    },
    {
      title: "ASN (Autonomous System)",
      value: data.asn,
      icon: <Hash className="h-5 w-5 text-blue-400" />,
      description: "Routing system identifier",
    },
    {
      title: "Country",
      value: data.country,
      icon: data.countryFlagUrl ? (
        <img
          src={data.countryFlagUrl}
          alt={`${data.country} flag`}
          className="w-6 h-4 object-cover rounded-sm shadow-sm"
        />
      ) : (
        <Globe className="h-5 w-5 text-teal-400" />
      ),
      description: "Geographic country location",
    },
    {
      title: "Region / State",
      value: data.region,
      icon: <MapPin className="h-5 w-5 text-emerald-400" />,
      description: "State or province identifier",
    },
    {
      title: "City",
      value: data.city,
      icon: <Compass className="h-5 w-5 text-green-400" />,
      description: "Approximate city location",
    },
    {
      title: "Postal Code",
      value: data.postal,
      icon: <Compass className="h-5 w-5 text-orange-400" />,
      description: "ZIP or postal code area",
    },
    {
      title: "Timezone",
      value: data.timezone,
      icon: <Clock className="h-5 w-5 text-amber-400" />,
      description: "Local area timezone",
    },
    {
      title: "Coordinates (Lat / Long)",
      value: `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`,
      icon: <Compass className="h-5 w-5 text-rose-400" />,
      description: "Latitude & longitude points",
    },
    {
      title: "Host Name",
      value: data.hostname,
      icon: <Eye className="h-5 w-5 text-cyan-400" />,
      description: "Domain mapped to this IP",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dashboardItems.map((item, idx) => (
        <div
          key={idx}
          className={`glass-panel glass-panel-hover p-5 flex flex-col justify-between ${
            item.highlight 
              ? "border-indigo-500/20 bg-indigo-500/5 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)] sm:col-span-2 lg:col-span-1" 
              : ""
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {item.title}
              </span>
              <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/5">
                {item.icon}
              </div>
            </div>
            <p className={`font-mono text-lg break-all select-all font-semibold ${
              item.highlight ? "text-indigo-300 text-xl" : "text-white"
            }`}>
              {item.value || "N/A"}
            </p>
          </div>
          <span className="text-xs text-gray-500 mt-2 font-normal">
            {item.description}
          </span>
        </div>
      ))}
    </div>
  );
}
