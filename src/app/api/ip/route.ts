import { NextRequest, NextResponse } from "next/server";

// Structure of IPinfo response
interface IPinfoResponse {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  privacy?: {
    vpn?: boolean;
    proxy?: boolean;
    tor?: boolean;
    hosting?: boolean;
    service?: string;
  };
}

// Function to clean and parse IP from headers
function getClientIp(req: NextRequest): string {
  // Common headers for IP detection
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    // Find first non-private/non-local IP if possible
    for (const ip of ips) {
      if (ip && !isPrivateIp(ip)) {
        return ip;
      }
    }
    // Return first IP if all are private
    if (ips[0]) return ips[0];
  }

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp && !isPrivateIp(xRealIp)) return xRealIp;

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp;

  // Fallback to NextRequest ip (if populated by hosting platform)
  const reqIp = (req as any).ip;
  if (reqIp && !isPrivateIp(reqIp)) return reqIp;

  // Localhost defaults
  return "::1";
}

// Basic check for private/local IP addresses
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

// Heuristic to detect hosting / VPN based on ISP name (fallback if token doesn't support Privacy API)
function detectPrivacyHeuristics(org: string = "", hostname: string = "") {
  const text = (org + " " + hostname).toLowerCase();
  
  const hostingKeywords = [
    "amazon", "aws", "google cloud", "google llc", "microsoft", "azure", 
    "digitalocean", "linode", "hetzner", "ovh", "datacenter", "hosting", 
    "cloudflare", "server", "web services", "vultr", "leaseweb", "fastly",
    "akamai", "contabo", "liquid web", "scaleway", "oracle cloud"
  ];
  
  const vpnKeywords = [
    "vpn", "nordvpn", "expressvpn", "surfshark", "protonvpn", "mullvad", 
    "pia", "private internet access", "windscribe", "cyberghost", "tunnelbear",
    "hide.me", "vyprvpn", "hotspot shield", "ipvanish", "ivacy"
  ];

  const torKeywords = [
    "tor exit", "tor relay", "onion router", "tor-exit", "tor-relay"
  ];

  const isHosting = hostingKeywords.some(keyword => text.includes(keyword));
  const isVpn = vpnKeywords.some(keyword => text.includes(keyword));
  const isTor = torKeywords.some(keyword => text.includes(keyword));
  const isProxy = false; // Hard to detect via text, default false

  let riskLevel = "Low";
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
    riskLevel,
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = process.env.IPINFO_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "IPinfo API token is not configured on the server." },
        { status: 500 }
      );
    }

    // Get search IP from query parameter or auto-detect
    const { searchParams } = new URL(req.url);
    let targetIp = searchParams.get("ip") || "";

    // If no IP is specified, detect client IP
    if (!targetIp) {
      targetIp = getClientIp(req);
    }

    // If target IP is private/local and we did not specify a custom search IP, 
    // call IPinfo without an IP. That queries the public IP of the server origin (e.g. developer's public IP).
    const isLocal = isPrivateIp(targetIp);
    const url = isLocal && !searchParams.get("ip")
      ? `https://ipinfo.io/json?token=${token}`
      : `https://ipinfo.io/${targetIp}/json?token=${token}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache response for 1 hour
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `IPinfo API error: ${response.statusText} (${errText})` },
        { status: response.status }
      );
    }

    const data: IPinfoResponse = await response.json();

    // Parse location coordinates
    let latitude = 0;
    let longitude = 0;
    if (data.loc) {
      const [latStr, lonStr] = data.loc.split(",");
      latitude = parseFloat(latStr || "0");
      longitude = parseFloat(lonStr || "0");
    }

    // Parse org to extract ASN and ISP
    let asn = "N/A";
    let isp = "Unknown ISP";
    if (data.org) {
      const orgParts = data.org.split(" ");
      if (orgParts[0]?.startsWith("AS")) {
        asn = orgParts[0];
        isp = orgParts.slice(1).join(" ");
      } else {
        isp = data.org;
      }
    }

    // Resolve security / privacy details (prefer IPinfo privacy object if available, else use heuristics)
    let security = {
      vpn: false,
      proxy: false,
      tor: false,
      hosting: false,
      riskLevel: "Low",
    };

    if (data.privacy) {
      security.vpn = !!data.privacy.vpn;
      security.proxy = !!data.privacy.proxy;
      security.tor = !!data.privacy.tor;
      security.hosting = !!data.privacy.hosting;
      
      if (security.tor || security.vpn) {
        security.riskLevel = "High";
      } else if (security.proxy || security.hosting) {
        security.riskLevel = "Medium";
      }
    } else {
      // Fallback to our custom heuristic detection based on ISP and Hostname
      const heuristics = detectPrivacyHeuristics(data.org, data.hostname);
      security = heuristics;
    }

    // Map the standardized output
    const result = {
      ip: data.ip,
      hostname: data.hostname || "N/A",
      city: data.city || "Unknown City",
      region: data.region || "Unknown Region",
      country: data.country || "Unknown Country",
      postal: data.postal || "N/A",
      timezone: data.timezone || "UTC",
      latitude,
      longitude,
      asn,
      isp,
      countryFlagUrl: data.country 
        ? `https://flagcdn.com/w80/${data.country.toLowerCase()}.png` 
        : "",
      security,
      isLocalHost: isLocal,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in IP detection route:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
