"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCachedAddress } from "@/lib/geocode";

interface Incident {
  alert_id: string;
  lat: number;
  lng: number;
  label: string;
  color: string;
}

interface AdminMapProps {
  incidents?: Incident[];
}

export default function AdminMap({ incidents = [] }: AdminMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const fetchingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 22,
      subdomains: ["a", "b", "c", "d"],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    map.setView([8.134521, 4.246732], 6);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (incidents.length === 0) return;

    const bounds = L.latLngBounds([]);

    incidents.forEach((inc) => {
      const marker = L.circleMarker([inc.lat, inc.lng], {
        radius: 12,
        fillColor: inc.color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      const key = `${inc.lat.toFixed(5)},${inc.lng.toFixed(5)}`;

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600">${inc.label}</div><div style="font-size:11px;color:#666">Loading address…</div><div style="font-family:monospace;font-size:10px;color:#999;margin-top:4px">${inc.alert_id.slice(0, 8)}</div>`,
      );

      marker.on("popupopen", async () => {
        if (fetchingRef.current.has(key)) return;
        fetchingRef.current.add(key);

        const addr = await getCachedAddress(inc.lat, inc.lng);
        fetchingRef.current.delete(key);

        if (!addr) return;
        const lines = [addr.street, addr.city, addr.state, addr.country]
          .filter(Boolean)
          .join(", ");
        marker.setPopupContent(
          `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600">${inc.label}</div><div style="font-size:11px;color:#333">${lines || addr.display_name}</div><div style="font-family:monospace;font-size:10px;color:#999;margin-top:4px">${inc.alert_id.slice(0, 8)}</div>`,
        );
      });

      markersRef.current.push(marker);
      bounds.extend([inc.lat, inc.lng]);
    });

    if (incidents.length === 1) {
      map.setView([incidents[0].lat, incidents[0].lng], 14);
    } else {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [incidents]);

  return <div ref={mapRef} className="h-full w-full" />;
}
