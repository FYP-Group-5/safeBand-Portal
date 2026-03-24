import { TouchpadOff, LocateFixed, Share2, Headphones, Smile } from "lucide-react";

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
    <section className="py-24 bg-white overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h2 className="text-secondary text-sm font-bold uppercase tracking-[0.2em] mb-4">
          Connected &amp; Protected
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold text-slate-900 font-display">
          How SafeBand keeps you close
        </h3>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Connector line — desktop only */}
        <div className="hidden lg:block absolute top-10 left-0 w-full px-32 z-0">
          <div className="connection-line" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
          {steps.map(({ icon: Icon, badge, title, description }) => (
            <div key={title} className="flex flex-col items-center group">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-accent-blue flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform soft-shadow">
                <Icon className="w-7 h-7" />
              </div>
              <div className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                {badge}
              </div>
              <h4 className="font-bold text-slate-900 mb-2 font-display">
                {title}
              </h4>
              <p className="text-sm text-slate-600 text-center px-4">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}