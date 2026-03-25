"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, Eye, EyeOff, Plus, Loader } from "lucide-react";
import PlanForm from "./PlanForm";

export default function PlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/plans");
      const result = await response.json();

      if (result.success) {
        setPlans(result.data);
        setError("");
      } else {
        setError(result.message || "Failed to fetch plans");
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Error loading plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      setDeleting(planId);
      const response = await fetch(`/api/plans/${planId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setPlans((prev) => prev.filter((p) => p._id !== planId));
        setError("");
      } else {
        setError(result.message || "Failed to delete plan");
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      setError("Error deleting plan");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      const response = await fetch(`/api/plans/${plan._id}/status`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (result.success) {
        setPlans((prev) =>
          prev.map((p) =>
            p._id === plan._id ? { ...p, isActive: !p.isActive } : p
          )
        );
        setError("");
      } else {
        setError(result.message || "Failed to toggle plan status");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      setError("Error toggling plan status");
    }
  };

  const handleFormSubmit = (updatedPlan) => {
    if (editingPlan) {
      // Update existing plan
      setPlans((prev) =>
        prev.map((p) => (p._id === updatedPlan._id ? updatedPlan : p))
      );
    } else {
      // Add new plan
      setPlans((prev) => [updatedPlan, ...prev]);
    }
    setShowForm(false);
    setEditingPlan(null);
    fetchPlans(); // Refresh to get latest data
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPlan(null);
  };

  if (showForm) {
    return (
      <PlanForm
        plan={editingPlan}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Plans</h1>
          <p className="text-neutral-600 mt-1">Manage subscription plans</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-lime-500 to-lime-600 text-white font-semibold rounded-lg hover:from-lime-600 hover:to-lime-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Create Plan
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader size={32} className="animate-spin mx-auto mb-2 text-lime-500" />
            <p className="text-neutral-600">Loading plans...</p>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-neutral-600 mb-4">No plans created yet</p>
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus size={18} /> Create First Plan
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan._id}
                  className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {plan.name}
                      </p>
                      {plan.description && (
                        <p className="text-xs text-neutral-600 truncate">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-lime-100 text-lime-700 text-xs font-semibold rounded-full">
                      {plan.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">
                    ₹{plan.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-neutral-700">
                    {plan.duration} days
                  </td>
                  <td className="px-6 py-4 text-neutral-700">
                    <span className="text-sm">{plan.features.length} items</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        plan.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                      }`}
                    >
                      {plan.isActive ? (
                        <>
                          <Eye size={14} /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit plan"
                      >
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        disabled={deleting === plan._id}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete plan"
                      >
                        {deleting === plan._id ? (
                          <Loader size={16} className="animate-spin text-red-600" />
                        ) : (
                          <Trash2 size={16} className="text-red-600" />
                        )}
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
  );
}
