"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCachedAddress } from "@/lib/geocode";

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
      zoomSnap: 0.5,
      wheelPxPerZoomLevel: 60,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 22,
      subdomains: ["a", "b", "c", "d"],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    map.setView([alertLat, alertLng], 14);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update alert marker, path, and responder marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const oldAlertMarker = (map as any)._alertMarker;
    if (oldAlertMarker) map.removeLayer(oldAlertMarker);
    const oldPathLine = (map as any)._pathLine;
    if (oldPathLine) map.removeLayer(oldPathLine);
    const oldWaypoints = (map as any)._waypoints;
    if (oldWaypoints) {
      oldWaypoints.forEach((m: L.CircleMarker) => map.removeLayer(m));
    }
    const oldResponderMarker = (map as any)._responderMarker;
    if (oldResponderMarker) map.removeLayer(oldResponderMarker);

    // Alert pulsing marker
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

    const alertGeocodedKey = `${alertLat.toFixed(5)},${alertLng.toFixed(5)}`;
    if (!(map as any)._alertGeocodedKeys) (map as any)._alertGeocodedKeys = new Set();

    const alertMarker = L.marker([alertLat, alertLng], { icon: alertIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600">Emergency Alert</div><div style="font-size:11px;color:#666">Loading address…</div>`,
      );
    (map as any)._alertMarker = alertMarker;

    alertMarker.on("popupopen", async () => {
      if ((map as any)._alertGeocodedKeys.has(alertGeocodedKey)) return;
      (map as any)._alertGeocodedKeys.add(alertGeocodedKey);
      const addr = await getCachedAddress(alertLat, alertLng);
      if (!addr) return;
      const lines = [addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(", ");
      alertMarker.setPopupContent(
        `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600">Emergency Alert</div><div style="font-size:11px;color:#333">${lines || addr.display_name}</div>`,
      );
    });

    // GPS trail path
    const waypointMarkers: L.CircleMarker[] = [];
    if (path.length > 0) {
      const coords = path.map((p) => [p.lat, p.lng] as [number, number]);

      coords.forEach((c) => {
        const dot = L.circleMarker(c, {
          radius: 4,
          fillColor: "#e10600",
          color: "#fff",
          weight: 1,
          opacity: 0.6,
          fillOpacity: 0.8,
        }).addTo(map);
        waypointMarkers.push(dot);
      });
      (map as any)._waypoints = waypointMarkers;

      const pathLine = L.polyline(coords, {
        color: "#e10600",
        weight: 3,
        opacity: 0.7,
      }).addTo(map);
      (map as any)._pathLine = pathLine;
    }

    // Only fit bounds once per alert (stable key = lat,lng rounded to 3 decimals)
    const fitKey = `${alertLat.toFixed(3)},${alertLng.toFixed(3)}`;
    const shouldFit = fittedBoundsRef.current !== fitKey;

    if (responderLat !== undefined && responderLng !== undefined) {
      const responderIcon = L.divIcon({
        className: "",
        html: `
          <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;background:#0b203c;color:white;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:3px solid white;font-size:18px;font-weight:700">U</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const responderMarker = L.marker([responderLat, responderLng], {
        icon: responderIcon,
      })
        .addTo(map)
        .bindPopup("Your Unit");
      (map as any)._responderMarker = responderMarker;

      if (shouldFit) {
        const bounds = L.latLngBounds([
          L.latLng(alertLat, alertLng),
          L.latLng(responderLat, responderLng),
        ]);
        if (path.length > 0) {
          path.forEach((p) => bounds.extend([p.lat, p.lng]));
        }
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18 });
        fittedBoundsRef.current = fitKey;
      }
    } else {
      if (shouldFit) {
        const bounds = L.latLngBounds([L.latLng(alertLat, alertLng)]);
        if (path.length > 0) {
          path.forEach((p) => bounds.extend([p.lat, p.lng]));
        }
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18 });
        }
        fittedBoundsRef.current = fitKey;
      }
    }
  }, [alertLat, alertLng, responderLat, responderLng, path]);

  return <div ref={mapRef} className="h-full w-full" />;
}
