"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, Eye, EyeOff, Plus, Loader } from "lucide-react";
import CouponForm from "./CouponForm";

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Fetch coupons on mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/coupons");
      const result = await response.json();

      if (result.success) {
        setCoupons(result.data);
        setError("");
      } else {
        setError(result.message || "Failed to fetch coupons");
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Error loading coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    try {
      setDeleting(couponId);
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== couponId));
        setError("");
      } else {
        setError(result.message || "Failed to delete coupon");
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
      setError("Error deleting coupon");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const response = await fetch(`/api/coupons/${coupon._id}/status`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (result.success) {
        setCoupons((prev) =>
          prev.map((c) =>
            c._id === coupon._id ? { ...c, isActive: !c.isActive } : c
          )
        );
        setError("");
      } else {
        setError(result.message || "Failed to toggle coupon status");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      setError("Error toggling coupon status");
    }
  };

  const handleFormSubmit = (updatedCoupon) => {
    if (editingCoupon) {
      // Update existing coupon
      setCoupons((prev) =>
        prev.map((c) => (c._id === updatedCoupon._id ? updatedCoupon : c))
      );
    } else {
      // Add new coupon
      setCoupons((prev) => [updatedCoupon, ...prev]);
    }
    setShowForm(false);
    setEditingCoupon(null);
    fetchCoupons(); // Refresh to get latest data
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isMaxUsesReached = (coupon) => {
    if (!coupon.maxUses) return false;
    return coupon.usedCount >= coupon.maxUses;
  };

  if (showForm) {
    return (
      <CouponForm
        coupon={editingCoupon}
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
          <h1 className="text-3xl font-bold text-neutral-900">Coupons</h1>
          <p className="text-neutral-600 text-sm mt-1">
            Manage discount coupons and promotional codes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-lime-500 to-lime-600 text-white font-semibold rounded-lg hover:from-lime-600 hover:to-lime-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> Create Coupon
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
            <p className="text-neutral-600">Loading coupons...</p>
          </div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-neutral-600 mb-4">No coupons created yet</p>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition"
          >
            Create First Coupon
          </button>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="border-b border-neutral-200 hover:bg-neutral-50 transition"
                  >
                    {/* Code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          {coupon.code}
                        </span>
                        {isExpired(coupon.expiresAt) && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Expired
                          </span>
                        )}
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {coupon.description}
                        </p>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-neutral-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </span>
                      <span className="text-xs text-neutral-500 ml-2">
                        ({coupon.discountType})
                      </span>
                    </td>

                    {/* Usage */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900">
                        {coupon.usedCount} / {coupon.maxUses || "∞"}
                      </div>
                      {coupon.maxUses && (
                        <div className="w-24 bg-neutral-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full transition ${
                              isMaxUsesReached(coupon)
                                ? "bg-red-500"
                                : "bg-lime-500"
                            }`}
                            style={{
                              width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </td>

                    {/* Expires */}
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString(
                            "en-IN"
                          )
                        : "Never"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 mx-auto ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                        }`}
                      >
                        {coupon.isActive ? (
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

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleEditCoupon(coupon)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit coupon"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          disabled={deleting === coupon._id}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                          title="Delete coupon"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
