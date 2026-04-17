import {
  TouchpadOff,
  LocateFixed,
  Share2,
  Headphones,
  Smile,
} from "lucide-react";

const steps = [
  {
    icon: TouchpadOff,
    badge: "The Tap",
    title: "Activate",
    description: "One touch is all it takes to start the safety protocol.",
  },
  {
    icon: LocateFixed,
    badge: "Precision",
    title: "Locate",
    description: "High-precision GPS pinpoints exactly where you are.",
  },
  {
    icon: Share2,
    badge: "Circle",
    title: "Connect",
    description: "Your private safety circle is notified in milliseconds.",
  },
  {
    icon: Headphones,
    badge: "Action",
    title: "Respond",
    description: "Responders get turn-by-turn directions to reach you.",
  },
  {
    icon: Smile,
    badge: "End",
    title: "Safety",
    description: "Constant live tracking until you are safely home.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="overflow-hidden bg-white py-24" id="how-it-works">
      <div className="mx-auto mb-20 max-w-7xl px-6 text-center">
        <h2 className="text-secondary mb-4 text-sm font-bold tracking-[0.2em] uppercase">
          Connected &amp; Protected
        </h2>
        <h3 className="font-display text-4xl font-bold text-slate-900 md:text-5xl">
          How SafeBand keeps you close
        </h3>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Connector line — desktop only */}
        <div className="absolute top-10 left-0 z-0 hidden w-full px-32 lg:block">
          <div className="connection-line" />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ icon: Icon, badge, title, description }) => (
            <div key={title} className="group flex flex-col items-center">
              <div className="border-secondary text-secondary soft-shadow mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 bg-white transition-transform group-hover:scale-110">
                <Icon className="h-7 w-7" />
              </div>
              <div className="bg-secondary mb-4 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                {badge}
              </div>
              <h4 className="font-display mb-2 font-bold text-slate-900">
                {title}
              </h4>
              <p className="px-4 text-center text-sm text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
