import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

// Structure matches frontend expectation
interface IPDataResponse {
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

// Check for local loopback / private IPs
function isPrivateIp(ip: string): boolean {
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
    return true;
  }
  // IPv4 Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  if (
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    (ip.startsWith("172.") && isWithin172PrivateRange(ip))
  ) {
    return true;
  }
  // IPv6 Link-Local and Loopback
  if (ip.startsWith("fe80:") || ip.startsWith("::ffff:127.0.0.1")) {
    return true;
  }
  return false;
}

function isWithin172PrivateRange(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length < 2) return false;
  const secondOctet = parseInt(parts[1], 10);
  return secondOctet >= 16 && secondOctet <= 31;
}

// Client IP resolver helper
function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    for (const ip of ips) {
      if (ip && !isPrivateIp(ip)) return ip;
    }
    if (ips[0]) return ips[0];
  }

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp && !isPrivateIp(xRealIp)) return xRealIp;

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp && !isPrivateIp(cfConnectingIp)) return cfConnectingIp;

  const reqIp = (req as any).ip;
  if (reqIp && !isPrivateIp(reqIp)) return reqIp;

  return "::1";
}

// Heuristics threat detector based on ISP/Org/Hostname text
function detectThreatHeuristics(org: string = "", hostname: string = "") {
  const text = `${org} ${hostname}`.toLowerCase();
  
  const hostingKeywords = [
    "amazon", "aws", "google cloud", "google llc", "microsoft", "azure", 
    "digitalocean", "linode", "hetzner", "ovh", "datacenter", "hosting", 
    "cloudflare", "server", "web services", "vultr", "leaseweb", "fastly",
    "akamai", "contabo", "liquid web", "scaleway", "oracle cloud", "m247",
    "cogent", "ovh SAS", "servers", "host", "hostgator", "bluehost", "godaddy",
    "dreamhost", "namecheap", "siteground", "a2hosting", "softlayer"
  ];
  
  const vpnKeywords = [
    "vpn", "nordvpn", "expressvpn", "surfshark", "protonvpn", "mullvad", 
    "pia", "private internet access", "windscribe", "cyberghost", "tunnelbear",
    "hide.me", "vyprvpn", "hotspot shield", "ipvanish", "ivacy", "fastly vpn",
    "torguard", "strongvpn", "tunnel", "purevpn", "hideguard", "zenmate",
    "m247", "datacamp", "clouvider", "packethub", "misaka", "quadranet", "sharkouter"
  ];
  
  const torKeywords = [
    "tor exit", "tor relay", "onion router", "tor-exit", "tor-relay", "exit node", "tor exit node"
  ];
  
  const isHosting = hostingKeywords.some(kw => text.includes(kw));
  const isVpn = vpnKeywords.some(kw => text.includes(kw)) || isHosting;
  const isTor = torKeywords.some(kw => text.includes(kw));
  const isProxy = isVpn; // Proxy matches VPN/Hosting for basic heuristic

  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (isTor || isVpn) {
    riskLevel = "High";
  } else if (isProxy || isHosting) {
    riskLevel = "Medium";
  }

  return {
    vpn: isVpn,
    proxy: isProxy,
    tor: isTor,
    hosting: isHosting,
    riskLevel
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = process.env.IPINFO_TOKEN || "";
    const { searchParams } = new URL(req.url);
    let target = searchParams.get("ip") || "";
    let isLocal = false;

    // Resolve domain names (e.g. google.com) to IPv4
    if (target) {
      const isIp = /^[0-9a-f.:]+$/i.test(target);
      if (!isIp) {
        try {
          const addresses = await dns.promises.resolve4(target);
          if (addresses && addresses.length > 0) {
            target = addresses[0];
          } else {
            return NextResponse.json(
              { error: `Could not resolve IPv4 address for domain: ${target}` },
              { status: 400 }
            );
          }
        } catch (dnsErr: any) {
          console.error(`DNS lookup failed for ${target}:`, dnsErr);
          return NextResponse.json(
            { error: `DNS resolution failed for domain '${target}'. Please verify it is a valid domain.` },
            { status: 400 }
          );
        }
      }
    }

    // Auto-detect visitor IP if not searching
    if (!target) {
      const clientIp = getClientIp(req);
      if (isPrivateIp(clientIp)) {
        isLocal = true;
        // If local, querying with empty string queries the public IP of the server/dev source
        target = "";
      } else {
        target = clientIp;
      }
    } else {
      if (isPrivateIp(target)) {
        isLocal = true;
      }
    }

    // Build IPinfo query URL
    const apiUrl = target && !isLocal
      ? `https://ipinfo.io/${encodeURIComponent(target)}?token=${token}`
      : `https://ipinfo.io?token=${token}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 900 } // Cache results for 15 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `IPinfo API Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Process IPinfo payload
    const ip = data.ip || target || "127.0.0.1";
    const hostname = data.hostname || "No Hostname Mapped (Reverse DNS Failed)";
    const city = data.city || (isLocal ? "Local Loopback" : "Unknown City");
    const region = data.region || (isLocal ? "Local Host" : "Unknown Region");
    const countryCode = data.country || "US";
    
    // Resolve full Country Name using built-in Intl API
    let country = countryCode;
    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      country = regionNames.of(countryCode) || countryCode;
    } catch (e) {
      console.error("Intl.DisplayNames lookup failed:", e);
    }

    const postal = data.postal || "N/A";
    const timezone = data.timezone || "UTC";

    // Split coords safely
    let latitude = 0;
    let longitude = 0;
    if (data.loc) {
      const parts = data.loc.split(",");
      latitude = parseFloat(parts[0]) || 0;
      longitude = parseFloat(parts[1]) || 0;
    }

    // Parse Org/ISP
    // Format is usually: "AS15169 Google LLC"
    let asn = "N/A";
    let isp = data.org || "Private IP Address";
    let organization = data.org || "Loopback Address";

    if (data.org && data.org.includes(" ")) {
      const spaceIndex = data.org.indexOf(" ");
      const potentialAsn = data.org.substring(0, spaceIndex);
      if (potentialAsn.startsWith("AS")) {
        asn = potentialAsn;
        isp = data.org.substring(spaceIndex + 1);
        organization = isp;
      }
    }

    // Security indicator heuristics
    const security = detectThreatHeuristics(data.org || "", hostname);

    const countryFlagUrl = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;

    const payload: IPDataResponse = {
      ip,
      hostname,
      city,
      region,
      country,
      countryCode,
      countryFlagUrl,
      postal,
      timezone,
      latitude,
      longitude,
      asn,
      isp,
      organization,
      security,
      isLocalHost: isLocal
    };

    return NextResponse.json(payload);

  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
