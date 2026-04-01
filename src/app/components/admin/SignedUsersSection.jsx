"use client";

import { useMemo, useState, useEffect } from "react";
import { Download, RefreshCw, Search, Check, X, Edit2 } from "lucide-react";

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

const formatDateWithTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toSearchText = (user) =>
  [user?.name, user?.email, user?.mobile, user?.pan, user?.serviceName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const ClickableStatusBadge = ({ value, label, onToggle, loading }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold cursor-pointer transition hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      style={
        value
          ? {
              backgroundColor: "#dcfce7",
              color: "#16a34a",
              borderColor: "#bbf7d0",
            }
          : {
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              borderColor: "#fecaca",
            }
      }
    >
      {value ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {label || (value ? "Yes" : "No")}
    </button>
  );
};

const StatusBadge = ({ value, label }) => {
  return value ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700 font-semibold text-sm">
      <Check className="w-4 h-4" /> {label || "Yes"}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-red-700 font-semibold text-sm">
      <X className="w-4 h-4" /> No
    </span>
  );
};

export default function SignedUsersSection({ data = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateOfConsent");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    console.log("[SignedUsersSection] Data received:", data);
    console.log("[SignedUsersSection] Data length:", data?.length || 0);
  }, [data]);

  const updateUserStatus = async (userId, statusType, value) => {
    setUpdatingUserId(userId);
    try {
      const updatePayload = {};
      updatePayload[statusType] = value;

      const response = await fetch("/api/admin/signed-users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updatePayload }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local data
      const updatedData = data.map((u) =>
        u.userId === userId ? { ...u, [statusType.replace("Mailed", "Mailed")]: value } : u
      );

      // Call onRefresh to reload data
      if (onRefresh) {
        onRefresh();
      }

      setEditingRow(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = normalizedSearch
      ? data.filter((user) => toSearchText(user).includes(normalizedSearch))
      : [...data];

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return String(a?.name || "").localeCompare(String(b?.name || ""));
      }

      if (sortBy === "email") {
        return String(a?.email || "").localeCompare(String(b?.email || ""));
      }

      if (sortBy === "serviceName") {
        return String(a?.serviceName || "").localeCompare(String(b?.serviceName || ""));
      }

      // Default: newest consent date first
      const aDate = new Date(a?.dateOfConsent || 0).getTime();
      const bDate = new Date(b?.dateOfConsent || 0).getTime();
      return bDate - aDate;
    });

    return filtered;
  }, [data, searchTerm, sortBy]);

  const exportSignedUsersCsv = () => {
    const headers = [
      "Name",
      "PAN",
      "DOB",
      "Date of Consent",
      "Email",
      "Mobile",
      "State",
      "Service Name",
      "Agreement Mailed To User",
      "MITC Mailed To User",
      "KYC Updated By Admin",
      "Valid From",
      "Valid Till",
      "Renewal Date",
      "Invoice Mailed To User",
    ];

    const rows = filteredAndSortedUsers.map((u) => [
      u?.name || "",
      u?.pan || "",
      u?.dob || "",
      formatDate(u?.dateOfConsent),
      u?.email || "",
      u?.mobile || "",
      u?.state || "",
      u?.serviceName || "",
      u?.agreementMailedToUser ? "Yes" : "No",
      u?.mitcMailedToUser ? "Yes" : "No",
      u?.kycUpdatedByAdmin ? "Yes" : "No",
      formatDate(u?.validFrom),
      formatDate(u?.validTill),
      formatDate(u?.renewalDate),
      u?.invoiceMailedToUser ? "Yes" : "No",
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
    link.download = `signed-users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
          <p className="text-lg font-semibold">No signed users found</p>
          <p className="text-sm mt-2 text-gray-500">
            There are no signed agreements in the system yet.
          </p>
          <button
            type="button"
            onClick={() => (onRefresh ? onRefresh() : window.location.reload())}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
       
        <button
          type="button"
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
              placeholder="Search by name, email, mobile, PAN, or service..."
              className="w-full rounded-xl border border-slate-200 px-12 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
            />
          </div>
          <button
            type="button"
            onClick={exportSignedUsersCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-emerald-700 font-semibold hover:bg-emerald-100 transition"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-600 font-medium mr-1">Sort by:</span>
          <button
            type="button"
            onClick={() => setSortBy("dateOfConsent")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "dateOfConsent"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Consent Date
          </button>
          <button
            type="button"
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
            type="button"
            onClick={() => setSortBy("email")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "email"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setSortBy("serviceName")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "serviceName"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Service
          </button>
        </div>
      </div>

      {/* Table Container with overflow-x-auto */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4 bg-slate-50/50">
          {filteredAndSortedUsers.map((u) => (
            <div key={u._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4">
                <p className="font-bold text-lg text-slate-900">{u?.name}</p>
                <p className="text-sm text-slate-500">{u?.email}</p>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">PAN:</span> {u?.pan}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">DOB:</span> {u?.dob}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Mobile:</span> {u?.mobile}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">State:</span> {u?.state}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Service:</span> {u?.serviceName}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Consent Date:</span>{" "}
                  {formatDate(u?.dateOfConsent)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Valid From:</span>{" "}
                  {formatDate(u?.validFrom)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Valid Till:</span>{" "}
                  {formatDate(u?.validTill)}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Agreement Mailed To User</p>
                  {StatusBadge({ value: u?.agreementMailedToUser })}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">MITC Mailed To User</p>
                  {StatusBadge({ value: u?.mitcMailedToUser })}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">KYC Updated By Admin</p>
                  {StatusBadge({ value: u?.kycUpdatedByAdmin })}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Invoice Mailed To User</p>
                  {StatusBadge({ value: u?.invoiceMailedToUser })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View with horizontal scroll container */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full min-w-[1900px]">
            <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Name
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  PAN
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  DOB
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Date of Consent
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Email
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Mobile
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  State
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Service Name
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Agreement Mailed To User
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  MITC Mailed To User
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  KYC Updated By Admin
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Valid From
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Valid Till
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Renewal Date
                </th>
                <th className="text-left px-4 py-4 text-blue-900 font-bold whitespace-nowrap">
                  Invoice Mailed To User
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-slate-200 hover:bg-emerald-50/40 transition"
                >
                  <td className="px-4 py-5 font-semibold text-slate-900 whitespace-nowrap">
                    {u?.name}
                  </td>
                  <td className="px-4 py-5 text-slate-700 font-mono text-sm whitespace-nowrap">
                    {u?.pan}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap">
                    {u?.dob}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap">
                    {formatDateWithTime(u?.dateOfConsent)}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap text-sm">
                    {u?.email}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap">
                    {u?.mobile}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap">
                    {u?.state}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap font-medium">
                    {u?.serviceName}
                  </td>
                  <td className="px-4 py-5">
                    <ClickableStatusBadge
                      value={u?.agreementMailedToUser}
                      label="Yes"
                      loading={updatingUserId === u.userId}
                      onToggle={() =>
                        updateUserStatus(
                          u.userId,
                          "agreementMailedToUser",
                          !u?.agreementMailedToUser
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-5">
                    <ClickableStatusBadge
                      value={u?.mitcMailedToUser}
                      label="Yes"
                      loading={updatingUserId === u.userId}
                      onToggle={() =>
                        updateUserStatus(u.userId, "mitcMailedToUser", !u?.mitcMailedToUser)
                      }
                    />
                  </td>
                  <td className="px-4 py-5">
                    <ClickableStatusBadge
                      value={u?.kycUpdatedByAdmin}
                      label="Yes"
                      loading={updatingUserId === u.userId}
                      onToggle={() =>
                        updateUserStatus(u.userId, "kycUpdatedByAdmin", !u?.kycUpdatedByAdmin)
                      }
                    />
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap">
                    {formatDate(u?.validFrom)}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap">
                    {formatDate(u?.validTill)}
                  </td>
                  <td className="px-4 py-5 text-slate-700 whitespace-nowrap">
                    {formatDate(u?.renewalDate)}
                  </td>
                  <td className="px-4 py-5">
                    <ClickableStatusBadge
                      value={u?.invoiceMailedToUser}
                      label="Yes"
                      loading={updatingUserId === u.userId}
                      onToggle={() =>
                        updateUserStatus(
                          u.userId,
                          "invoiceMailedToUser",
                          !u?.invoiceMailedToUser
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
