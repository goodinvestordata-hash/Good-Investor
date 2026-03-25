"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import PlanCard from "./PlanCard";

/**
 * PlansSection Component
 * Displays all active plans in a responsive grid
 * Ready to be integrated into /services page or standalone
 */
export default function PlansSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
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

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="animate-spin mx-auto mb-4 text-lime-500" />
          <p className="text-neutral-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="py-20">
        <div className="bg-neutral-50 border border-neutral-200 text-neutral-600 p-6 rounded-lg text-center">
          No plans available at the moment. Please check back later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 sm:py-20">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          Select the perfect subscription plan tailored to your trading needs. Unlock premium insights and strategies.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan._id} plan={plan} />
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-16 sm:mt-20 bg-gradient-to-r from-lime-50 to-neutral-50 border border-lime-200 rounded-2xl p-8 sm:p-12 text-center">
        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
          Need Help Choosing?
        </h3>
        <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
          Our trading experts can help you select the plan that best matches your investment profile and goals.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition-colors"
        >
          Contact Our Team
        </a>
      </div>
    </div>
  );
}
