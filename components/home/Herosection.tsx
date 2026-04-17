import { Heart, MapPin, AlertTriangle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8faf9] pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Left — Copy */}
        <div className="flex flex-col gap-8">
          <div className="bg-secondary/10 border-secondary/20 text-secondary inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
            <Heart className="h-4 w-4" />
            Family Security First
          </div>

          <h1 className="font-display text-5xl leading-tight font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            Peace of mind for the
            <span className="text-secondary"> ones you love.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
            Keep your family connected and protected. SafeBand allows your loved
            ones to share their live location and send instant alerts with just
            one tap.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="btn-primary flex items-center gap-2">
              Protect My Family <Heart className="h-5 w-5" />
            </button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>

        {/* Right — Illustration */}
        <div className="relative">
          <div className="soft-shadow relative rounded-[3rem] bg-white p-6">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrfMB87Phs-VLHn8_jxM9-9arjqae-barHhrNyfzckv1Hqmb74zKqKy1sJCKinnvhRZv7yEoR7a0_E4zwhLZ7ACU_Tif21aIVwpKEZPAJfaiESPPmNG_nrS9s9xqTi1nyMAYCUtp6TSmXnWkkHv2ASSoZNPYtXD5iEY4VDy6cEMcK-dueqeOynhqgwJkqut0pUnb6Q8DJXqC-XaL0vo-q-8NofXf_FRryb1Qj4KNeyN68sVD881Op9Gqk6bx2UZcnfVZfFUZZzwQ"
              alt="Family Connection illustration"
              className="h-auto w-full rounded-[2.5rem] object-cover"
            />
            {/* Location badge */}
            <div className="bg-secondary soft-shadow absolute -bottom-8 -left-8 max-w-50 rounded-3xl p-6 text-white">
              <MapPin className="mb-2 h-8 w-8" />
              <p className="text-sm font-bold">Grandma is safe at home</p>
            </div>
            {/* Emergency badge */}
            <div className="bg-emergency soft-shadow absolute -top-6 -right-6 animate-bounce rounded-full p-5 text-white">
              <AlertTriangle className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
