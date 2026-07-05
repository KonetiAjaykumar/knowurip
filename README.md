# KnowUrIP - Discover Your Digital Identity

KnowUrIP is a premium, modern, responsive IP intelligence and geolocation dashboard. It automatically analyzes your connection on load to display detailed geographical data, routing blocks, browser analytics, and dynamic threat auditing.

## 🚀 Features

- **Auto-Detection**: Resolves your public IP address (IPv4/IPv6) instantly upon page load.
- **Interactive SVG Geolocation Map**: Projects your exact latitude and longitude onto an animated, dark-cyber radar ping world map.
- **Connection Diagnostics**: Resolves city, region, postal code, timezone, ISP, and Autonomous System Number (ASN).
- **Security & Privacy Audits**: Includes a server-side heuristics scan to detect VPN tunnels, proxy relays, Tor exit nodes, or cloud hosting datacenters.
- **Client Metadata**: Extracts client browser metrics, operating system, display resolution, system language, and client local time.
- **Exports & Sharing**: Export your full routing diagnostic report as a JSON file or copy a shareable connection summary to your clipboard.
- **Dark Glassmorphic UI**: Beautiful gradients, responsive layouts, hover states, and smooth framer-motion micro-animations.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Integration**: [IPinfo API](https://ipinfo.io/) (backend proxy integration)

---

## 💻 Getting Started

### Prerequisites

You need **Node.js** installed on your system. 

### Installation

1. Clone or download this repository.
2. Initialize environment variables:
   Create a `.env.local` file in the root directory and add your IPinfo token:
   ```env
   IPINFO_TOKEN=your_ipinfo_token_here
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Build the optimized production bundle:
   ```bash
   npm run build
   ```
   ```bash
   npm run start
   ```

---

## 🔒 Privacy Policy

KnowUrIP is built with a zero-logs commitment. All IP lookups are resolved in-memory during page load to communicate with IPinfo. We do not store database records, search histories, or client logs.
