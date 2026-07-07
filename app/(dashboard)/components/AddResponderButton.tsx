"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  UserPlus,
  Phone,
  Mail,
  Info,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import { inviteResponder } from "@/app/actions/responder";

// ─── Button ────────────────────────────────────────────────────────────────

export function AddResponderButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Desktop */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-primary-dark hover:bg-primary-dark/90 hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all md:flex"
      >
        <Plus className="h-4 w-4" />
        Add New Responder
      </button>

      {/* Mobile */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-primary-dark flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-sm transition-transform active:scale-95 md:hidden"
      >
        <UserPlus className="h-5 w-5" />
        Add New Responder
      </button>

      {showModal && <AddResponderModal onClose={() => setShowModal(false)} />}
    </>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────

type ModalView = "form" | "success";

interface FormState {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
};

function AddResponderModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<ModalView>("form");
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setView("form");
    setFormData(EMPTY_FORM);
    setError(null);
    onClose();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await inviteResponder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        relationship: formData.relationship,
      });

      if (!result.success) {
        setError(result.error);
      } else {
        setView("success");
      }
    });
  }

  return (
    <div className="bg-primary-dark/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* ── Success view ─────────────────────────────────────────────── */}
        {view === "success" && (
          <div className="flex flex-col items-center gap-6 px-8 py-12 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-primary-dark text-2xl font-bold">
                Invitation Sent!
              </h2>
              <p className="text-sm leading-relaxed text-slate-500">
                An email has been sent to{" "}
                <span className="font-semibold text-slate-700">
                  {formData.email}
                </span>{" "}
                with a link to accept the invitation and activate their
                responder account.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-primary-dark hover:bg-primary-dark/90 w-full rounded-lg px-8 py-3 font-bold text-white transition-all"
            >
              Done
            </button>
          </div>
        )}

        {/* ── Form view ────────────────────────────────────────────────── */}
        {view === "form" && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-8 pt-8 pb-4">
              <div>
                <h2 className="text-primary-dark text-2xl font-bold tracking-tight">
                  Add New Responder
                </h2>
                <p className="text-sm text-slate-500">
                  Securely add a trusted contact for emergencies.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 text-slate-400 transition-colors hover:text-slate-600"
                aria-label="Close modal"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 overflow-y-auto px-8 py-4">
              <Input
                id="full-name"
                name="name"
                label={
                  <>
                    Full Name <span className="text-emergency">*</span>
                  </>
                }
                type="text"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                icon={UserPlus}
                required
              />

              {/* Relationship */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-primary-dark flex items-center gap-1 text-sm font-semibold"
                  htmlFor="relationship"
                >
                  Relationship <span className="text-emergency">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <select
                    className="focus:border-primary-dark focus:ring-primary-dark/20 bg-background-light text-primary-dark block w-full appearance-none rounded-lg border border-slate-200 py-3 pr-10 pl-10 transition-all outline-none focus:ring-2"
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({ ...formData, relationship: e.target.value })
                    }
                    required
                  >
                    <option disabled value="">
                      Select relationship
                    </option>
                    <option value="parent">Parent</option>
                    <option value="partner">Partner / Spouse</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6 8l4 4 4-4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <Input
                id="email"
                name="email"
                label={
                  <>
                    Email Address <span className="text-emergency">*</span>
                  </>
                }
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={Mail}
                required
              />

              <Input
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                icon={Phone}
              />

              {/* Backend error */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Note */}
              <div className="border-primary-dark flex gap-3 rounded border-l-4 bg-blue-50 p-4">
                <Info className="text-primary-dark h-5 w-5 shrink-0" />
                <p className="text-xs leading-relaxed text-slate-600 italic">
                  <strong>Note:</strong> Your responder will receive an email
                  with a secure link to accept the invitation and set up their
                  account.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 bg-slate-50 px-8 py-6 sm:flex-row-reverse">
              <button
                className="shadow-primary-dark/20 bg-primary-dark hover:bg-primary-dark/90 flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3 font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Send Invitation
                  </>
                )}
              </button>
              <button
                onClick={handleClose}
                className="w-full rounded-lg border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-100 sm:w-auto"
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
