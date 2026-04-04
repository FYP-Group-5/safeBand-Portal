"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="bg-background-light flex min-h-screen items-center justify-center font-sans">
      <div className="w-full max-w-md p-6">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary-dark flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-primary-dark text-2xl font-bold tracking-tight">
              SafeBand
            </h1>
          </div>
          <div className="bg-emergency h-1 w-12 rounded-full"></div>
        </div>

        {/* Main Login Card */}
        <div className="border-primary-dark/10 overflow-hidden rounded-xl border bg-white shadow-xl">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-primary-dark text-2xl font-bold">
                Welcome Back
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Please enter your details to secure your device.
              </p>
            </div>

            <form className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="text-primary-dark/80 text-sm font-semibold"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="focus:border-primary-dark focus:ring-primary-dark w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-4 outline-none transition-all focus:ring-2"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={email}
                    onInput={(e) => setEmail((e.target as any).value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-primary-dark/80 text-sm font-semibold"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    className="hover:text-accent-red text-primary-dark text-xs font-medium transition-colors"
                    href="#"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="focus:border-primary-dark focus:ring-primary-dark w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-12 outline-none transition-all focus:ring-2"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onInput={(e) => setPassword((e.target as any).value)}
                  />
                  <button
                    className="hover:text-primary-dark absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                className="bg-primary-dark hover:bg-primary-dark/90 flex w-full transform items-center justify-center gap-2 rounded-lg py-3.5 font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                type="submit"
              >
                <span>Login</span>
                <LogIn className="h-5 w-5" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">
                  Security Checkpoint
                </span>
              </div>
            </div>

            {/* Create Account */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account yet?
                <Link
                  className="decoration-emergency text-primary-dark ml-1 font-bold decoration-2 underline-offset-4 hover:underline"
                  href="/signup"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Accent Bar */}
          <div className="via-emergency to-primary-dark from-primary-dark h-1.5 w-full bg-gradient-to-r"></div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
            <a className="hover:text-primary-dark transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary-dark transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary-dark transition-colors" href="#">
              Help Center
            </a>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            <span>End-to-end encrypted connection active</span>
          </div>
        </div>
      </div>
    </section>
  );
}
