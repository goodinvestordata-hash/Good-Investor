"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import UsersSection from "../components/admin/UsersSection";
import AgreementsSection from "../components/admin/AgreementsSection";
import SignedAgreementsSection from "../components/admin/SignedAgreementsSection";
import RiskProfilesSection from "../components/admin/RiskProfilesSection";
import AnalyticsSection from "../components/admin/AnalyticsSection";
import PlansSection from "../components/admin/PlansSection";
import SubscriptionsSection from "../components/admin/SubscriptionsSection";
import PaymentAuditSection from "../components/admin/PaymentAuditSection";
import CouponSection from "../components/admin/CouponSection";
import ContactMessagesSection from "../components/admin/ContactMessagesSection";

const COLLECTIONS = [
  { key: "users", label: "Users", icon: "👥" },
  { key: "agreements", label: "Agreements", icon: "📄" },
  { key: "signedAgreements", label: "Signed Agreements", icon: "✍️" },
  { key: "riskprofiles", label: "Risk Profiles", icon: "📊" },
  { key: "analytics", label: "Admin Analytics", icon: "📈" },
  { key: "plans", label: "Create Plan", icon: "🎯" },
  { key: "coupons", label: "Coupons", icon: "🎟️" },
  { key: "contactMessages", label: "Contact Messages", icon: "📬" },
  { key: "subscriptions", label: "My Subscriptions", icon: "🔄" },
  { key: "paymentAudit", label: "Admin Audit History", icon: "🔍" },
];

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || user.role !== "admin") {
    return null;
  }

  const [activeTab, setActiveTab] = useState("users");
  const [loadingData, setLoadingData] = useState(false);
  const [contactUnreadCount, setContactUnreadCount] = useState(0);

  const [data, setData] = useState({
    users: [],
    agreements: [],
    signedAgreements: [],
    riskprofiles: [],
  });

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [
        usersRes,
        agreementsRes,
        signedAgreementsRes,
        riskProfilesRes,
        contactMessagesRes,
      ] = await Promise.all([
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/agreements").then((r) => r.json()),
        fetch("/api/admin/signed-agreements").then((r) => r.json()),
        fetch("/api/admin/riskprofiles").then((r) => r.json()),
        fetch("/api/admin/contact-messages?limit=1").then((r) => r.json()),
      ]);
      setData({
        users: usersRes?.users || [],
        agreements: agreementsRes?.agreements || [],
        signedAgreements: signedAgreementsRes?.signedAgreements || [],
        riskprofiles: riskProfilesRes?.riskprofiles || [],
      });
      setContactUnreadCount(contactMessagesRes?.stats?.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoadingData(false);
  };

  useEffect(() => {
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
                <span>{col.label}</span>
                {col.key === "contactMessages" && contactUnreadCount > 0 && (
                  <span className="ml-auto inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-bold text-white">
                    {contactUnreadCount > 99 ? "99+" : contactUnreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{currentCollection?.label}</h1>
            {loadingData && activeTab !== "analytics" && activeTab !== "plans" && activeTab !== "subscriptions" && activeTab !== "paymentAudit" && activeTab !== "contactMessages" && (
              <div className="text-sm text-neutral-500">Loading...</div>
            )}
          </div>

          {/* Conditional rendering of sections */}
          {activeTab === "users" && (
            loadingData ? (
              <p className="text-sm text-neutral-500">Loading data...</p>
            ) : (
              <UsersSection data={data.users} onRefresh={fetchAllData} />
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

          {activeTab === "contactMessages" && (
            <ContactMessagesSection onUnreadCountChange={setContactUnreadCount} />
          )}

          {activeTab === "subscriptions" && <SubscriptionsSection />}

          {activeTab === "paymentAudit" && <PaymentAuditSection />}
        </section>
      </div>
    </main>
  );
}


