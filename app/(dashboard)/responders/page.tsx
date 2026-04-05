"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  UserPlus,
  Shield,
  Phone,
  Mail,
  Edit,
  Trash2,
  Info,
  CheckCircle,
  Clock,
  LayoutGrid,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function RespondersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeNav, setActiveNav] = useState("responders");

  const responders = [
    {
      id: 1,
      name: "Jane Doe",
      relationship: "Mother",
      contact: "+1 (555) 012-3456",
      contactType: "phone",
      status: "verified",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgLF9Ece_EyjtszoGOU10OQ4CBj0VKsqJ4v6XcRBQmw_CpJuOCc30m32JnDJCuEuGAQHd1dez81Kb129MowkG3oHDg8J0Bc1hx0rq1PrW2bofpYl9HAuxJnWoG2j6kKuDRGjSJl54ttX6ikMEX4Oag-e9Gk-J89NfHRsG4hAl8Dhn8zfP9I-OX-DKy3uH9JBAbb4c343qJzmOTaDnGVE7jjdxeMmnwXREV686IKyoK5XMgfgrM-VB6BeoW059lfhINnIfSoAqmOA",
    },
    {
      id: 2,
      name: "Mark Wilson",
      relationship: "Friend",
      contact: "mark.w@example.com",
      contactType: "email",
      status: "pending",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBDqklr-656JwZ7ANfmdDv8fCaTvL6BsvWVYr30YtWCc2AaGRLKRbtQjJEdk7nA9E9G5vRLTLUO2qtfN0lUd98zOrtCIZo6mkdD849VOU0SSJiIITM_72T3bmIb03eBIrBKXkcgt8kkCZMuJ9oCokEIewLISdtm5dzIHnU-CMjUg0_GV7wWMpZF62PRdslB4bycG0Yz9ItTCPG6aO5i1kEoCNBxwcSwlrfTWwmpI2RkrcgMT8FeA9mDwIPPtwPze0TvZa_x6556kQ",
    },
    {
      id: 3,
      name: "Sarah Chen",
      relationship: "Partner",
      contact: "+1 (555) 987-6543",
      contactType: "phone",
      status: "verified",
      initials: "SC",
    },
  ];

  return (
    <>
      <section className="bg-background-light relative flex min-h-screen w-full flex-col pb-20 md:pb-0">
        {/* Top Navigation Bar */}
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
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setShowAddModal(true)}
              className="hover:bg-opacity-90 bg-primary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Responder</span>
            </button>
          </div>
        </header>

        <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-40">
          <div className="flex max-w-[960px] flex-1 flex-col gap-6">
            {/* Mobile Add Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-dark flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-sm transition-transform active:scale-95"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add New Responder</span>
              </button>
            </div>

            {/* List Header */}
            <div className="flex flex-wrap items-end justify-between gap-2.5 px-2">
              <div>
                <h2 className="text-primary-dark text-2xl font-bold">
                  Active Network
                </h2>
                <p className="text-sm text-slate-500">
                  People who will be notified in case of emergency.
                </p>
              </div>
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {responders.length} Total
              </span>
            </div>

            {/* Responder Cards List */}
            <div className="flex flex-col gap-4">
              {responders.map((responder) => (
                <div
                  key={responder.id}
                  className="border-primary-dark/5 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row"
                >
                  <div className="flex w-full flex-wrap items-center gap-4 md:w-auto">
                    <div className="bg-primary-dark/10 relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                      {responder.image ? (
                        <img
                          alt={`${responder.name} profile photo`}
                          className="h-full w-full object-cover"
                          src={responder.image}
                        />
                      ) : (
                        <div className="text-primary-dark flex h-full w-full items-center justify-center text-xl font-bold">
                          {responder.initials}
                        </div>
                      )}
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
                        {responder.contactType === "phone" ? (
                          <Phone className="h-3.5 w-3.5" />
                        ) : (
                          <Mail className="h-3.5 w-3.5" />
                        )}
                        {responder.contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-end gap-2 md:w-auto">
                    <button className="text-primary-dark bg-primary-dark/5 hover:bg-primary-dark/10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                      title="Remove Responder"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Information Section */}
            <div className="border-primary-dark/10 bg-primary-dark/5 mt-4 rounded-xl border p-6">
              <div className="flex items-start gap-4">
                <Info className="text-primary-dark mt-1 h-6 w-6 shrink-0" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-primary-dark text-sm font-bold">
                    About Responders
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Responders are your trusted contacts who will receive your
                    location and an SOS alert when your SafeBand is triggered.
                    We recommend having at least 2 verified responders.
                  </p>
                  <button className="text-primary-dark mt-2 w-fit text-sm font-bold hover:underline">
                    Learn more about verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200 bg-white md:hidden">
          <div className="flex justify-around px-6 py-3">
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1"
            >
              <button
                onClick={() => setActiveNav("dash")}
                className={`flex flex-col items-center gap-1 ${
                  activeNav === "dash"
                    ? "text-primary-dark"
                    : "hover:text-primary-dark text-gray-400"
                } transition-colors`}
              >
                <LayoutGrid className="h-6 w-6" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  Home
                </span>
              </button>
            </Link>

            <Link
              href="/responders"
              className="flex flex-col items-center gap-1"
            >
              <button
                onClick={() => setActiveNav("responders")}
                className={`flex flex-col items-center gap-1 ${
                  activeNav === "responders"
                    ? "text-primary-dark"
                    : "hover:text-primary-dark text-gray-400"
                } transition-colors`}
              >
                <Users className="h-6 w-6" />
                <span className="text-[10px] font-medium tracking-widest uppercase">
                  Responders
                </span>
              </button>
            </Link>

            <Link href="/settings" className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveNav("settings")}
                className={`flex flex-col items-center gap-1 ${
                  activeNav === "settings"
                    ? "text-primary-dark"
                    : "hover:text-primary-dark text-gray-400"
                } transition-colors`}
              >
                <Settings className="h-6 w-6" />
                <span className="text-[10px] font-medium tracking-widest uppercase">
                  Settings
                </span>
              </button>
            </Link>
          </div>
        </nav>
      </section>

      {/* Add Responder Modal */}
      {showAddModal && (
        <AddResponderModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}

function AddResponderModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    relationship: "",
    phone: "",
    email: "",
  });

  return (
    <div className="bg-primary-dark/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="text-primary-dark">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="text-primary-dark text-2xl font-bold tracking-tight">
                Add New Responder
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Securely add a trusted contact for emergencies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 transition-colors hover:text-slate-600"
          >
            <Plus className="h-6 w-6 rotate-45" />
          </button>
        </div>

        {/* Form Body */}
        <form className="space-y-5 overflow-y-auto px-8 py-4">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="full-name"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <input
                className="focus:border-primary-dark focus:ring-primary-dark/20 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-10 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-2"
                id="full-name"
                name="full-name"
                placeholder="e.g., John Doe"
                type="text"
                value={formData.fullName}
                onInput={(e) =>
                  setFormData({
                    ...formData,
                    fullName: (e.target as any).value,
                  })
                }
              />
            </div>
          </div>

          {/* Relationship Dropdown */}
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="relationship"
            >
              Relationship
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Users className="h-5 w-5" />
              </div>
              <select
                className="focus:border-primary-dark focus:ring-primary-dark/20 block w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pr-10 pl-10 text-slate-900 transition-all outline-none focus:ring-2"
                id="relationship"
                name="relationship"
                value={formData.relationship}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relationship: (e.target as any).value,
                  })
                }
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

          {/* Phone Number Field */}
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Phone className="h-5 w-5" />
              </div>
              <input
                className="focus:border-primary-dark focus:ring-primary-dark/20 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-10 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-2"
                id="phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                type="tel"
                value={formData.phone}
                onInput={(e) =>
                  setFormData({ ...formData, phone: (e.target as any).value })
                }
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                className="focus:border-primary-dark focus:ring-primary-dark/20 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-10 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-2"
                id="email"
                name="email"
                placeholder="john.doe@example.com"
                type="email"
                value={formData.email}
                onInput={(e) =>
                  setFormData({ ...formData, email: (e.target as any).value })
                }
              />
            </div>
          </div>

          {/* Verification Note */}
          <div className="border-primary-dark flex gap-3 rounded border-l-4 bg-blue-50 p-4">
            <Info className="text-primary-dark h-5 w-5 flex-shrink-0" />
            <p className="text-xs leading-relaxed text-slate-600 italic">
              <strong>Note:</strong> Your responder will receive a verification
              SMS to confirm their participation in your emergency safety
              network.
            </p>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 bg-slate-50 px-8 py-6 sm:flex-row-reverse">
          <button
            className="shadow-primary-dark/20 bg-primary-dark hover:bg-primary-dark/90 flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3 font-bold text-white shadow-lg transition-all sm:w-auto"
            type="submit"
          >
            <UserPlus className="h-5 w-5" />
            Add Responder
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-100 sm:w-auto"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
