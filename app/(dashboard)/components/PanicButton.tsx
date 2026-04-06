import { Home, Hand } from "lucide-react";

export default function PanicButton() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="group relative cursor-pointer">
        {/* Inner Red Button */}
        <button className="bg-emergency relative z-10 flex h-64 w-64 flex-col items-center justify-center rounded-full text-white shadow-2xl shadow-[0_0_0_10px_rgba(225,6,0,0.1),0_0_0_20px_rgba(225,6,0,0.05)] transition-transform active:scale-95">
          <Home className="mb-2 h-16 w-16 font-light" />
          <span className="text-2xl font-black tracking-tighter">
            TAP TO ALERT
          </span>
          <div className="mt-4 h-1 w-24 overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-1/3 bg-white"></div>
          </div>
        </button>
        {/* Pulse Animation Effect */}
        <div className="bg-emergency absolute inset-0 animate-ping rounded-full opacity-20"></div>
      </div>
      <p className="mt-8 flex items-center gap-2 text-sm font-medium tracking-wide text-gray-500">
        <Hand className="h-4 w-4" />
        HOLD FOR 3 SECONDS TO SILENT ALERT
      </p>
    </div>
  );
}
