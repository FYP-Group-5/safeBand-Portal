"use client";

import { useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Ban,
  CheckCircle,
  TrendingUp,
  Shield,
  Headphones,
} from "lucide-react";

const initialUsers = [
  {
    initials: "JD",
    initialsBg: "bg-primary/10 text-primary",
    name: "John Doe",
    email: "john@safeband.com",
    role: "Admin",
    roleClass: "bg-indigo-50 text-indigo-600",
    status: "Active",
    statusColor: "bg-emerald-500",
    joined: "Oct 24, 2023",
  },
  {
    initials: "SS",
    initialsBg: "bg-emerald-500/10 text-emerald-600",
    name: "Sarah Smith",
    email: "sarah.s@gmail.com",
    role: "Responder",
    roleClass: "bg-amber-50 text-amber-600",
    status: "Active",
    statusColor: "bg-emerald-500",
    joined: "Nov 12, 2023",
  },
  {
    initials: "MJ",
    initialsBg: "bg-blue-500/10 text-blue-600",
    name: "Mike Johnson",
    email: "mike@provider.net",
    role: "User",
    roleClass: "bg-slate-100 text-slate-600",
    status: "Suspended",
    statusColor: "bg-slate-400",
    joined: "Dec 01, 2023",
  },
  {
    initials: "EC",
    initialsBg: "bg-purple-500/10 text-purple-600",
    name: "Emily Chen",
    email: "emily.c@safeband.com",
    role: "Responder",
    roleClass: "bg-amber-50 text-amber-600",
    status: "Active",
    statusColor: "bg-emerald-500",
    joined: "Jan 15, 2024",
  },
  {
    initials: "RB",
    initialsBg: "bg-sky-500/10 text-sky-600",
    name: "Robert Brown",
    email: "rbrown@web.com",
    role: "User",
    roleClass: "bg-slate-100 text-slate-600",
    status: "Active",
    statusColor: "bg-emerald-500",
    joined: "Feb 10, 2024",
  },
];

const filters = ["All Users", "Active", "Suspended"];

export default function AdminUsersPage() {
  const [activeFilter, setActiveFilter] = useState("All Users");

  const filtered =
    activeFilter === "All Users"
      ? initialUsers
      : initialUsers.filter(
          (u) => u.status.toLowerCase() === activeFilter.toLowerCase(),
        );

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            User Management
          </h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
            1,284 Total
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark/90"
        >
          <UserPlus className="h-4 w-4" />
          Add New User
        </button>
      </header>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/20"
            placeholder="Search users by name, email, or ID..."
            type="text"
          />
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-lg px-6 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === f
                  ? "bg-white text-primary-dark shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr
                  key={user.email}
                  className="transition-colors hover:bg-slate-50 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${user.initialsBg}`}
                      >
                        {user.initials}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${user.roleClass}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${user.statusColor}`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          user.status === "Active"
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-primary-dark"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                        title={user.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        {user.status === "Active" ? (
                          <Ban className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-800">1</span> to{" "}
            <span className="font-medium text-slate-800">5</span> of{" "}
            <span className="font-medium text-slate-800">1,284</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-400"
              disabled
            >
              Previous
            </button>
            <div className="flex items-center">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-dark text-sm font-bold text-white"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                257
              </button>
            </div>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Monthly Growth
            </p>
            <p className="text-lg font-bold text-slate-800">+12.5%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Rate</p>
            <p className="text-lg font-bold text-slate-800">98.2%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Assigned Responders
            </p>
            <p className="text-lg font-bold text-slate-800">42</p>
          </div>
        </div>
      </div>
    </div>
  );
}
