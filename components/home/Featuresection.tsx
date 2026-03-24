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
    <section className="py-24 bg-warm-bg" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Sticky sidebar */}
          <div className="lg:sticky lg:top-32">
            <h2 className="text-secondary text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Full Protection
            </h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6 font-display">
              Engineered for unconditional safety.
            </h3>
            <p className="text-slate-700 leading-relaxed mb-8">
              Every feature of SafeBand has been crafted to remove barriers to
              connection when it matters most.
            </p>
            <button className="bg-primary text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
              View Technical Details <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature cards grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-10 rounded-[2.5rem] bg-white border border-primary/5 hover:border-secondary/20 transition-all soft-shadow"
              >
                <Icon className="w-8 h-8 text-secondary mb-6" />
                <h4 className="text-xl font-bold text-slate-900 mb-3 font-display">
                  {title}
                </h4>
                <p className="text-slate-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}