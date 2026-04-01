"use client";

import { useMemo, useState, useEffect } from "react";
import { Download, RefreshCw, Search, Check, X } from "lucide-react";

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

const MailStatusText = ({ value }) => {
  return value ? (
    <span className="text-sm font-semibold text-emerald-700">Yes</span>
  ) : (
    <span className="text-sm font-semibold text-red-600">No</span>
  );
};

export default function SignedUsersSection({ data = [], onRefresh }) {
  const [localUsers, setLocalUsers] = useState(data || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateOfConsent");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [kycDialog, setKycDialog] = useState(null);

  useEffect(() => {
    console.log("[SignedUsersSection] Data received:", data);
    console.log("[SignedUsersSection] Data length:", data?.length || 0);
    setLocalUsers(data || []);
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

      // Update only the changed row locally to avoid table-wide re-render/flicker.
      setLocalUsers((prev) =>
        prev.map((u) =>
          u.userId === userId ? { ...u, [statusType]: value } : u
        )
      );

      setKycDialog(null);
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
      ? localUsers.filter((user) => toSearchText(user).includes(normalizedSearch))
      : [...localUsers];

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
  }, [localUsers, searchTerm, sortBy]);

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
    <div className="space-y-3">
      <div className="sticky top-2 z-20 md:static rounded-2xl border border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/85 p-3 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, mobile, PAN, or service..."
              className="w-full rounded-lg border border-slate-200 px-9 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
            />
          </div>
          <button
            type="button"
            onClick={() => (onRefresh ? onRefresh() : window.location.reload())}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-white text-sm font-semibold hover:bg-emerald-600 transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            type="button"
            onClick={exportSignedUsersCsv}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 font-semibold hover:bg-emerald-100 transition"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-slate-600 text-sm font-medium mr-1">Sort:</span>
          <button
            type="button"
            onClick={() => setSortBy("dateOfConsent")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
              sortBy === "dateOfConsent"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Date
          </button>
          <button
            type="button"
            onClick={() => setSortBy("name")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
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
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
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
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
              sortBy === "serviceName"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Service
          </button>
          <span className="ml-auto text-sm text-slate-600 font-medium px-3 py-1.5 rounded-lg bg-slate-100">
            Total: <span className="font-bold text-slate-900">{filteredAndSortedUsers.length}</span>
          </span>
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
                  {MailStatusText({ value: u?.agreementMailedToUser })}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">MITC Mailed To User</p>
                  {MailStatusText({ value: u?.mitcMailedToUser })}
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
          <table className="w-full min-w-[1900px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Name
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  PAN
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  DOB
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Consent Date
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Email
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Mobile
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  State
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Service
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Agreement Mailed
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  MITC Mailed
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  KYC Updated
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Valid From
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Valid Till
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Renewal
                </th>
                <th className="text-left px-3 py-2.5 text-slate-700 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                  Invoice Mailed
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-slate-100 hover:bg-emerald-50/30 transition"
                >
                  <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                    {u?.name}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 font-mono text-sm whitespace-nowrap">
                    {u?.pan}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap">
                    {u?.dob}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap">
                    {formatDateWithTime(u?.dateOfConsent)}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap truncate">
                    {u?.email}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap">
                    {u?.mobile}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap">
                    {u?.state}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm font-medium whitespace-nowrap">
                    {u?.serviceName}
                  </td>
                  <td className="px-3 py-2.5">
                    {MailStatusText({ value: u?.agreementMailedToUser })}
                  </td>
                  <td className="px-3 py-2.5">
                    {MailStatusText({ value: u?.mitcMailedToUser })}
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setKycDialog({
                          userId: u.userId,
                          name: u?.name || "User",
                          currentValue: Boolean(u?.kycUpdatedByAdmin),
                          selectedValue: Boolean(u?.kycUpdatedByAdmin),
                        })
                      }
                      className="rounded-full"
                    >
                      {StatusBadge({ value: u?.kycUpdatedByAdmin })}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap">
                    {formatDate(u?.validFrom)}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap">
                    {formatDate(u?.validTill)}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-sm whitespace-nowrap">
                    {formatDate(u?.renewalDate)}
                  </td>
                  <td className="px-3 py-2.5">
                    {StatusBadge({ value: u?.invoiceMailedToUser })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {kycDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900">Update KYC Status</h3>
            <p className="mt-1 text-sm text-slate-600">User: {kycDialog.name}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={updatingUserId === kycDialog.userId}
                onClick={() =>
                  updateUserStatus(
                    kycDialog.userId,
                    "kycUpdatedByAdmin",
                    true
                  )
                }
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  kycDialog.selectedValue
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                disabled={updatingUserId === kycDialog.userId}
                onClick={() =>
                  updateUserStatus(
                    kycDialog.userId,
                    "kycUpdatedByAdmin",
                    false
                  )
                }
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  !kycDialog.selectedValue
                    ? "border-rose-300 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                No
              </button>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setKycDialog(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
