import React, { useState, useEffect } from "react";

export default function PaymentForm({ onPaymentComplete, onBack }) {
  const FIXED_AMOUNT = 4399;
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // ...existing code...
  const [verifyData, setVerifyData] = useState(null);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {};
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: FIXED_AMOUNT }),
      });
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("Server error: " + text.substring(0, 100));
      }
      if (!data.order) throw new Error(data.error || "Order creation failed");
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
          // Send user details along with payment verification
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                name: form.name,
                email: form.email,
                phone: form.phone,
                amount: FIXED_AMOUNT,
              }),
            });
            let vData;
            const verifyContentType = verifyRes.headers.get("content-type");
            if (
              verifyContentType &&
              verifyContentType.includes("application/json")
            ) {
              vData = await verifyRes.json();
            } else {
              const text = await verifyRes.text();
              throw new Error("Server error: " + text.substring(0, 100));
            }
            if (vData.success) {
              setSuccess(true);
              setVerifyData({ ...response, ...vData });
              if (onPaymentComplete)
                onPaymentComplete({
                  ...vData,
                  expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });
            } else {
              setVerifyData(null);
              setError(vData.error || "Payment verification failed");
            }
          } catch (err) {
            setError(err.message);
          }
        },
      };
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          setError(response.error.description || "Payment failed");
        });
        rzp.open();
      } else {
        setError("Razorpay SDK not loaded");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (success || error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {success ? (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Payment Successful!
            </h2>
            <p className="text-lg">Thank you for your payment.</p>
            <button
              className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${verifyData ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              disabled={!verifyData}
              onClick={async () => {
                if (verifyData) {
                  const params = new URLSearchParams({
                    payment_id: verifyData.razorpay_payment_id,
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    amount: FIXED_AMOUNT.toString(),
                  });
                  const response = await fetch(
                    `/api/payment/invoice?${params.toString()}`,
                  );
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `invoice-${verifyData.razorpay_payment_id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }
              }}
            >
              {verifyData ? "Download Invoice" : "Generating invoice..."}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Payment Failed
            </h2>
            <p className="text-lg">
              {error || "Payment was not successful. Please try again."}
            </p>
          </>
        )}
        <button
          onClick={onBack}
          className="mt-6 px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handlePayment}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Payment Form</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Amount (INR)</label>
          <input
            type="number"
            value={FIXED_AMOUNT}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Processing..." : "Continue with Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
