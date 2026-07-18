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
      const latitude = Number(pos.coords.latitude);
      const longitude = Number(pos.coords.longitude);
      const addr = await getCachedAddress(latitude, longitude);
      if (addr) {
        const lines = [addr.street, addr.city, addr.state, addr.country]
          .filter(Boolean)
          .join(", ");
        setAddress(lines || addr.display_name);
      } else {
        setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
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
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc31eBKDAx5B69vAN0XbRqQvTP5X2mnHrHO_Jgyf-b1tL7-VDdXsHQ2j3WPunb3ZhyFg_0rERyT4p2yjofTVre5ShWiEBf21vXl_oYO3ceWFHrjOw9afT7ax4MXt6eMCG0mnYcHA16rGsq3ff1TgxDlyN5FHZ8Az-mbfJtqngdNP4dmoNwbzyo9Crs_9MdTisjHDxeZyP8WcXliAtm6IXJJcWEF_TUTlt2h8FT3h6fDNf_VdW2Ec2kM2Ac_OnUVZ5x8Q43lRWauQ"
          alt="Map"
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
      </div>
    </div>
  );
}
