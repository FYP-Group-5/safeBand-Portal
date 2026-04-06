import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor: string;
  iconTextColor: string;
}

export default function QuickActionCard({
  icon: Icon,
  title,
  description,
  iconBgColor,
  iconTextColor,
}: QuickActionCardProps) {
  return (
    <button className="hover:border-primary-dark/20 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-colors">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgColor} ${iconTextColor}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-primary-dark leading-none font-bold">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
    </button>
  );
}
