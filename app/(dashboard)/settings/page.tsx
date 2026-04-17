import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  MapPin,
  Lock,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile Information",
          description: "Update your name and contact details",
        },
        {
          icon: Lock,
          label: "Password & Security",
          description: "Change password and manage security settings",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Configure alert and notification preferences",
        },
        {
          icon: MapPin,
          label: "Location Settings",
          description: "Manage GPS accuracy and location sharing",
        },
        {
          icon: Moon,
          label: "Appearance",
          description: "Theme and display options",
        },
        {
          icon: Globe,
          label: "Language & Region",
          description: "App language and regional settings",
        },
      ],
    },
    {
      title: "Safety",
      items: [
        {
          icon: Shield,
          label: "Emergency Settings",
          description: "Configure panic button and emergency protocols",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help or contact support",
        },
      ],
    },
  ];

  return (
    <section className="bg-background-light relative flex min-h-screen w-full flex-col pb-20 md:pb-0">
      {/* Top Navigation Bar */}
      <header className="border-primary-dark/10 flex items-center justify-between border-b bg-white px-6 py-4 md:px-10 lg:px-40">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <button className="text-primary-dark hover:bg-primary-dark/5 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-primary-dark text-xl font-bold tracking-tight">
            Settings
          </h1>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-40">
        <div className="flex w-full max-w-240 flex-col gap-8">
          {/* Profile Card */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="bg-primary-dark flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white">
              JD
            </div>
            <div className="flex-1">
              <h2 className="text-primary-dark text-lg font-bold">Jane Doe</h2>
              <p className="text-sm text-slate-500">jane.doe@example.com</p>
              <p className="text-xs text-slate-400">Member since Jan 2024</p>
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h3 className="text-primary-dark px-2 text-sm font-bold tracking-wide uppercase">
                {section.title}
              </h3>
              <div className="flex flex-col gap-2">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-primary-dark text-base font-bold">
                        {item.label}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <button className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 px-6 py-4 font-bold text-rose-600 transition-colors hover:bg-rose-100">
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>

          {/* App Version */}
          <div className="text-center text-xs text-slate-400">
            SafeBand v1.0.0
          </div>
        </div>
      </main>
    </section>
  );
}
