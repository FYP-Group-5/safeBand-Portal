import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Bell } from "lucide-react";
import ResponderActivateHeader from "../../../../components/responder/ResponderActivateHeader";

export default function ResponderActivatedPage() {
  return (
    <div className="font-display bg-background-light flex min-h-screen flex-col text-slate-900 antialiased">
      <ResponderActivateHeader mode="activated" />

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-140">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="h-2 w-full bg-emerald-500" />

            <div className="flex flex-col items-center px-8 py-12 text-center md:px-12">
              <div className="relative mb-8">
                <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-emerald-500/10" />
                <div className="relative flex size-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 md:size-32">
                  <CheckCircle2
                    className="h-12 w-12 md:h-16 md:w-16"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 md:text-4xl">
                Account Activated Successfully
              </h1>
              <p className="mb-10 max-w-md text-lg leading-relaxed text-slate-600">
                Your responder account is now secure and active. You will
                receive notifications if your contact triggers an emergency
                alert.
              </p>

              <div className="flex w-full flex-col gap-4">
                <Link
                  href="/responder/dashboard"
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 flex h-14 w-full items-center justify-center gap-2 rounded-lg text-lg font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
                >
                  <span>Go to Responder Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="#"
                  className="hover:text-primary h-12 w-full rounded-lg bg-transparent text-base font-medium text-slate-500 transition-colors"
                >
                  View Responder Guide
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-3">
                  <Bell className="text-primary h-5 w-5" />
                  <span className="text-sm font-medium text-slate-700">
                    Real-time SMS &amp; Push alerts active
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <span className="text-sm font-medium text-slate-700">
                    GPS Tracking Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Need help getting started?{" "}
              <Link
                href="#"
                className="text-primary font-semibold hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-1/3 w-full opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 100%, #0b203c 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

