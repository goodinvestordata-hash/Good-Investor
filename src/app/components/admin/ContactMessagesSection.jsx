"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, RefreshCw, Trash2, MailOpen, Mail } from "lucide-react";

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncateText = (value, max = 18) => {
  const text = String(value || "");
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
};

export default function ContactMessagesSection({ onUnreadCountChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [stats, setStats] = useState({ unreadCount: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMessages = async (nextPage = page, nextSearch = search, nextStatus = status) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(nextPage),
        limit: "10",
        search: nextSearch,
        status: nextStatus,
      });

      const response = await fetch(`/api/admin/contact-messages?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Failed to load contact messages");
        return;
      }

      setMessages(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setStats(result.stats || { unreadCount: 0 });
      if (typeof onUnreadCountChange === "function") {
        onUnreadCountChange(result.stats?.unreadCount || 0);
      }
    } catch {
      setError("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  useEffect(() => {
    fetchMessages(page, debouncedSearch, status);
  }, [page, debouncedSearch, status]);

  const handleToggleRead = async (messageId, isRead) => {
    try {
      setActionLoading(messageId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/contact-messages/${encodeURIComponent(messageId)}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isRead: !isRead }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Failed to update message status");
        return;
      }

      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, isRead: !isRead } : m))
      );
      setStats((prev) => ({
        ...prev,
        unreadCount: !isRead
          ? Math.max((prev.unreadCount || 0) - 1, 0)
          : (prev.unreadCount || 0) + 1,
      }));
      setSuccess(result.message || "Status updated successfully");
      fetchMessages(page, debouncedSearch, status);
    } catch {
      setError("Failed to update message status");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (messageId) => {
    try {
      setActionLoading(messageId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/contact-messages/${encodeURIComponent(messageId)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Failed to delete message");
        return;
      }

      const removed = messages.find((m) => m._id === messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      setPagination((prev) => ({
        ...prev,
        total: Math.max((prev.total || 1) - 1, 0),
      }));
      if (removed && !removed.isRead) {
        setStats((prev) => ({
          ...prev,
          unreadCount: Math.max((prev.unreadCount || 0) - 1, 0),
        }));
      }
      setSuccess(result.message || "Message deleted successfully");
      fetchMessages(page, debouncedSearch, status);
    } catch {
      setError("Failed to delete message");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Contact Messages</h2>
          <p className="text-slate-600 text-sm mt-1">
            Unread: <span className="font-semibold">{stats.unreadCount || 0}</span>
          </p>
        </div>
        <button
          onClick={() => fetchMessages(page, debouncedSearch, status)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-white font-semibold hover:bg-emerald-600 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">
          {success}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-lg border border-slate-200 px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Loading contact messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">No contact messages found</p>
            <p className="text-sm">Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-275">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Reference ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Client IP</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Message</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr
                    key={m._id}
                    className={`border-b border-slate-100 hover:bg-slate-50/70 ${
                      m.isRead ? "" : "bg-amber-50/40"
                    }`}
                  >
                    <td className="px-4 py-3 text-xs text-slate-700 font-mono" title={m.referenceId || "N/A"}>
                      {truncateText(m.referenceId || "N/A", 16)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{m.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{m.phone}</td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-mono" title={m.clientIp || "N/A"}>
                      {truncateText(m.clientIp || "N/A", 22)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 max-w-[320px]">
                      <p className="line-clamp-3 whitespace-pre-wrap">{m.message}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(m.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          m.isRead
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {m.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(m._id, m.isRead)}
                          disabled={actionLoading === m._id}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                          {m.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                          {m.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          disabled={actionLoading === m._id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-600">
          Page {pagination.page} of {pagination.totalPages} | Total: {pagination.total}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrevPage || loading}
            className="px-3 py-1.5 rounded border border-slate-200 text-sm disabled:opacity-50 hover:bg-slate-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!pagination.hasNextPage || loading}
            className="px-3 py-1.5 rounded border border-slate-200 text-sm disabled:opacity-50 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
