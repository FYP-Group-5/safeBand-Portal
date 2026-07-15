"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { getCachedAddress } from "@/lib/geocode";

export default function LocationCard() {
  const [address, setAddress] = useState<string>("Acquiring location…");
  const [gpsActive, setGpsActive] = useState(false);

  useEffect(() => {
    const nav = (typeof navigator !== "undefined" ? navigator : null) as any;
    if (!nav?.geolocation) {
      setAddress("Geolocation unavailable");
      return;
    }

    const onPosition = async (pos: any) => {
      setGpsActive(true);
      const addr = await getCachedAddress(
        pos.coords.latitude,
        pos.coords.longitude,
      );
      if (addr) {
        const lines = [addr.street, addr.city, addr.state, addr.country]
          .filter(Boolean)
          .join(", ");
        setAddress(lines || addr.display_name);
      } else {
        setAddress(
          `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        );
      }
    };

    const onError = () => {
      setAddress("Location access denied");
    };

    nav.geolocation.getCurrentPosition(onPosition, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  }, []);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-primary-dark/10 text-primary-dark rounded-xl p-2">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Current Location
          </p>
          <p className="text-primary-dark text-sm font-bold">{address}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  gpsActive ? "bg-blue-400" : "bg-gray-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  gpsActive ? "bg-blue-500" : "bg-gray-500"
                }`}
              ></span>
            </span>
            <span className="text-[10px] font-medium text-blue-600">
              {gpsActive ? "GPS ACTIVE • HIGH ACCURACY" : "ACQUIRING GPS…"}
            </span>
          </div>
        </div>
        <div className="bg-primary-dark/5 flex h-16 w-16 items-center justify-center rounded-lg text-xs text-gray-400">
          Map
        </div>
      </div>
    </div>
  );
}
