"use client";

import { useState } from "react";
import { Plus, UserPlus, Shield, Phone, Mail, Info, Users } from "lucide-react";

export function AddResponderButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Desktop Button */}
      <div className="hidden items-center gap-3 md:flex">
        <button
          onClick={() => setShowModal(true)}
          className="hover:bg-opacity-90 bg-primary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Responder</span>
        </button>
      </div>

      {/* Mobile Button */}
      <div className="md:hidden">
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-dark flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-sm transition-transform active:scale-95"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add New Responder</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && <AddResponderModal onClose={() => setShowModal(false)} />}
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
