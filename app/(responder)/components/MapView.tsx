"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  alertLat?: number;
  alertLng?: number;
  responderLat?: number;
  responderLng?: number;
}

export default function MapView({
  alertLat = 40.7128,
  alertLng = -74.006,
  responderLat = 40.7168,
  responderLng = -74.002,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const alertIcon = L.divIcon({
      className: "",
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px">
          <div style="position:absolute;width:100%;height:100%;border-radius:9999px;background:#e10600;opacity:0.6;animation:mp 1.5s cubic-bezier(0,0,0.2,1) infinite"></div>
          <div style="position:relative;width:16px;height:16px;border-radius:9999px;background:#e10600;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
        </div>
        <style>@keyframes mp{75%,100%{transform:scale(2.5);opacity:0}}</style>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const responderIcon = L.divIcon({
      className: "",
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;background:#0b203c;color:white;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:3px solid white;font-size:18px;font-weight:700">U</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([alertLat, alertLng], { icon: alertIcon })
      .addTo(map)
      .bindPopup("Emergency Alert");

    L.marker([responderLat, responderLng], { icon: responderIcon })
      .addTo(map)
      .bindPopup("Your Unit");

    L.polyline(
      [
        [responderLat, responderLng],
        [(responderLat + alertLat) / 2, (responderLng + alertLng) / 2],
        [alertLat, alertLng],
      ],
      { color: "#0b203c", weight: 2.5, opacity: 0.6, dashArray: "8, 6" },
    ).addTo(map);

    map.fitBounds(L.latLngBounds([alertLat, alertLng], [responderLat, responderLng]), {
      padding: [60, 60],
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [alertLat, alertLng, responderLat, responderLng]);

  return <div ref={mapRef} className="h-full w-full" />;
}
