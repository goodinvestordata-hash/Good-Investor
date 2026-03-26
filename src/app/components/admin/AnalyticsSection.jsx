"use client";

import { useEffect, useState } from "react";

export default function AnalyticsSection() {
  const [analyticsTab, setAnalyticsTab] = useState("payments");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        setError("Unauthorized");
        return;
      }

      if (!result.success) {
        setError(result.message || "Failed to fetch analytics");
        return;
      }

      setData(result);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 font-bold mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const summary = data.summary;

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-4 bg-white rounded-lg p-2 w-fit border">
        <button
          onClick={() => setAnalyticsTab("payments")}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            analyticsTab === "payments"
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-600 hover:bg-gray-100"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setAnalyticsTab("signups")}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            analyticsTab === "signups"
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-600 hover:bg-gray-100"
          }`}
        >
          Signups
        </button>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchAnalytics}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
      >
        <span>🔄</span> Refresh
      </button>

      {/* PAYMENTS TAB */}
      {analyticsTab === "payments" && (
        <div className="space-y-8">
          {/* Payment Overview Cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
                <p className="text-gray-600 font-medium mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900">
                  ₹{(summary.total_revenue / 100).toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-teal-600 mt-2">All time</p>
              </div>

              {/* This Month Revenue */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 font-medium mb-2">This Month Revenue</p>
                <p className="text-4xl font-bold text-gray-900">
                  ₹{(summary.this_month_revenue / 100).toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-500 mt-2">Current month</p>
              </div>

              {/* Active Subscriptions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 font-medium mb-2">Active Subscriptions</p>
                <p className="text-4xl font-bold text-gray-900">{summary.active_subscriptions}</p>
                <p className="text-sm text-gray-500 mt-2">Not yet expired</p>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Paid Users */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 font-medium mb-2">Paid Users</p>
              <p className="text-4xl font-bold text-gray-900">{summary.paid_users_count}</p>
              <p className="text-sm text-gray-500 mt-2">Unique customers</p>
            </div>

            {/* Renewals */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 font-medium mb-2">Renewals</p>
              <p className="text-4xl font-bold text-gray-900">{summary.renewals}</p>
              <p className="text-sm text-gray-500 mt-2">Repeat purchases</p>
            </div>

            {/* Total Payments */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 font-medium mb-2">Total Transactions</p>
              <p className="text-4xl font-bold text-gray-900">{summary.total_payments}</p>
              <p className="text-sm text-gray-500 mt-2">Payment count</p>
            </div>
          </div>

          {/* Billing Events */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Events</h3>
            <p className="text-gray-600 text-sm mb-4">Subscription activity</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-600 font-bold mb-2">✓ Renewals</div>
                <p className="text-2xl font-bold text-gray-900">{summary.renewals}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-600 font-bold mb-2">↗ Upgrades</div>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-600 font-bold mb-2">↘ Downgrades</div>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Monthly Revenue Details</h3>
            <p className="text-gray-600 text-sm mb-4">Complete revenue and transaction history</p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Revenue</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Transactions</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Unique Users</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthly_revenue_details?.map((month, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">{month.month}</td>
                      <td className="px-6 py-3 text-right text-sm text-gray-900">
                        ₹{(month.revenue / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-gray-900">{month.transactions}</td>
                      <td className="px-6 py-3 text-right text-sm text-gray-900">{month.unique_users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SIGNUPS TAB */}
      {analyticsTab === "signups" && (
        <div className="space-y-8">
          {/* Signup Overview Cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Signup Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Users */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <p className="text-gray-600 font-medium mb-2">Total Users</p>
                <p className="text-4xl font-bold text-gray-900">{summary.total_users}</p>
                <p className="text-sm text-green-600 mt-2">+{summary.new_signups_today} today</p>
              </div>

              {/* New Signups Today */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 font-medium mb-2">New Signups Today</p>
                <p className="text-4xl font-bold text-gray-900">{summary.new_signups_today}</p>
                <p className="text-sm text-gray-500 mt-2">24 hours</p>
              </div>

              {/* Logged In Today */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 font-medium mb-2">Logged In Today</p>
                <p className="text-4xl font-bold text-gray-900">{summary.total_logged_in_today}</p>
                <p className="text-sm text-gray-500 mt-2">Active now</p>
              </div>

              {/* Active Last 30 Days */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 font-medium mb-2">Active Last 30 Days</p>
                <p className="text-4xl font-bold text-gray-900">{summary.active_last_30_days}</p>
                <p className="text-sm text-gray-500 mt-2">Monthly active</p>
              </div>
            </div>
          </div>

          {/* Login Methods */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Login Methods</h3>
            <p className="text-gray-600 text-sm mb-4">Authentication breakdown</p>
            <div className="space-y-3">
              {data.login_method_breakdown?.map((method, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700 font-medium capitalize">{method.method}</span>
                  <span className="text-2xl font-bold text-teal-600">{method.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Login Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Recent Login Activity</h3>
            <p className="text-gray-600 text-sm mb-4">Recent user login events</p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Logged In At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_logins?.map((login, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">{login.email}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{login.name}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                          {login.method}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {new Date(login.timestamp).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
