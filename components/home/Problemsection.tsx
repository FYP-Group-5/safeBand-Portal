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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-secondary mb-4 text-sm font-bold tracking-[0.2em] uppercase">
            The Worry
          </h2>
          <h3 className="font-display mb-8 text-4xl font-bold text-slate-900 md:text-5xl">
            When distance feels like a barrier.
          </h3>
          <p className="text-xl leading-relaxed text-slate-600">
            We all worry about our children, elderly parents, or partners when
            we aren&apos;t together. Traditional tools can be slow or confusing
            during a moment of panic.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-warm-bg border-primary/5 hover:border-secondary/20 rounded-4xl border p-10 transition-colors duration-200"
            >
              <div className="bg-secondary/10 text-secondary mb-8 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Icon className="h-8 w-8" />
              </div>
              <h4 className="font-display mb-4 text-2xl font-bold text-slate-900">
                {title}
              </h4>
              <p className="leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
