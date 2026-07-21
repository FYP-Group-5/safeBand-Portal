"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCachedAddress } from "@/lib/geocode";
import { Layers, MapPin, Plus, Minus, Globe, Navigation2 } from "lucide-react";

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

type LayerMode = "osm" | "esri_street" | "satellite" | "hybrid";

export default function AdminMap({ incidents = [] }: AdminMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const baseTileRef = useRef<L.TileLayer | null>(null);
  const overlayTileRef = useRef<L.TileLayer | null>(null);
  const fetchingRef = useRef<Set<string>>(new Set());
  const [mapMode, setMapMode] = useState<LayerMode>("osm");

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    });

    const streetTiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 20,
        subdomains: ["a", "b", "c"],
      },
    );

    streetTiles.addTo(map);
    baseTileRef.current = streetTiles;

    map.setView([8.134521, 4.246732], 7);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, []);

  // Handle Layer Switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileRef.current) map.removeLayer(baseTileRef.current);
    if (overlayTileRef.current) map.removeLayer(overlayTileRef.current);
    overlayTileRef.current = null;

    let base: L.TileLayer;
    let overlay: L.TileLayer | null = null;

    if (mapMode === "osm") {
      base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
        subdomains: ["a", "b", "c"],
      });
    } else if (mapMode === "esri_street") {
      base = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 },
      );
    } else if (mapMode === "satellite") {
      base = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 },
      );
    } else {
      base = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 },
      );
      overlay = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 },
      );
    }

    base.addTo(map);
    baseTileRef.current = base;

    if (overlay) {
      overlay.addTo(map);
      overlayTileRef.current = overlay;
    }
  }, [mapMode]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (incidents.length === 0) return;

    const bounds = L.latLngBounds([]);

    incidents.forEach((inc) => {
      const pulseIcon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px">
            <div style="position:absolute;width:100%;height:100%;border-radius:9999px;background:${inc.color};opacity:0.55;animation:adminPulse 1.8s infinite"></div>
            <div style="position:relative;width:18px;height:18px;border-radius:9999px;background:${inc.color};border:2.5px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.5)"></div>
          </div>
          <style>@keyframes adminPulse{75%,100%{transform:scale(2.4);opacity:0}}</style>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([inc.lat, inc.lng], { icon: pulseIcon }).addTo(map);
      const key = `${inc.lat.toFixed(5)},${inc.lng.toFixed(5)}`;

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;padding:3px">
          <div style="font-size:13px;font-weight:800;color:${inc.color}">${inc.label}</div>
          <div style="font-size:11px;color:#666;margin-top:2px">Loading address…</div>
          <div style="font-family:monospace;font-size:10px;color:#999;margin-top:4px">ID: ${inc.alert_id.slice(0, 8)}</div>
        </div>`,
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
          `<div style="font-family:Inter,sans-serif;padding:3px">
            <div style="font-size:13px;font-weight:800;color:${inc.color}">${inc.label}</div>
            <div style="font-size:12px;font-weight:700;color:#111;margin-top:2px">${lines || addr.display_name}</div>
            <div style="font-family:monospace;font-size:10px;color:#888;margin-top:4px">ID: ${inc.alert_id.slice(0, 8)}</div>
          </div>`,
        );
      });

      markersRef.current.push(marker);
      bounds.extend([inc.lat, inc.lng]);
    });

    if (incidents.length === 1) {
      map.setView([incidents[0].lat, incidents[0].lng], 16);
    } else {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [incidents]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {/* Map Control Toolbar */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 rounded-xl bg-white/95 p-1.5 shadow-xl backdrop-blur-md border border-gray-200 text-xs font-bold text-gray-700">
          <button
            type="button"
            onClick={() => setMapMode("osm")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
              mapMode === "osm"
                ? "bg-[#0b203c] text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Streets HD
          </button>
          <button
            type="button"
            onClick={() => setMapMode("esri_street")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
              mapMode === "esri_street"
                ? "bg-[#0b203c] text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <Navigation2 className="h-3.5 w-3.5" />
            Nav
          </button>
          <button
            type="button"
            onClick={() => setMapMode("satellite")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
              mapMode === "satellite"
                ? "bg-[#0b203c] text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapMode("hybrid")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
              mapMode === "hybrid"
                ? "bg-[#0b203c] text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Hybrid
          </button>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl bg-white/95 shadow-xl backdrop-blur-md border border-gray-200">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="flex items-center justify-center p-2 text-gray-700 transition-colors hover:bg-gray-100 border-b border-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="flex items-center justify-center p-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
