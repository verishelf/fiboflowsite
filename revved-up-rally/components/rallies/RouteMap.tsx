"use client";

import type { Rally } from "@/types/database";

interface RouteMapProps {
  waypoints?: { lat: number; lng: number; label: string }[];
  rally?: Rally;
  className?: string;
}

export function RouteMap({ waypoints: waypointsProp, rally, className }: RouteMapProps) {
  const waypoints = waypointsProp ?? rally?.route_waypoints ?? [];
  const provider = process.env.NEXT_PUBLIC_MAP_PROVIDER;
  const token = process.env.NEXT_PUBLIC_MAP_TOKEN;

  if (provider === "mapbox" && token) {
    const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
    const src = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/path-2+f5f5f0(${encodeURIComponent(coords)})/auto/800x400?access_token=${token}`;
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Rally route map" className="w-full border border-white/10" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[2/1] items-center justify-center border border-white/10 bg-charcoal ${className ?? ""}`}
    >
      <div className="absolute inset-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 800 400">
          <path
            d="M 80 200 Q 200 80, 400 200 T 720 200"
            fill="none"
            stroke="#f5f5f0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
      <div className="relative z-10 flex w-full justify-between px-12">
        {waypoints.map((wp, i) => (
          <div key={i} className="text-center">
            <div className="mx-auto h-2 w-2 rounded-full bg-off-white" />
            <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-white/60">
              {wp.label}
            </p>
          </div>
        ))}
      </div>
      <p className="absolute bottom-4 text-[10px] uppercase tracking-[0.2em] text-white/30">
        Configure NEXT_PUBLIC_MAP_TOKEN for live map
      </p>
    </div>
  );
}
