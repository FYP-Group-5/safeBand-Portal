"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import InviterCard from "@/components/responder/InviterCard";
import ResponderActivateHeader from "../../../components/responder/ResponderActivateHeader";
import { activateResponder, getInviter } from "@/app/actions/responder";
import type { UserInfo } from "@/types/responder";

export default function ResponderActivatePage() {
  const params = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [inviter, setInviter] = useState<UserInfo | null>(null);

  useEffect(() => {
    const invitedBy = searchParams.get("invitedBy");
    if (invitedBy) {
      getInviter(Number(invitedBy)).then((result) => {
        if (result.success) {
          setInviter(result.data);
        }
      });
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = params?.token;
    if (!token) return;

    startTransition(async () => {
      const result = await activateResponder({
        code: token,
        password: formData.password,
      });

      if (result) {
        setError(result.error);
      }
    });
  };

  const getPasswordErrors = (pass: string) => {
    const errors: string[] = [];
    if (pass.length < 8 || pass.length > 24) errors.push("8–24 characters");
    if (!/[A-Z]/.test(pass)) errors.push("1 uppercase letter");
    if (!/[a-z]/.test(pass)) errors.push("1 lowercase letter");
    if (!/\d/.test(pass)) errors.push("1 number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pass))
      errors.push("1 special character");
    return errors;
  };
  const passwordErrors = getPasswordErrors(formData.password);
  const isPasswordValid = passwordErrors.length === 0;
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.password.length > 0;

  return (
    <div className="font-display bg-background-light text-primary-dark flex min-h-screen flex-col">
      <ResponderActivateHeader mode="activation" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-primary-dark text-3xl font-bold tracking-tight">
              You&apos;ve been added as an Emergency Responder
            </h1>
            <p className="text-slate-500">
              Complete your profile to start receiving alerts.
            </p>
          </div>

          {inviter && (
            <InviterCard
              name={inviter.name}
              email={inviter.email}
            />
          )}

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="space-y-6 p-8">
              <div className="space-y-4">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Create Password"
                  icon={Lock}
                  placeholder="Enter 8+ characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                />

                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  icon={CheckCircle}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-slate-400 transition-colors hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                />

                <div className="space-y-1.5">
                  {[
                    { key: "8–24 characters", test: formData.password.length >= 8 && formData.password.length <= 24 },
                    { key: "1 uppercase letter", test: /[A-Z]/.test(formData.password) },
                    { key: "1 lowercase letter", test: /[a-z]/.test(formData.password) },
                    { key: "1 number", test: /\d/.test(formData.password) },
                    { key: "1 special character", test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(formData.password) },
                  ].map((rule) => (
                    <div key={rule.key} className="flex items-center gap-2 text-xs">
                      <div
                        className={`size-1.5 rounded-full ${
                          rule.test ? "bg-green-500" : "bg-slate-300"
                        }`}
                      />
                      <span
                        className={
                          rule.test ? "text-green-700" : "text-slate-500"
                        }
                      >
                        {rule.key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isPasswordValid || !passwordsMatch || isPending}
                className="group bg-primary-dark shadow-primary-dark/20 hover:bg-primary-dark/90 flex w-full items-center justify-center gap-2 rounded-lg py-4 font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Activating…
                  </>
                ) : (
                  <>
                    Activate Account
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-4 text-sm text-slate-500">
            <p>
              Not you?{" "}
              <Link
                href="#"
                className="text-primary-dark font-semibold hover:underline"
              >
                Contact Support
              </Link>
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="transition-colors hover:text-slate-800">
                Terms of Service
              </Link>
              <span className="size-1 rounded-full bg-slate-300" />
              <Link href="#" className="transition-colors hover:text-slate-800">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        © 2024 SafeBand Technologies. All rights reserved. Your data is
        encrypted and secure.
      </footer>
    </div>
  );
}
