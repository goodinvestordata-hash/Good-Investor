"use client";

import { useEffect, useState } from "react";
import { Search, Download } from "lucide-react";

export default function PaymentAuditSection() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    activeCount: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments-audit");
      const data = await res.json();

      if (data.success) {
        setPayments(data.payments || []);
        setFilteredPayments(data.payments || []);
        setStats(data.stats || {});
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.email?.toLowerCase().includes(term) ||
          p.name?.toLowerCase().includes(term) ||
          p.razorpay_payment_id?.includes(term) ||
          p.razorpay_order_id?.includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => {
        const isExpired = new Date(p.expiresAt) < new Date();
        if (statusFilter === "active") return !isExpired;
        if (statusFilter === "expired") return isExpired;
        return true;
      });
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, payments]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const downloadCSV = () => {
    const headers = ["Date", "Customer", "Email", "Phone", "Amount", "Payment ID", "Order ID", "Status"];
    const rows = filteredPayments.map((p) => [
      formatDate(p.paidAt),
      p.name,
      p.email,
      p.phone,
      p.amount,
      p.razorpay_payment_id,
      p.razorpay_order_id,
      isExpired(p.expiresAt) ? "Expired" : "Active",
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-audit-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">
            Payment Audit History
          </h2>
          <p className="text-neutral-600 text-sm">
            Track all payment attempts and subscription purchases
          </p>
        </div>
        <button
          onClick={downloadCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition whitespace-nowrap"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border border-blue-200">
          <p className="text-sm text-neutral-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">
            ₹{stats.totalRevenue?.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-6 border border-green-200">
          <p className="text-sm text-neutral-600 mb-1">Total Transactions</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalTransactions}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-6 border border-purple-200">
          <p className="text-sm text-neutral-600 mb-1">Active Subscriptions</p>
          <p className="text-3xl font-bold text-purple-600">{stats.activeCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by username, email, or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-lime-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "expired", label: "Expired" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === filter.value
                    ? "bg-lime-500 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-neutral-600">
          Showing {paginatedPayments.length} of {filteredPayments.length} payments
        </p>
      </div>

      {/* Payment History Table */}
      <div className="overflow-x-auto border border-neutral-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                DATE
              </th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                CUSTOMER
              </th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                EMAIL
              </th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                PHONE
              </th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                AMOUNT
              </th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                STATUS
              </th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                PAYMENT ID
              </th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                DETAILS
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-neutral-600">
                  No payments found
                </td>
              </tr>
            ) : (
              paginatedPayments.map((payment) => {
                const expired = isExpired(payment.expiresAt);
                return (
                  <tr
                    key={payment._id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition"
                  >
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {formatDate(payment.paidAt)}
                    </td>
                    <td className="py-4 px-4 font-semibold text-neutral-900">
                      {payment.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {payment.email}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {payment.phone}
                    </td>
                    <td className="py-4 px-4 font-semibold text-neutral-900">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          expired
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {expired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-neutral-600">
                      <span title={payment.razorpay_payment_id}>
                        {payment.razorpay_payment_id?.slice(0, 12)}...
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => {
                          alert(`Payment Details:\n\nPayment ID: ${payment.razorpay_payment_id}\nOrder ID: ${payment.razorpay_order_id}\nAmount: ₹${payment.amount}\nPaid At: ${formatDate(payment.paidAt)}\nExpires At: ${formatDate(payment.expiresAt)}`);
                        }}
                        className="inline-block px-3 py-1 text-sm text-lime-600 hover:text-lime-700 font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-lime-500 text-white"
                  : "border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
