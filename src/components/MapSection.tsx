import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface MapSectionProps {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
}

export default function MapSection({ latitude, longitude, city, region, country }: MapSectionProps) {
  // Construct a bounding box around the coordinates for OpenStreetMap embed
  const delta = 0.015; 
  const minLon = longitude - delta;
  const minLat = latitude - delta;
  const maxLon = longitude + delta;
  const maxLat = latitude + delta;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <MapPin className="h-5 w-5" />
            <h3 className="font-bold text-white text-lg">Geolocation Map</h3>
          </div>
          <p className="text-xs text-gray-400">
            Approximate physical location for {city}, {region}, {country}
          </p>
        </div>
        
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-semibold text-indigo-300 hover:text-indigo-200 hover:bg-white/10 transition-all"
        >
          <span>Open Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-white/5 shadow-inner">
        {/* Loader background */}
        <div className="absolute inset-0 bg-[#06041c] flex items-center justify-center -z-10">
          <div className="flex flex-col items-center gap-2">
            <Navigation className="h-6 w-6 text-indigo-500 animate-bounce" />
            <span className="text-xs text-gray-500 font-mono">Loading Map View...</span>
          </div>
        </div>

        <iframe
          title="Geolocation Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          className="relative opacity-90 hover:opacity-100 transition-opacity duration-300 filter invert-[0.9] hue-rotate-[195deg] saturate-[0.8] contrast-[1.2]"
        ></iframe>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono px-1">
        <span>LAT: {latitude.toFixed(6)}</span>
        <span>LON: {longitude.toFixed(6)}</span>
        <span>OSM Tile Server</span>
      </div>
    </div>
  );
}
