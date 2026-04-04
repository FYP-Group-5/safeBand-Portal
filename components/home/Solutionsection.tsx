import { Zap, Users, Lock, CheckCircle } from "lucide-react";

const benefits = [
  { icon: Zap, text: "Instant deployment, no app store needed." },
  { icon: Users, text: "Coordinate help across your entire family circle." },
  { icon: Lock, text: "Your location is only shared when you choose to." },
];

export default function SolutionSection() {
  return (
    <section className="bg-[#f2f9f6] py-24" id="solution">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 lg:grid-cols-2">
        {/* Image */}
        <div className="relative order-2 lg:order-1">
          <div className="soft-shadow rounded-[3rem] border-8 border-white bg-white p-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTjLxHbO3RSGWeTTyieEMp2y6NNXjltIE5DIPNNFDYR6nA5mlHYDNUj2Jso7M_IWBCL0W4gPkCX3ZySzdPIVFtHOQMU_UoHHFM54CM5srwl93PQT8wZ2JfL6Y1gL7tQoALOH-oYeyRgtnsWJRPQtNxqlJVk4Kwpv8VQD8BWqaFlT7NY__AIMT72JwvQOit1rzWjilCSBeNAGnM-ilcy3ZmKm1ujjGWReeU_BMhHdnRGrHbFkEdawcoloJdsf2ruglSL0wy8VgUlg"
              alt="SafeBand App UI"
              className="h-auto w-full rounded-[2rem]"
            />
          </div>

          {/* Floating notification */}
          <div className="absolute top-1/2 -right-8 hidden -translate-y-1/2 transform flex-col gap-4 lg:flex">
            <div className="border-primary/5 flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Dad notified</p>
                <p className="text-[10px] text-slate-500">2 mins ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <h2 className="text-secondary text-sm font-bold tracking-[0.2em] uppercase">
            Our Solution
          </h2>
          <h3 className="font-display text-4xl leading-tight font-bold text-slate-900 md:text-5xl">
            Technology that feels like a hug.
          </h3>
          <p className="text-lg leading-relaxed text-slate-700">
            SafeBand isn't just an alert system; it's a bridge between you and
            your family. We've built a high-performance Progressive Web App
            that's accessible from any device, instantly, without needing a
            heavy install.
          </p>

          <div className="space-y-6">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="text-secondary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-medium text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
