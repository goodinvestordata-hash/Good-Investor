"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminSubscriptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, expired

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchAllPayments();
  }, [user, loading]);

  const fetchAllPayments = async () => {
    try {
      setPageLoading(true);
      const res = await fetch("/api/admin/payments");
      const data = await res.json();

      if (data.success) {
        setPayments(data.payments || []);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load subscriptions");
    } finally {
      setPageLoading(false);
    }
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getDaysRemaining = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const filteredPayments = payments.filter((p) => {
    if (filter === "active") return !isExpired(p.expiresAt);
    if (filter === "expired") return isExpired(p.expiresAt);
    return true;
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const activeCount = payments.filter((p) => !isExpired(p.expiresAt)).length;
  const expiredCount = payments.filter((p) => isExpired(p.expiresAt)).length;

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Subscriptions Management
          </h1>
          <p className="text-neutral-600">
            Monitor all user subscriptions and payments
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border border-blue-200">
            <p className="text-sm text-neutral-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-neutral-600 mb-1">Active Plans</p>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-6 border border-orange-200">
            <p className="text-sm text-neutral-600 mb-1">Expired Plans</p>
            <p className="text-3xl font-bold text-orange-600">{expiredCount}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-6 border border-purple-200">
            <p className="text-sm text-neutral-600 mb-1">Total Payments</p>
            <p className="text-3xl font-bold text-purple-600">
              {payments.length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200">
          {[
            { value: "all", label: "All Subscriptions" },
            { value: "active", label: "Active" },
            { value: "expired", label: "Expired" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 font-semibold transition border-b-2 ${
                filter === tab.value
                  ? "border-lime-500 text-lime-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subscriptions Table */}
        {filteredPayments.length === 0 ? (
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-8 text-center">
            <p className="text-neutral-600">No {filter} subscriptions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Paid Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Expires
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                    Days Left
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const expired = isExpired(payment.expiresAt);
                  const daysLeft = getDaysRemaining(payment.expiresAt);

                  return (
                    <tr
                      key={payment._id}
                      className="border-b border-neutral-100 hover:bg-neutral-50 transition"
                    >
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
                      <td className="py-4 px-4 text-neutral-600">
                        {new Date(payment.paidAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-4 px-4 text-neutral-600">
                        {new Date(payment.expiresAt).toLocaleDateString("en-IN")}
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
                      <td className="py-4 px-4 font-semibold">
                        {expired ? (
                          <span className="text-red-600">Expired</span>
                        ) : (
                          <span className="text-green-600">{daysLeft} days</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
