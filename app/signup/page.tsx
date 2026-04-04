"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { width: "0%", label: "" };
    if (pass.length < 6) return { width: "33%", label: "Weak" };
    if (pass.length < 10) return { width: "66%", label: "Strong" };
    return { width: "100%", label: "Very Strong" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <section className="flex min-h-screen flex-col bg-background-light font-sans">
      {/* Top Navigation */}
      <header className="border-primary-dark/10 bg-background-dark/50 flex items-center justify-between border-b bg-white px-6 py-4 md:px-10">
        <Link href="/" className="text-primary-dark flex items-center gap-3">
          <div className="bg-primary-dark flex size-8 items-center justify-center rounded-lg text-white">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-primary-dark text-xl font-bold leading-tight tracking-tight">
            SafeBand
          </h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-500 md:block">
            Already have an account?
          </span>
          <Link href="/login">
            <button className="border-primary-dark text-primary-dark hover:bg-primary-dark/5 flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border px-4 text-sm font-bold transition-colors">
              <span className="truncate">Login</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-background-light p-6">
        <div className="border-primary-dark/5 shadow-primary-dark/5 w-full max-w-[500px] overflow-hidden rounded-xl border bg-white shadow-xl">
          {/* Hero Header in Card */}
          <div className="relative h-32 w-full overflow-hidden">
            <div className="bg-primary-dark absolute inset-0 opacity-90"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h1 className="text-2xl font-bold text-white">Join SafeBand</h1>
              <p className="text-sm text-white/80">
                Secure your safety network in minutes.
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
              <img
                className="h-full w-full object-cover"
                alt="Abstract deep blue geometric wave pattern"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWPxNLLu-7IMoQSOWCPFDaSfJwD-7sDtYervAYmX96ajPsDogN5TB27Dh9UXRn1EQZxbyKOLx6xO198EAQmmlFkHNrYJQlM_NxAhhHQ_6aWad2uRHMyUQ9yYtB6s_IrwCsNk2fUSZQM8MbamTNqzRvV9LJuezugUNxs7NIdJLeEeXSqWBeHAa8IFoh5nOhmaVxeBa8j8l3WoehIM2qpiN9ezpDfKl28fAbF5XYv6m1gIPfbpSl99nni2HHv1LjX8bFbxfBYYOCyg"
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="space-y-5 p-8">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-primary-dark flex items-center gap-1 text-sm font-semibold">
                Full Name <span className="text-emergency">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="focus:border-primary-dark focus:ring-primary-dark/20 w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-4 text-primary-dark outline-none transition-all placeholder:text-slate-400 focus:ring-2"
                  placeholder="Jane Doe"
                  type="text"
                  value={fullName}
                  onInput={(e) => {
                    setFullName((e.target as any).value);
                  }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-primary-dark flex items-center gap-1 text-sm font-semibold">
                Email Address <span className="text-emergency">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="focus:border-primary-dark focus:ring-primary-dark/20 w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-4 text-primary-dark outline-none transition-all placeholder:text-slate-400 focus:ring-2"
                  placeholder="jane@example.com"
                  type="email"
                  value={email}
                  onInput={(e) => setEmail((e.target as any).value)}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-primary-dark flex items-center justify-between gap-1 text-sm font-semibold">
                <span>
                  Phone Number <span className="text-emergency">*</span>
                </span>
                <span className="bg-emergency/10 text-emergency rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Critical
                </span>
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="focus:border-primary-dark focus:ring-primary-dark/20 w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-4 text-primary-dark outline-none transition-all placeholder:text-slate-400 focus:ring-2"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={phone}
                  onInput={(e) => setPhone((e.target as any).value)}
                />
              </div>
              <p className="mt-1 flex items-start gap-1 text-[11px] text-slate-500">
                <Info className="text-emergency mt-0.5 h-4 w-4" />
                Required for instant emergency SMS alerts and live location
                sharing.
              </p>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-primary-dark flex items-center gap-1 text-sm font-semibold">
                Password <span className="text-emergency">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="focus:border-primary-dark focus:ring-primary-dark/20 w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-12 text-primary-dark outline-none transition-all placeholder:text-slate-400 focus:ring-2"
                  placeholder="••••••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onInput={(e) => setPassword((e.target as any).value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-primary-dark absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-1 flex gap-1">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="bg-primary-dark h-full rounded-full transition-all duration-300"
                      style={{ width: passwordStrength.width }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Sign Up Button */}
            <button className="bg-primary-dark shadow-primary-dark/20 hover:bg-primary-dark/90 mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98]">
              Create Account
              <ArrowRight className="h-5 w-5" />
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
              <div className="mb-3 flex items-center justify-center gap-4 contrast-125 grayscale opacity-50">
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
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
          © 2024 SafeBand Security Systems. All Rights Reserved.
        </p>
      </footer>
    </section>
  );
}
