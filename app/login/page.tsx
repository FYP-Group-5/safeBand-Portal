import { Eye, Lock, LogOut, Mail, Shield, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <section className="bg-background-light flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-4 sm:p-6">
        {/* Logo Section  */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0b203c] text-white shadow-lg">
              <span className="text-3xl">
                <Shield />
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0b203c]">
              SafeBand
            </h1>
          </div>
          <div className="h-1 w-12 rounded-full bg-[#E10600]"></div>
        </div>
        {/* Main Login Card  */}
        <div className="overflow-hidden rounded-xl border border-[#0b203c]/10 bg-white shadow-xl">
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#0b203c]">
                Welcome Back
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Please enter your details to secure your device.
              </p>
            </div>
            <form className="space-y-5">
              {/* Email Field  */}
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-[#0b203c]/80"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-zinc-400">
                    <Mail />
                  </span>
                  <input
                    className="bg-background-light w-full rounded-lg border border-zinc-200 py-3 pr-4 pl-10 transition-all outline-none focus:border-[#0b203c] focus:ring-2 focus:ring-[#0b203c]"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                  />
                </div>
              </div>
              {/* Password Field  */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-semibold text-[#0b203c]/80"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="hover:text-accent-red text-xs font-medium text-[#0b203c] transition-colors"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-zinc-400">
                    <Lock />
                  </span>
                  <input
                    className="bg-background-light w-full rounded-lg border border-zinc-200 py-3 pr-12 pl-10 transition-all outline-none focus:border-[#0b203c] focus:ring-2 focus:ring-[#0b203c]"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                  <button
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition-colors hover:text-[#0b203c]"
                    type="button"
                  >
                    <span className="text-xl">
                      <Eye />
                    </span>
                  </button>
                </div>
              </div>
              {/* Login Button  */}
              <button
                className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-[#0b203c] py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#0b203c]/90 hover:shadow-lg active:scale-[0.98]"
                type="submit"
              >
                <span>Login</span>
                <span className="text-lg">
                  <LogOut />
                </span>
              </button>
            </form>
            {/* Divider  */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500">
                  Security Checkpoint
                </span>
              </div>
            </div>
            {/* Create Account  */}
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Don't have an account yet?
                <a
                  className="decoration-accent-red ml-1 font-bold text-[#0b203c] decoration-2 underline-offset-4 hover:underline"
                  href="#"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>
          {/* Bottom Accent Bar  */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0b203c] via-[#E10600] to-[#0b203c]"></div>
        </div>
        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a className="transition-colors hover:text-[#0b203c]" href="#">
              Privacy Policy
            </a>
            <a className="transition-colors hover:text-[#0b203c]" href="#">
              Terms of Service
            </a>
            <a className="transition-colors hover:text-[#0b203c]" href="#">
              Help Center
            </a>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
            <span className="text-sm">
              <ShieldCheck />
            </span>
            <span>End-to-end encrypted connection active</span>
          </div>
        </div>
      </div>
    </section>
  );
}
