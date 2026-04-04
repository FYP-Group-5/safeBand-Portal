import {
  ArrowUpRight,
  Hand,
  Map,
  SignalLow,
  LayoutDashboard,
  Shield,
  Laptop,
} from "lucide-react";

const features = [
  {
    icon: Hand,
    title: "One-tap Guardian",
    description:
      "No logins, no menus. Just a single, accessible button that works everywhere.",
  },
  {
    icon: Map,
    title: "Live Family Tracking",
    description:
      "Let your loved ones watch over your journey in real-time until you're safe.",
  },
  {
    icon: SignalLow,
    title: "Offline Guardian",
    description:
      "Our protocol sends small data bursts that pierce through weak cellular signals.",
  },
  {
    icon: LayoutDashboard,
    title: "Guardian Dashboard",
    description:
      "Detailed info for responders: battery level, walking speed, and exact heading.",
  },
  {
    icon: Shield,
    title: "Privacy Respect",
    description:
      "We never sell data. Your location is shared only when you activate an alert.",
  },
  {
    icon: Laptop,
    title: "Everyone's Invited",
    description:
      "Works on iPhone, Android, and Desktop. If it has a browser, it's a safety tool.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#f8faf9] py-24" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-3">
          {/* Sticky sidebar */}
          <div className="lg:sticky lg:top-32">
            <h2 className="text-secondary mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              Full Protection
            </h2>
            <h3 className="font-display mb-6 text-4xl font-bold text-slate-900">
              Engineered for unconditional safety.
            </h3>
            <p className="mb-8 leading-relaxed text-slate-700">
              Every feature of SafeBand has been crafted to remove barriers to
              connection when it matters most.
            </p>
            <button className="bg-primary hover:bg-primary/90 shadow-primary/10 flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white shadow-lg transition-all">
              View Technical Details <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-2">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="border-primary/5 hover:border-secondary/20 soft-shadow rounded-[2.5rem] border bg-white p-10 transition-all"
              >
                <Icon className="text-secondary mb-6 h-8 w-8" />
                <h4 className="font-display mb-3 text-xl font-bold text-slate-900">
                  {title}
                </h4>
                <p className="leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
