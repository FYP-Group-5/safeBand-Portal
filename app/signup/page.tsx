"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Shield,
  User,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  Info,
  AlertCircle,
} from "lucide-react";
import Input from "@/components/ui/Input";
import { register } from "../actions/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { width: "0%", label: "" };
    if (pass.length < 6) return { width: "33%", label: "Weak" };
    if (pass.length < 10) return { width: "66%", label: "Strong" };
    return { width: "100%", label: "Very Strong" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await register({ name, email, phone, password });
      if (result?.success === false) {
        setError(result.error);
      }
    });
  };

  return (
    <section className="bg-background-light flex min-h-screen flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-primary-dark/10 flex items-center justify-between border-b bg-white px-6 py-4 md:px-10">
        <Link href="/" className="text-primary-dark flex items-center gap-3">
          <div className="bg-primary-dark flex size-8 items-center justify-center rounded-lg text-white">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-primary-dark text-xl leading-tight font-bold tracking-tight">
            SafeBand
          </h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-500 md:block">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="border-primary-dark text-primary-dark hover:bg-primary-dark/5 flex h-10 min-w-21 cursor-pointer items-center justify-center overflow-hidden rounded-lg border px-4 text-sm font-bold transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="to-background-light flex flex-1 items-center justify-center bg-linear-to-b from-white p-6">
        <div className="border-primary-dark/5 shadow-primary-dark/5 w-full max-w-125 overflow-hidden rounded-xl border bg-white shadow-xl">
          {/* Hero Header in Card */}
          <div className="relative h-32 w-full overflow-hidden">
            <div className="bg-primary-dark absolute inset-0 opacity-90"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h1 className="text-2xl font-bold text-white">Join SafeBand</h1>
              <p className="text-sm text-white/80">
                Secure your safety network in minutes.
              </p>
            </div>
            <div className="absolute top-0 right-0 h-full w-1/3 opacity-20">
              <img
                className="h-full w-full object-cover"
                alt="Abstract deep blue geometric wave pattern"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWPxNLLu-7IMoQSOWCPFDaSfJwD-7sDtYervAYmX96ajPsDogN5TB27Dh9UXRn1EQZxbyKOLx6xO198EAQmmlFkHNrYJQlM_NxAhhHQ_6aWad2uRHMyUQ9yYtB6s_IrwCsNk2fUSZQM8MbamTNqzRvV9LJuezugUNxs7NIdJLeEeXSqWBeHAa8IFoh5nOhmaVxeBa8j8l3WoehIM2qpiN9ezpDfKl28fAbF5XYv6m1gIPfbpSl99nni2HHv1LjX8bFbxfBYYOCyg"
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="space-y-5 p-8">
            <Input
              label={
                <>
                  Full Name <span className="text-emergency">*</span>
                </>
              }
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
            />

            <Input
              label={
                <>
                  Email Address <span className="text-emergency">*</span>
                </>
              }
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />

            <Input
              label={
                <>
                  Phone Number <span className="text-emergency">*</span>
                </>
              }
              labelRight={
                <span className="bg-emergency/10 text-emergency rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                  Critical
                </span>
              }
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Smartphone}
              helperText={
                <p className="flex items-start gap-1 text-[11px] text-slate-500">
                  <Info className="text-emergency mt-0.5 h-4 w-4 shrink-0" />
                  Required for instant emergency SMS alerts and live location
                  sharing.
                </p>
              }
            />

            <Input
              label={
                <>
                  Password <span className="text-emergency">*</span>
                </>
              }
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-primary-dark text-slate-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              helperText={
                password ? (
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="bg-primary-dark h-full rounded-full transition-all duration-300"
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">
                      {passwordStrength.label}
                    </span>
                  </div>
                ) : null
              }
            />

            {/* Backend error */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary-dark shadow-primary-dark/20 hover:bg-primary-dark/90 mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Creating Account…" : "Create Account"}
              {!isPending && <ArrowRight className="h-5 w-5" />}
            </button>

            {/* Login Link */}
            <p className="mt-2 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-dark font-bold hover:underline"
              >
                Log in
              </Link>
            </p>

            {/* Trust Footer */}
            <div className="border-t border-slate-100 pt-6 text-center">
              <div className="mb-3 flex items-center justify-center gap-4 opacity-50 contrast-125 grayscale">
                <ShieldCheck className="h-6 w-6" />
                <Lock className="h-6 w-6" />
                <LockKeyhole className="h-6 w-6" />
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Your safety is our priority. All data is protected with{" "}
                <strong>bank-grade AES-256 encryption</strong>. By signing up,
                you agree to our{" "}
                <a className="underline" href="#">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a className="underline" href="#">
                  Terms of Service
                </a>
                . We never sell or share your personal emergency contact
                information.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="px-10 py-6 text-center">
        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          &copy; 2024 SafeBand Security Systems. All Rights Reserved.
        </p>
      </footer>
    </section>
  );
}
