import { Zap, Users, Lock, CheckCircle } from "lucide-react";

const benefits = [
  { icon: Zap, text: "Instant deployment, no app store needed." },
  { icon: Users, text: "Coordinate help across your entire family circle." },
  { icon: Lock, text: "Your location is only shared when you choose to." },
];

export default function SolutionSection() {
  return (
    <section className="py-24 bg-[#f2f9f6]" id="solution">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Image */}
        <div className="relative order-2 lg:order-1">
          <div className="bg-white p-4 rounded-[3rem] soft-shadow border-8 border-white">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTjLxHbO3RSGWeTTyieEMp2y6NNXjltIE5DIPNNFDYR6nA5mlHYDNUj2Jso7M_IWBCL0W4gPkCX3ZySzdPIVFtHOQMU_UoHHFM54CM5srwl93PQT8wZ2JfL6Y1gL7tQoALOH-oYeyRgtnsWJRPQtNxqlJVk4Kwpv8VQD8BWqaFlT7NY__AIMT72JwvQOit1rzWjilCSBeNAGnM-ilcy3ZmKm1ujjGWReeU_BMhHdnRGrHbFkEdawcoloJdsf2ruglSL0wy8VgUlg"
              alt="SafeBand App UI"
              className="w-full h-auto rounded-[2rem]"
            />
          </div>

          {/* Floating notification */}
          <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 hidden lg:flex flex-col gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-primary/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Dad notified</p>
                <p className="text-[10px] text-slate-500">2 mins ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-8 order-1 lg:order-2">
          <h2 className="text-secondary text-sm font-bold uppercase tracking-[0.2em]">
            Our Solution
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight font-display">
            Technology that feels like a hug.
          </h3>
          <p className="text-lg text-slate-700 leading-relaxed">
            SafeBand isn't just an alert system; it's a bridge between you and
            your family. We've built a high-performance Progressive Web App
            that's accessible from any device, instantly, without needing a
            heavy install.
          </p>

          <div className="space-y-6">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-slate-600 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}