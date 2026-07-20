import { ShieldCheck } from "lucide-react";

export default function StatusCard() {
  return (
    <div className="border-primary-dark/20 bg-primary-dark/5 flex items-center justify-between rounded-xl border border-dashed p-4">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-primary-dark h-6 w-6" />
        <span className="text-sm font-medium">Device connection secure</span>
      </div>
      <span className="text-primary-dark/60 text-[10px] font-bold uppercase">
        100% Bat
      </span>
    </div>
  );
}
