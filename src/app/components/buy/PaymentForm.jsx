import React, { useState, useEffect } from "react";

export default function PaymentForm({ onPaymentComplete, onBack, planData }) {
  // ✅ Plans
  const PLANS = [
    { id: "monthly", name: "Monthly", price: 4500 },
    { id: "quarterly", name: "Quarterly", price: 9999 },
    { id: "halfYearly", name: "Half Yearly", price: 17999 },
    { id: "yearly", name: "Yearly", price: 29999 },
  ];

  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verifyData, setVerifyData] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const selectedAmount = PLANS.find((p) => p.id === selectedPlan)?.price || 0;

  // ✅ Load Razorpay SDK
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Coupon Verification Handler
  const handleVerifyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    setAppliedCoupon(null);

    try {
      const response = await fetch("/api/coupons");
      const result = await response.json();

      if (result.success) {
        const coupon = result.data.find(
          (c) => c.code === couponCode.toUpperCase() && c.isActive
        );

        if (!coupon) {
          setCouponError("Invalid or inactive coupon code");
          return;
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          setCouponError("This coupon has expired");
          return;
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          setCouponError("This coupon has reached its usage limit");
          return;
        }

        setAppliedCoupon(coupon);
        setCouponError("");
      } else {
        setCouponError("Could not verify coupon. Please try again.");
      }
    } catch (err) {
      console.error("Coupon verification error:", err);
      setCouponError("Error verifying coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  // ✅ Calculate Discount
  let discountAmount = 0;
  let finalAmount = selectedAmount;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (selectedAmount * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    finalAmount = Math.max(0, selectedAmount - discountAmount);
  }

  // ✅ Payment Handler
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: finalAmount,
          ...(appliedCoupon && { couponCode: appliedCoupon.code }),
        }),
      });

      const data = await res.json();
      if (!data.order) throw new Error(data.error || "Order failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: form.name,
        order_id: data.order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },

        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                ...form,
                amount: finalAmount,
                ...(appliedCoupon && { couponCode: appliedCoupon.code }),
              }),
            });

            const vData = await verifyRes.json();

            if (vData.success) {
              setSuccess(true);
              setVerifyData({ ...response, ...vData });

              if (onPaymentComplete) {
                onPaymentComplete({
                  ...vData,
                  expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });
              }
            } else {
              setError(vData.error || "Verification failed");
            }
          } catch (err) {
            setError(err.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        setError(response.error.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ✅ Success / Failure Screen
  if (success || error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {success ? (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Payment Successful!
            </h2>
            <p>Thank you for your payment.</p>

            <button
              disabled={!verifyData}
              className={`mt-4 px-6 py-2 rounded-lg ${
                verifyData
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
              onClick={async () => {
                const params = new URLSearchParams({
                  payment_id: verifyData.razorpay_payment_id,
                  ...form,
                  amount: finalAmount.toString(),
                  service:
                    PLANS.find((p) => p.id === selectedPlan)?.name || "Service",
                  qty: "1",
                });

                const res = await fetch(
                  `/api/payment/invoice?${params.toString()}`,
                );

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = `invoice-${verifyData.razorpay_payment_id}.pdf`;
                link.click();
              }}
            >
              Download Invoice
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Payment Failed
            </h2>
            <p>{error}</p>
          </>
        )}

        <button onClick={onBack} className="mt-6 px-6 py-2 border rounded">
          Back
        </button>
      </div>
    );
  }

  // ✅ Main Form
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-100 via-white to-indigo-50 px-4">
      <form
        onSubmit={handlePayment}
        className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Secure Payment
        </h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* 🔥 Plan Selector */}
        <div className="mt-8">
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Choose Your Plan
          </label>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`min-w-40 cursor-pointer rounded-xl p-5 text-center transition-all duration-300 border
              ${
                selectedPlan === plan.id
                  ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                  : "bg-white hover:shadow-md border-gray-200"
              }`}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="text-lg font-bold mt-1">₹{plan.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mt-6">
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Amount (INR)
          </label>
          {appliedCoupon ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Base Price:</span>
                <span className="font-semibold">₹{selectedAmount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-lime-50 rounded-lg border border-lime-200">
                <span className="text-lime-700 font-semibold">
                  Discount ({appliedCoupon.code}):
                </span>
                <span className="font-bold text-lime-700">
                  -₹{discountAmount.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-lime-100 to-lime-50 rounded-lg border-2 border-lime-400">
                <span className="text-lg font-bold text-lime-900">
                  Final Amount:
                </span>
                <span className="text-2xl font-bold text-lime-600">
                  ₹{finalAmount}
                </span>
              </div>
            </div>
          ) : (
            <input
              value={selectedAmount}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 font-semibold"
            />
          )}
        </div>

        {/* Coupon Section */}
        <div className="mt-8">
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Have a Coupon Code? (Optional)
          </label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-300 rounded-lg">
              <div>
                <p className="font-semibold text-green-900">✓ Coupon Applied</p>
                <p className="text-sm text-green-700 mt-1">
                  Code: <span className="font-mono font-bold">{appliedCoupon.code}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponCode("");
                  setCouponError("");
                }}
                className="text-green-700 hover:text-green-900 font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-lime-400 outline-none transition font-mono uppercase"
                disabled={couponLoading}
              />
              <button
                type="button"
                onClick={handleVerifyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="px-6 py-2 bg-lime-500 text-white font-semibold rounded-lg hover:bg-lime-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {couponLoading ? "Checking..." : "Apply"}
              </button>
            </div>
          )}
          {couponError && (
            <p className="mt-2 text-sm text-red-600 font-medium">{couponError}</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 text-red-500 text-center font-medium">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-1/3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-2/3 py-2 rounded-lg text-white font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition shadow-md"
          >
            {loading ? "Processing..." : "Continue with Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
