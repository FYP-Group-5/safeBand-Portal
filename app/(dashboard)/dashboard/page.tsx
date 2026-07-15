import { Timer, Users } from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import LocationCard from "../components/LocationCard";
import PanicButton from "../components/PanicButton";
import QuickActionCard from "../components/QuickActionCard";
import StatusCard from "../components/StatusCard";

export default function DashboardPage() {
  return (
    <section className="text-primary-dark bg-background-light flex min-h-screen flex-col overflow-x-hidden font-sans">
      <DashboardHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-y-auto px-4 pt-6 pb-24">
        <LocationCard />

        <PanicButton />

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard
            icon={Timer}
            title="Safety Timer"
            description="Start countdown"
            iconBgColor="bg-amber-100"
            iconTextColor="text-amber-600"
          />

          <QuickActionCard
            icon={Users}
            title="Contacts"
            description="4 Active monitors"
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />
        </div>

        <StatusCard />
      </main>
    </section>
  );
}
