import { PhoneMissed, WifiOff, TimerOff } from "lucide-react";

const problems = [
  {
    icon: PhoneMissed,
    title: "Phone Call Panic",
    description:
      "In distress, finding a contact and explaining your location clearly is nearly impossible. Silence should be an option.",
  },
  {
    icon: WifiOff,
    title: "Weak Connections",
    description:
      "Safety shouldn't depend on 5G. Our lightweight technology works even where standard apps fail.",
  },
  {
    icon: TimerOff,
    title: "The Seconds Gap",
    description:
      "The time it takes to unlock a phone and open an app can be too long. We've removed every unnecessary step.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-secondary text-sm font-bold uppercase tracking-[0.2em] mb-4">
            The Worry
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-display">
            When distance feels like a barrier.
          </h3>
          <p className="text-xl text-slate-600 leading-relaxed">
            We all worry about our children, elderly parents, or partners when
            we aren't together. Traditional tools can be slow or confusing
            during a moment of panic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-warm-bg p-10 rounded-[2rem] border border-primary/5 hover:border-secondary/20 transition-colors duration-200"
            >
              <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-secondary mb-8">
                <Icon className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4 font-display">
                {title}
              </h4>
              <p className="text-slate-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}