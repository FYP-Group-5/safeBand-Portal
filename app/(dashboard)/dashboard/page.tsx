import { Timer, Users } from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import LocationCard from "../components/LocationCard";
import PanicButton from "../components/PanicButton";
import QuickActionCard from "../components/QuickActionCard";
import StatusCard from "../components/StatusCard";
import BottomNavigation from "../components/BottomNavigation";

export default function DashboardPage() {
  const mapImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBc31eBKDAx5B69vAN0XbRqQvTP5X2mnHrHO_Jgyf-b1tL7-VDdXsHQ2j3WPunb3ZhyFg_0rERyT4p2yjofTVre5ShWiEBf21vXl_oYO3ceWFHrjOw9afT7ax4MXt6eMCG0mnYcHA16rGsq3ff1TgxDlyN5FHZ8Az-mbfJtqngdNP4dmoNwbzyo9Crs_9MdTisjHDxeZyP8WcXliAtm6IXJJcWEF_TUTlt2h8FT3h6fDNf_VdW2Ec2kM2Ac_OnUVZ5x8Q43lRWauQ";

  return (
    <section className="text-primary-dark bg-background-light flex min-h-screen flex-col overflow-x-hidden font-sans">
      <DashboardHeader />

      {/* Main Content Container - Fixed overflow */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-y-auto px-4 pt-6 pb-24">
        <LocationCard
          address="123 Main St, New York, NY"
          mapImageUrl={mapImageUrl}
        />

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

      <BottomNavigation initialActive="dash" showOnDesktop={true} />
    </section>
  );
}
