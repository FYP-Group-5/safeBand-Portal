export default function CtaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <h2 className="text-white text-4xl md:text-5xl font-bold mb-8 relative z-10 font-display">
            Protect what matters most.
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed">
            Join the thousands of families using SafeBand to stay connected and
            safe. Because peace of mind shouldn't be complicated.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
            <button className="bg-white text-primary text-lg font-bold px-12 py-5 rounded-full shadow-2xl hover:scale-105 transition-all">
              Start Your Free Protection
            </button>
            <button className="bg-primary border border-white/30 text-white text-lg font-bold px-12 py-5 rounded-full hover:bg-white/10 transition-all">
              Watch the Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}