"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCachedAddress } from "@/lib/geocode";
import {
  Layers,
  MapPin,
  Plus,
  Minus,
  Locate,
  Globe,
  Navigation2,
} from "lucide-react";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewProps {
  alertLat?: number;
  alertLng?: number;
  responderLat?: number;
  responderLng?: number;
  path?: LatLng[];
}

type LayerMode = "osm" | "esri_street" | "satellite" | "hybrid";

export default function MapView({
  alertLat = 8.134521,
  alertLng = 4.246732,
  responderLat,
  responderLng,
  path = [],
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const fittedBoundsRef = useRef<string>("");
  const [mapMode, setMapMode] = useState<LayerMode>("osm");

  // Track map layers securely in React refs
  const layersRef = useRef<{
    baseTile: L.TileLayer | null;
    overlayTile: L.TileLayer | null;
    alertMarker: L.Marker | null;
    accuracyCircle: L.Circle | null;
    responderMarker: L.Marker | null;
    pathLine: L.Polyline | null;
    waypoints: L.CircleMarker[];
  }>({
    baseTile: null,
    overlayTile: null,
    alertMarker: null,
    accuracyCircle: null,
    responderMarker: null,
    pathLine: null,
    waypoints: [],
  });

  const geocodedKeysRef = useRef<Set<string>>(new Set());

  // Initialize Map
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
      zoomControl: false, // Custom styled zoom controls used
      attributionControl: false,
      zoomSnap: 0.25,
      wheelPxPerZoomLevel: 60,
    });

    // High Detail OpenStreetMap default
    const defaultTile = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 20,
        subdomains: ["a", "b", "c"],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );

    defaultTile.addTo(map);
    layersRef.current.baseTile = defaultTile;

    map.setView([alertLat, alertLng], 17);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Mode Switcher (OSM HD vs Esri Street vs Satellite vs Hybrid)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up base and overlay tiles
    if (layersRef.current.baseTile) map.removeLayer(layersRef.current.baseTile);
    if (layersRef.current.overlayTile) map.removeLayer(layersRef.current.overlayTile);
    layersRef.current.overlayTile = null;

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
      // Hybrid: Satellite + Transportation Overlay
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
    layersRef.current.baseTile = base;

    if (overlay) {
      overlay.addTo(map);
      layersRef.current.overlayTile = overlay;
    }
  }, [mapMode]);

  // Update Markers, Path, Accuracy Radius & Distance
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (layersRef.current.alertMarker) map.removeLayer(layersRef.current.alertMarker);
    if (layersRef.current.accuracyCircle) map.removeLayer(layersRef.current.accuracyCircle);
    if (layersRef.current.responderMarker) map.removeLayer(layersRef.current.responderMarker);
    if (layersRef.current.pathLine) map.removeLayer(layersRef.current.pathLine);
    layersRef.current.waypoints.forEach((w) => map.removeLayer(w));
    layersRef.current.waypoints = [];

    // 1. Accuracy Circle Radius around Emergency
    const accuracyCircle = L.circle([alertLat, alertLng], {
      radius: 30,
      color: "#e10600",
      fillColor: "#e10600",
      fillOpacity: 0.18,
      weight: 2,
      dashArray: "6, 6",
    }).addTo(map);
    layersRef.current.accuracyCircle = accuracyCircle;

    // 2. High-Impact Alert Pulsing Custom Marker
    const alertIcon = L.divIcon({
      className: "",
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px">
          <div style="position:absolute;width:100%;height:100%;border-radius:9999px;background:#e10600;opacity:0.65;animation:mp 1.4s cubic-bezier(0,0,0.2,1) infinite"></div>
          <div style="position:relative;width:22px;height:22px;border-radius:9999px;background:#e10600;border:3.5px solid #ffffff;box-shadow:0 4px 16px rgba(225,6,0,0.6)"></div>
        </div>
        <style>@keyframes mp{75%,100%{transform:scale(2.6);opacity:0}}</style>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const alertGeocodedKey = `${alertLat.toFixed(5)},${alertLng.toFixed(5)}`;
    const alertMarker = L.marker([alertLat, alertLng], { icon: alertIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:Inter,sans-serif;padding:4px;min-width:180px">
          <div style="font-size:13px;font-weight:800;color:#e10600;display:flex;align-items:center;gap:4px">🚨 Emergency Incident</div>
          <div style="font-size:11px;color:#555;margin-top:4px">Locating address details…</div>
          <div style="font-family:monospace;font-size:10px;color:#888;margin-top:4px;background:#f3f4f6;padding:2px 6px;border-radius:4px;display:inline-block">${alertLat.toFixed(5)}, ${alertLng.toFixed(5)}</div>
        </div>`,
      );
    layersRef.current.alertMarker = alertMarker;

    alertMarker.on("popupopen", async () => {
      if (geocodedKeysRef.current.has(alertGeocodedKey)) return;
      geocodedKeysRef.current.add(alertGeocodedKey);
      const addr = await getCachedAddress(alertLat, alertLng);
      if (!addr) return;
      const lines = [addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(", ");
      alertMarker.setPopupContent(
        `<div style="font-family:Inter,sans-serif;padding:4px;min-width:180px">
          <div style="font-size:13px;font-weight:800;color:#e10600;display:flex;align-items:center;gap:4px">🚨 Emergency Incident</div>
          <div style="font-size:12px;font-weight:700;color:#111;margin-top:4px;line-height:1.3">${lines || addr.display_name}</div>
          <div style="font-family:monospace;font-size:10px;color:#666;margin-top:6px;background:#f3f4f6;padding:2px 6px;border-radius:4px;display:inline-block">GPS: ${alertLat.toFixed(5)}, ${alertLng.toFixed(5)}</div>
        </div>`,
      );
    });

    // 3. GPS Trail Polyline Path
    if (path.length > 0) {
      const coords = path.map((p) => [p.lat, p.lng] as [number, number]);

      coords.forEach((c) => {
        const dot = L.circleMarker(c, {
          radius: 4.5,
          fillColor: "#e10600",
          color: "#ffffff",
          weight: 1.5,
          opacity: 0.8,
          fillOpacity: 0.95,
        }).addTo(map);
        layersRef.current.waypoints.push(dot);
      });

      const pathLine = L.polyline(coords, {
        color: "#e10600",
        weight: 4,
        opacity: 0.9,
        dashArray: "6, 6",
      }).addTo(map);
      layersRef.current.pathLine = pathLine;
    }

    // 4. Responder Unit Marker & Distance Calculation
    let distanceText = "";
    if (responderLat !== undefined && responderLng !== undefined) {
      const victimLatLng = L.latLng(alertLat, alertLng);
      const responderLatLng = L.latLng(responderLat, responderLng);
      const distMeters = responderLatLng.distanceTo(victimLatLng);
      distanceText =
        distMeters > 1000
          ? `${(distMeters / 1000).toFixed(2)} km away`
          : `${Math.round(distMeters)} m away`;

      const responderIcon = L.divIcon({
        className: "",
        html: `
          <div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:#0b203c;color:white;box-shadow:0 6px 16px rgba(11,32,60,0.6);border:3px solid #ffffff;font-size:17px;font-weight:900">
            U
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const responderMarker = L.marker([responderLat, responderLng], {
        icon: responderIcon,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;padding:4px">
            <div style="font-size:13px;font-weight:800;color:#0b203c">🚔 Response Unit</div>
            <div style="font-size:11px;color:#555;margin-top:2px">Distance to victim: <strong style="color:#0b203c">${distanceText}</strong></div>
          </div>`,
        );
      layersRef.current.responderMarker = responderMarker;
    }

    // 5. Fit Bounds
    const fitKey = `${alertLat.toFixed(3)},${alertLng.toFixed(3)}`;
    const shouldFit = fittedBoundsRef.current !== fitKey;

    if (shouldFit) {
      const bounds = L.latLngBounds([L.latLng(alertLat, alertLng)]);
      if (responderLat !== undefined && responderLng !== undefined) {
        bounds.extend([responderLat, responderLng]);
      }
      if (path.length > 0) {
        path.forEach((p) => bounds.extend([p.lat, p.lng]));
      }
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18 });
      }
      fittedBoundsRef.current = fitKey;
    }
  }, [alertLat, alertLng, responderLat, responderLng, path]);

  // Map Controls Action Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.setView([alertLat, alertLng], 17.5, {
      animate: true,
    });
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {/* Floating HD Map Control Toolbar */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
        {/* Layer Switcher Pill */}
        <div className="flex items-center gap-1 rounded-xl bg-white/95 p-1.5 shadow-xl backdrop-blur-md border border-gray-200 text-xs font-bold text-gray-700">
          <button
            type="button"
            onClick={() => setMapMode("osm")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
              mapMode === "osm"
                ? "bg-[#0b203c] text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title="OpenStreetMap HD (Full House & Street Details)"
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
            title="Esri Navigation (High-Contrast Topo & Roads)"
          >
            <Navigation2 className="h-3.5 w-3.5" />
            Nav Map
          </button>
          <button
            type="button"
            onClick={() => setMapMode("satellite")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
              mapMode === "satellite"
                ? "bg-[#0b203c] text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Satellite Photo View"
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
            title="Satellite + Street Labels Overlay"
          >
            <Globe className="h-3.5 w-3.5" />
            Hybrid
          </button>
        </div>

        {/* Zoom & Recenter Control Stack */}
        <div className="flex flex-col overflow-hidden rounded-xl bg-white/95 shadow-xl backdrop-blur-md border border-gray-200">
          <button
            type="button"
            onClick={handleRecenter}
            className="flex items-center justify-center p-2 text-gray-700 transition-colors hover:bg-gray-100 border-b border-gray-100"
            title="Recenter on Incident"
          >
            <Locate className="h-4 w-4 text-red-600" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex items-center justify-center p-2 text-gray-700 transition-colors hover:bg-gray-100 border-b border-gray-100"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex items-center justify-center p-2 text-gray-700 transition-colors hover:bg-gray-100"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
