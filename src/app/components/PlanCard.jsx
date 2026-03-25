"use client";

import { useState } from "react";
import { Heart, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import BuyNowModal from "@/app/components/buy/BuyNowModal";

export default function PlanCard({ plan }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Open the modal - same flow as existing services
    setShowModal(true);
  };

  return (
    <>
      <div
        className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-lime-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background gradient effect on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-lime-50/0 to-lime-100/20 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="relative h-full p-6 sm:p-8 flex flex-col">
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-lime-100 text-lime-700 rounded-full">
              {plan.type}
            </span>
            {isHovered && (
              <button className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                <Heart size={16} className="text-neutral-600" />
              </button>
            )}
          </div>

          {/* Plan name */}
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            {plan.name}
          </h3>

          {/* Description */}
          {plan.description && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
              {plan.description}
            </p>
          )}

        {/* Price section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-neutral-900">
              ₹{plan.price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-neutral-600">
              for {plan.duration === 30 ? "1 month" : plan.duration === 365 ? "1 year" : `${plan.duration} days`}
            </span>
          </div>
        </div>

        {/* Features list */}
        <div className="flex-grow mb-6">
          <p className="text-xs uppercase font-semibold text-neutral-500 mb-3">
            Includes:
          </p>
          <ul className="space-y-2">
            {plan.features.slice(0, 5).map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-neutral-700"
              >
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-lime-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {plan.features.length > 5 && (
              <li className="text-sm text-neutral-600 italic pt-1">
                +{plan.features.length - 5} more features
              </li>
            )}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleBuyNow}
          className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-lime-500 to-lime-600 text-white font-semibold rounded-xl hover:from-lime-600 hover:to-lime-700 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Buy Now
          <ChevronRight
            size={18}
            className="transition-transform group-hover/btn:translate-x-1"
          />
        </button>

        {/* Duration info */}
        <p className="text-xs text-neutral-500 text-center mt-3">
          Valid for {plan.duration} days
        </p>
      </div>
    </div>

    {/* Modal with same flow as existing services */}
    {showModal && (
      <BuyNowModal
        onClose={() => setShowModal(false)}
        planData={{ planId: plan._id, planName: plan.name, price: plan.price }}
      />
    )}
  </>
  );
}
