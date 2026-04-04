export default function CtaSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="bg-primary relative overflow-hidden rounded-[3rem] p-12 text-center md:p-24">
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <h2 className="font-display relative z-10 mb-8 text-4xl font-bold text-white md:text-5xl">
            Protect what matters most.
          </h2>
          <p className="relative z-10 mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Join the thousands of families using SafeBand to stay connected and
            safe. Because peace of mind shouldn't be complicated.
          </p>

          <div className="relative z-10 flex flex-col justify-center gap-6 md:flex-row">
            <button className="text-primary rounded-full bg-white px-12 py-5 text-lg font-bold shadow-2xl transition-all hover:scale-105">
              Start Your Free Protection
            </button>
            <button className="bg-primary rounded-full border border-white/30 px-12 py-5 text-lg font-bold text-white transition-all hover:bg-white/10">
              Watch the Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
