"use client";

import { useMemo, useState } from "react";
import { Download, RefreshCw, Search, UserRound, Mail, Phone, IdCard, Calendar, CircleCheck } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toSearchText = (user) =>
  [
    user?.fullName,
    user?.username,
    user?.email,
    user?.phone,
    user?.panNumber,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export default function UsersSection({ data = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("joined");

  const filteredAndSortedUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = normalizedSearch
      ? data.filter((user) => toSearchText(user).includes(normalizedSearch))
      : [...data];

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        const aName = String(a?.fullName || a?.username || "").toLowerCase();
        const bName = String(b?.fullName || b?.username || "").toLowerCase();
        return aName.localeCompare(bName);
      }

      if (sortBy === "email") {
        const aEmail = String(a?.email || "").toLowerCase();
        const bEmail = String(b?.email || "").toLowerCase();
        return aEmail.localeCompare(bEmail);
      }

      // Default: newest first
      const aDate = new Date(a?.createdAt || 0).getTime();
      const bDate = new Date(b?.createdAt || 0).getTime();
      return bDate - aDate;
    });

    return filtered;
  }, [data, searchTerm, sortBy]);

  const exportUsersCsv = () => {
    const headers = [
      "Name",
      "Username",
      "Email",
      "Phone",
      "PAN Card",
      "Status",
      "Role",
      "Joined",
      "User ID",
    ];

    const rows = filteredAndSortedUsers.map((u) => [
      u?.fullName || "",
      u?.username || "",
      u?.email || "",
      u?.phone || "",
      u?.panNumber || "",
      u?.emailVerified ? "Verified" : "Pending",
      u?.role || "user",
      formatDate(u?.createdAt),
      u?._id || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No users found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Users Management</h2>
          <p className="text-base text-slate-500 mt-1">Total Users: {filteredAndSortedUsers.length}</p>
        </div>
        <button
          onClick={() => (onRefresh ? onRefresh() : window.location.reload())}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-white font-semibold hover:bg-emerald-600 transition shadow-sm hover:shadow-md"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="sticky top-2 z-20 md:static rounded-2xl border border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/85 p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, username, mobile, or PAN..."
              className="w-full rounded-xl border border-slate-200 px-12 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
            />
          </div>
          <button
            onClick={exportUsersCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-emerald-700 font-semibold hover:bg-emerald-100 transition"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-600 font-medium mr-1">Sort by:</span>
          <button
            onClick={() => setSortBy("joined")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "joined"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Date Joined
          </button>
          <button
            onClick={() => setSortBy("name")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "name"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Name
          </button>
          <button
            onClick={() => setSortBy("email")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "email"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Email
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="md:hidden p-4 space-y-4 bg-slate-50/50">
          {filteredAndSortedUsers.map((u) => {
            const displayName = u?.fullName || u?.username || "Unknown User";
            const displayUsername = u?.username ? `@${u.username}` : "@na";

            return (
              <div key={u._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-100 to-lime-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <UserRound className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{displayName}</p>
                      <p className="text-slate-500 text-sm truncate">{displayUsername}</p>
                    </div>
                  </div>
                  {u?.emailVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 text-xs font-semibold">
                      <CircleCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-amber-700 text-xs font-semibold">
                      <CircleCheck className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-700">
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {u?.email || "N/A"}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {u?.phone || "N/A"}</p>
                  <p className="flex items-center gap-2 uppercase tracking-wide"><IdCard className="w-4 h-4 text-slate-400" /> {u?.panNumber || "Not Provided"}</p>
                  <p className="flex items-center gap-2 text-slate-500"><Calendar className="w-4 h-4 text-slate-400" /> {formatDate(u?.createdAt)}</p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    ID: {String(u?._id || "").slice(-6)}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      u?.panVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {u?.panVerified ? "PAN Verified" : "PAN Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-275">
            <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-blue-900 font-bold">User Info</th>
                <th className="text-left px-6 py-4 text-blue-900 font-bold">Contact</th>
                <th className="text-left px-6 py-4 text-blue-900 font-bold">PAN Card</th>
                <th className="text-left px-6 py-4 text-blue-900 font-bold">Status</th>
                <th className="text-left px-6 py-4 text-blue-900 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((u) => {
                const displayName = u?.fullName || u?.username || "Unknown User";
                const displayUsername = u?.username ? `@${u.username}` : "@na";

                return (
                  <tr
                    key={u._id}
                    className="border-b border-slate-200 hover:bg-emerald-50/40 transition"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-linear-to-br from-emerald-100 to-lime-100 text-emerald-700 flex items-center justify-center">
                          <UserRound className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-2base">{displayName}</p>
                          <p className="text-slate-500">{displayUsername}</p>
                          <span className="inline-flex mt-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                            ID: {String(u?._id || "").slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <p className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {u?.email || "N/A"}
                        </p>
                        <p className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {u?.phone || "N/A"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="flex items-center gap-2 font-semibold text-slate-700 uppercase tracking-wide">
                        <IdCard className="w-4 h-4 text-slate-400" />
                        {u?.panNumber || "Not Provided"}
                      </p>
                      <p className="mt-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            u?.panVerified
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {u?.panVerified ? "PAN Verified" : "PAN Pending"}
                        </span>
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      {u?.emailVerified ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700 font-semibold">
                          <CircleCheck className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-amber-700 font-semibold">
                          <CircleCheck className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <p className="inline-flex items-center gap-2 text-slate-500">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(u?.createdAt)}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
