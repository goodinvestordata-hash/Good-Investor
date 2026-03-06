"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const COLLECTIONS = [
  { key: "users", label: "Users" },
  { key: "payments", label: "Payments" },
  { key: "agreements", label: "Agreements" },
  { key: "signedAgreements", label: "Signed Agreements" },
  { key: "documents", label: "Documents" },
  { key: "riskprofiles", label: "Risk Profiles" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
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
        // Optionally handle error
      }
      setLoadingData(false);
    }
    fetchAllData();
  }, []);

  return (
    <main className="p-6 mt-24">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-60 border rounded-lg p-4">
          <nav className="flex flex-col gap-2">
            {COLLECTIONS.map((col) => (
              <button
                key={col.key}
                onClick={() => setActiveTab(col.key)}
                className={`text-left p-2 rounded ${
                  activeTab === col.key
                    ? "bg-black text-white"
                    : "bg-neutral-100"
                }`}
              >
                {col.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            {COLLECTIONS.find((c) => c.key === activeTab)?.label}
          </h1>

          {loadingData ? (
            <p className="text-sm text-neutral-500">Loading...</p>
          ) : (
            <CollectionPanel
              collection={activeTab}
              data={data[activeTab] || []}
              isExpiringSoon={isExpiringSoon}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function CollectionPanel({ collection, data, isExpiringSoon }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-3 text-center text-neutral-500">
        No records found
      </div>
    );
  }

  if (collection === "users") {
    return (
      <div className="space-y-6">
        {data.map((u) => (
          <div key={u._id} className="border rounded-xl p-4 bg-neutral-50">
            <div className="font-bold text-lg">{u.fullName || u.username}</div>
            <div className="text-xs">User ID: {u._id}</div>
            <div className="text-xs">Email: {u.email}</div>
            <div className="text-xs">Role: {u.role}</div>
          </div>
        ))}
      </div>
    );
  }

  if (collection === "payments") {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-neutral-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Paid At</th>
              <th className="p-2 border">Expires At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr
                key={p._id}
                className={
                  isExpiringSoon(p.expiresAt) ? "bg-red-100 animate-pulse" : ""
                }
              >
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.email}</td>
                <td className="p-2 border">{p.phone}</td>
                <td className="p-2 border">₹{p.amount}</td>
                <td className="p-2 border">
                  {p.paidAt ? new Date(p.paidAt).toLocaleString() : "-"}
                </td>
                <td className="p-2 border font-semibold">
                  {p.expiresAt ? new Date(p.expiresAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (collection === "documents") {
    return (
      <div className="space-y-4">
        {data.map((d) => (
          <div key={d._id} className="border rounded-xl p-4 bg-neutral-50">
            <div>Filename: {d.filename}</div>
            <div>Type: {d.contentType}</div>
            <div>Size: {d.size} bytes</div>
            <div>Uploaded By: {d.uploadedBy}</div>
            <div>
              Uploaded:{" "}
              {d.createdAt ? new Date(d.createdAt).toLocaleString() : "-"}
            </div>
            <a
              href={d.secureUrl}
              className="text-blue-600 underline"
              target="_blank"
            >
              View Document
            </a>
          </div>
        ))}
      </div>
    );
  }

  if (collection === "riskprofiles") {
    return (
      <div className="space-y-4">
        {data.map((r) => (
          <div key={r._id} className="border rounded-xl p-4 bg-neutral-50">
            <div className="font-bold">User ID: {r.userId}</div>
            <div>Email: {r.email}</div>
            <div>
              Submitted:{" "}
              {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
            </div>
            <pre className="bg-neutral-100 p-2 text-xs mt-2">
              {JSON.stringify(r.answers, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    );
  }

  if (collection === "signedAgreements") {
    return (
      <div className="space-y-4">
        {data.map((a) => (
          <div key={a._id} className="border rounded-xl p-4 bg-neutral-50">
            <div>User ID: {a.userId}</div>
            <div>Status: {a.status}</div>
            <div>
              Signed At:{" "}
              {a.signedTimestamp
                ? new Date(a.signedTimestamp).toLocaleString()
                : "-"}
            </div>
            <div>Hash: {a.fileHash}</div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
