"use client";

import { useState, useEffect, useTransition } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit,
  Trash2,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
  UserPlus,
  Users,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import { AddResponderButton } from "../components/AddResponderButton";
import {
  getResponders,
  updateResponder,
  deleteResponder,
} from "@/app/actions/responder";
import type { Responder, InviteResponderRequest } from "@/types/responder";

function responderContact(responder: Responder): {
  value: string;
  type: "phone" | "email";
} {
  if (responder.phone) return { value: responder.phone, type: "phone" };
  return { value: responder.email, type: "email" };
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 ${className ?? ""}`}
    />
  );
}

function ResponderCardSkeleton() {
  return (
    <div className="border-primary-dark/5 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row">
      <div className="flex w-full items-center gap-4 md:w-auto">
        <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3.5 w-40" />
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2 md:w-auto">
        <Skeleton className="h-9 w-16 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

function responderInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type FormState = InviteResponderRequest;

const EMPTY_FORM: FormState = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
};

function EditResponderModal({
  responder,
  onClose,
  onUpdated,
}: {
  responder: Responder;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [formData, setFormData] = useState<FormState>({
    name: responder.name,
    relationship: responder.relationship,
    phone: responder.phone ?? "",
    email: responder.email,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateResponder(responder.id, formData);
      if (!result.success) {
        setError(result.error);
      } else {
        onUpdated();
        onClose();
      }
    });
  }

  return (
    <div className="bg-primary-dark/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-hidden"
        >
          <div className="flex items-start justify-between px-8 pt-8 pb-4">
            <div>
              <h2 className="text-primary-dark text-2xl font-bold tracking-tight">
                Edit Responder
              </h2>
              <p className="text-sm text-slate-500">
                Update contact details for {responder.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 transition-colors hover:text-slate-600"
              aria-label="Close modal"
            >
              <Plus className="h-6 w-6 rotate-45" />
            </button>
          </div>

          <div className="space-y-5 overflow-y-auto px-8 py-4">
            <Input
              id="edit-name"
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

            <div className="flex flex-col gap-1.5">
              <label
                className="text-primary-dark flex items-center gap-1 text-sm font-semibold"
                htmlFor="edit-relationship"
              >
                Relationship <span className="text-emergency">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Users className="h-5 w-5" />
                </div>
                <select
                  className="focus:border-primary-dark focus:ring-primary-dark/20 bg-background-light text-primary-dark block w-full appearance-none rounded-lg border border-slate-200 py-3 pr-10 pl-10 transition-all outline-none focus:ring-2"
                  id="edit-relationship"
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
              id="edit-email"
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
              id="edit-phone"
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

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 bg-slate-50 px-8 py-6 sm:flex-row-reverse">
            <button
              className="shadow-primary-dark/20 bg-primary-dark hover:bg-primary-dark/90 flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3 font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-100 sm:w-auto"
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteResponderModal({
  responder,
  onClose,
  onDeleted,
}: {
  responder: Responder;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteResponder(responder.id);
      if (!result.success) {
        setError(result.error);
      } else {
        onDeleted();
        onClose();
      }
    });
  }

  return (
    <div className="bg-primary-dark/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-primary-dark text-2xl font-bold">
                Remove Responder
              </h2>
              <p className="text-sm leading-relaxed text-slate-500">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-slate-700">
                  {responder.name}
                </span>
                ? They will no longer receive emergency alerts from you.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-8 py-3 font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Removing…
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  Remove
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-100 sm:w-auto"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RespondersPage() {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingResponder, setEditingResponder] = useState<Responder | null>(
    null,
  );
  const [deletingResponder, setDeletingResponder] = useState<Responder | null>(
    null,
  );

  function loadResponders() {
    getResponders().then((result) => {
      if (result.success) {
        setResponders(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    loadResponders();
  }, []);

  return (
    <section className="bg-background-light relative flex min-h-screen w-full flex-col pb-20">
      <header className="border-primary-dark/10 flex items-center justify-between border-b bg-white px-6 py-4 md:px-10 lg:px-40">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <button className="text-primary-dark hover:bg-primary-dark/5 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-primary-dark text-xl font-bold tracking-tight">
            Responders
          </h1>
        </div>
        <div className="hidden md:block">
          <AddResponderButton />
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-40">
        <div className="flex max-w-240 flex-1 flex-col gap-6">
          <div className="md:hidden">
            <AddResponderButton />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2.5 px-2">
            <div>
              <h2 className="text-primary-dark text-2xl font-bold">
                Active Network
              </h2>
              <p className="text-sm text-slate-500">
                People who will be notified in case of emergency.
              </p>
            </div>
            {!loading && (
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {responders.length} Total
              </span>
            )}
          </div>

          {loading && (
            <div className="flex flex-col gap-4">
              <ResponderCardSkeleton />
              <ResponderCardSkeleton />
              <ResponderCardSkeleton />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {responders.map((responder) => {
                const contact = responderContact(responder);
                return (
                  <div
                    key={responder.id}
                    className="border-primary-dark/5 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row"
                  >
                    <div className="flex w-full items-center gap-4 md:w-auto">
                      <div className="bg-primary-dark/10 relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                        <div className="text-primary-dark flex h-full w-full items-center justify-center text-xl font-bold">
                          {responderInitials(responder.name)}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="text-primary-dark text-lg font-bold">
                            {responder.name}
                          </h3>
                          {responder.status === "verified" ? (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                          {responder.relationship}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          {contact.type === "phone" ? (
                            <Phone className="h-3.5 w-3.5" />
                          ) : (
                            <Mail className="h-3.5 w-3.5" />
                          )}
                          {contact.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-end gap-2 md:w-auto">
                      <button
                        onClick={() => setEditingResponder(responder)}
                        className="text-primary-dark bg-primary-dark/5 hover:bg-primary-dark/10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingResponder(responder)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                        title="Remove Responder"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-primary-dark/10 bg-primary-dark/5 mt-4 rounded-xl border p-6">
            <div className="flex items-start gap-4">
              <Info className="text-primary-dark mt-1 h-6 w-6 shrink-0" />
              <div className="flex flex-col gap-1">
                <h4 className="text-primary-dark text-sm font-bold">
                  About Responders
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Responders are your trusted contacts who will receive your
                  location and an SOS alert when your SafeBand is triggered. We
                  recommend having at least 2 verified responders.
                </p>
                <button className="text-primary-dark mt-2 w-fit text-sm font-bold hover:underline">
                  Learn more about verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {editingResponder && (
        <EditResponderModal
          responder={editingResponder}
          onClose={() => setEditingResponder(null)}
          onUpdated={loadResponders}
        />
      )}

      {deletingResponder && (
        <DeleteResponderModal
          responder={deletingResponder}
          onClose={() => setDeletingResponder(null)}
          onDeleted={loadResponders}
        />
      )}
    </section>
  );
}
