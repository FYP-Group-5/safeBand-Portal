"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const incidents = [
  { lat: 40.7128, lng: -74.006, label: "Critical", color: "#e10600" },
  { lat: 40.716, lng: -74.01, label: "Warning", color: "#f59e0b" },
  { lat: 40.71, lng: -74.002, label: "Info", color: "#3b82f6" },
  { lat: 40.7145, lng: -74.004, label: "Resolved", color: "#22c55e" },
];

export default function AdminMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    incidents.forEach((inc) => {
      const color = inc.color;
      L.circleMarker([inc.lat, inc.lng], {
        radius: 10,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600">${inc.label}</div>`,
        );
    });

    map.setView([40.713, -74.006], 14);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full" />;
}
