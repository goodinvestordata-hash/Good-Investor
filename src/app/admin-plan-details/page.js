"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPlanDetailsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchData();
  }, [user, loading]);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      
      // Fetch plans
      const plansRes = await fetch("/api/plans");
      const plansData = await plansRes.json();
      
      // Fetch payments
      const paymentsRes = await fetch("/api/admin/payments-audit");
      const paymentsData = await paymentsRes.json();

      if (plansData.success && paymentsData.success) {
        setPlans(plansData.plans || []);
        setPayments(paymentsData.payments || []);
      } else {
        setError("Failed to load data");
      }
    } catch (err) {
      setError("Failed to load plans and payments");
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const getPlanPurchases = (planId) => {
    // This is a simple implementation - in production you'd want to track plan ID in Payment model
    return [];
  };

  const getTotalRevenueByPlan = (planName) => {
    return payments
      .filter((p) => true) // Filter logic would depend on tracking plan in Payment model
      .reduce((sum, p) => sum + p.amount, 0);
  };

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
            Plan Details & Analytics
          </h1>
          <p className="text-neutral-600">
            View detailed plan information and user purchases
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Plans with Details */}
        <div className="space-y-4">
          {plans.length === 0 ? (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-8 text-center">
              <p className="text-neutral-600 mb-4">No plans created yet</p>
              <a
                href="/admin-plans"
                className="inline-block px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition"
              >
                Create First Plan
              </a>
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan._id}
                className="border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {/* Plan Header */}
                <div
                  onClick={() =>
                    setExpandedPlan(expandedPlan === plan._id ? null : plan._id)
                  }
                  className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-6 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex gap-4 text-sm text-neutral-600">
                      <span>Type: <b>{plan.type}</b></span>
                      <span>Duration: <b>{plan.duration} days</b></span>
                      <span>Price: <b>₹{plan.price.toLocaleString("en-IN")}</b></span>
                      <span>
                        Status:{" "}
                        <b>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${
                              plan.isActive ? "bg-green-500" : "bg-gray-500"
                            }`}
                          >
                            {plan.isActive ? "Active" : "Inactive"}
                          </span>
                        </b>
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-400">
                    {expandedPlan === plan._id ? "−" : "+"}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPlan === plan._id && (
                  <div className="border-t border-neutral-200 p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-2">
                          Description
                        </h4>
                        <p className="text-neutral-600">
                          {plan.description || "No description"}
                        </p>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-2">
                          Features ({plan.features.length})
                        </h4>
                        <ul className="space-y-1">
                          {plan.features.slice(0, 5).map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-neutral-600 flex items-start gap-2"
                            >
                              <span className="text-lime-500 mt-1">•</span>
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 5 && (
                            <li className="text-sm text-neutral-500 italic">
                              +{plan.features.length - 5} more features
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex gap-2 pt-4 border-t border-neutral-200">
                      <a
                        href={`/admin-plans?edit=${plan._id}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this plan?"
                            )
                          ) {
                            fetch(`/api/plans/${plan._id}`, { method: "DELETE" }).then(
                              () => {
                                setPlans(
                                  plans.filter((p) => p._id !== plan._id)
                                );
                              }
                            );
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          fetch(`/api/plans/${plan._id}/status`, {
                            method: "PATCH",
                          }).then(() => {
                            setPlans(
                              plans.map((p) =>
                                p._id === plan._id
                                  ? { ...p, isActive: !p.isActive }
                                  : p
                              )
                            );
                          });
                        }}
                        className={`px-4 py-2 rounded text-white transition ${
                          plan.isActive
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
