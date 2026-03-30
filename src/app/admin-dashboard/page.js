"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UsersSection from "../components/admin/UsersSection";
import PaymentsSection from "../components/admin/PaymentsSection";
import AgreementsSection from "../components/admin/AgreementsSection";
import SignedAgreementsSection from "../components/admin/SignedAgreementsSection";
import DocumentsSection from "../components/admin/DocumentsSection";
import RiskProfilesSection from "../components/admin/RiskProfilesSection";
import AnalyticsSection from "../components/admin/AnalyticsSection";
import PlansSection from "../components/admin/PlansSection";
import SubscriptionsSection from "../components/admin/SubscriptionsSection";
import PaymentAuditSection from "../components/admin/PaymentAuditSection";
import CouponSection from "../components/admin/CouponSection";

const COLLECTIONS = [
  { key: "users", label: "Users", icon: "👥" },
  { key: "payments", label: "Payments", icon: "💳" },
  { key: "agreements", label: "Agreements", icon: "📄" },
  { key: "signedAgreements", label: "Signed Agreements", icon: "✍️" },
  { key: "documents", label: "Documents", icon: "📑" },
  { key: "riskprofiles", label: "Risk Profiles", icon: "📊" },
  { key: "analytics", label: "Admin Analytics", icon: "📈" },
  { key: "plans", label: "Create Plan", icon: "🎯" },
  { key: "coupons", label: "Coupons", icon: "🎟️" },
  { key: "subscriptions", label: "My Subscriptions", icon: "🔄" },
  { key: "paymentAudit", label: "Admin Audit History", icon: "🔍" },
];

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState("users");
  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    users: [],
    payments: [],
    agreements: [],
    signedAgreements: [],
    documents: [],
    riskprofiles: [],
  });

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const expiry = new Date(date);
    const now = new Date();
    const diff = (expiry - now) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  useEffect(() => {
    async function fetchAllData() {
      setLoadingData(true);
      try {
        const [
          usersRes,
          paymentsRes,
          agreementsRes,
          signedAgreementsRes,
          documentsRes,
          riskProfilesRes,
        ] = await Promise.all([
          fetch("/api/admin/users").then((r) => r.json()),
          fetch("/api/admin/payments").then((r) => r.json()),
          fetch("/api/admin/agreements").then((r) => r.json()),
          fetch("/api/admin/signed-agreements").then((r) => r.json()),
          fetch("/api/admin/documents").then((r) => r.json()),
          fetch("/api/admin/riskprofiles").then((r) => r.json()),
        ]);
        setData({
          users: usersRes?.users || [],
          payments: paymentsRes?.payments || [],
          agreements: agreementsRes?.agreements || [],
          signedAgreements: signedAgreementsRes?.signedAgreements || [],
          documents: documentsRes?.documents || [],
          riskprofiles: riskProfilesRes?.riskprofiles || [],
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoadingData(false);
    }
    fetchAllData();
  }, []);

  const currentCollection = COLLECTIONS.find((c) => c.key === activeTab);

  return (
    <main className="p-6 mt-24">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-60 border rounded-lg p-4 bg-white sticky top-28 h-fit">
          <h2 className="font-bold text-lg mb-4 text-neutral-900">Admin Menu</h2>
          <nav className="flex flex-col gap-1">
            {COLLECTIONS.map((col) => (
              <button
                key={col.key}
                onClick={() => setActiveTab(col.key)}
                className={`text-left p-3 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
                  activeTab === col.key
                    ? "bg-[#9BE749] text-black"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                }`}
              >
                {col.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{currentCollection?.label}</h1>
            {loadingData && activeTab !== "analytics" && activeTab !== "plans" && activeTab !== "subscriptions" && activeTab !== "paymentAudit" && (
              <div className="text-sm text-neutral-500">Loading...</div>
            )}
          </div>

          {/* Conditional rendering of sections */}
          {activeTab === "users" && (
            loadingData ? (
              <p className="text-sm text-neutral-500">Loading data...</p>
            ) : (
              <UsersSection data={data.users} />
            )
          )}

          {activeTab === "payments" && (
            loadingData ? (
              <p className="text-sm text-neutral-500">Loading data...</p>
            ) : (
              <PaymentsSection data={data.payments} isExpiringSoon={isExpiringSoon} />
            )
          )}

          {activeTab === "agreements" && (
            loadingData ? (
              <p className="text-sm text-neutral-500">Loading data...</p>
            ) : (
              <AgreementsSection data={data.agreements} />
            )
          )}

          {activeTab === "signedAgreements" && (
            loadingData ? (
              <p className="text-sm text-neutral-500">Loading data...</p>
            ) : (
              <SignedAgreementsSection data={data.signedAgreements} />
            )
          )}

          {activeTab === "documents" && (
            loadingData ? (
              <p className="text-sm text-neutral-500">Loading data...</p>
            ) : (
              <DocumentsSection data={data.documents} />
            )
          )}

          {activeTab === "riskprofiles" && (
            loadingData ? (
              <p className="text-sm text-neutral-500">Loading data...</p>
            ) : (
              <RiskProfilesSection data={data.riskprofiles} />
            )
          )}

          {activeTab === "analytics" && <AnalyticsSection />}

          {activeTab === "plans" && <PlansSection />}

          {activeTab === "coupons" && <CouponSection />}

          {activeTab === "subscriptions" && <SubscriptionsSection />}

          {activeTab === "paymentAudit" && <PaymentAuditSection />}
        </section>
      </div>
    </main>
  );
}


