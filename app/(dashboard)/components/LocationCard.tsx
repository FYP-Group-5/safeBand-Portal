import { MapPin } from "lucide-react";

interface LocationCardProps {
  address: string;
  mapImageUrl: string;
}

export default function LocationCard({
  address,
  mapImageUrl,
}: LocationCardProps) {
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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-medium text-blue-600">
              GPS ACTIVE • HIGH ACCURACY
            </span>
          </div>
        </div>
        <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
          <img
            className="h-full w-full object-cover"
            alt="Satellite view of current user location"
            src={mapImageUrl}
          />
        </div>
      </div>
    </div>
  );
}
