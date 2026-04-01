"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function RiskProfilesSection({ data }) {
  const [selectedProfile, setSelectedProfile] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No risk profiles found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {data.map((r) => (
          <div key={r._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold">User ID: {r.userId}</div>
                <div className="text-sm text-neutral-600 mt-1">{r.email}</div>
                {r.username && <div className="text-sm text-neutral-500 mt-1">@{r.username}</div>}
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Profile</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-neutral-500">
                Submitted: {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
              </div>
              <button
                onClick={() => setSelectedProfile(r)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Risk Profile Details</h2>
                <p className="text-sm text-neutral-500 mt-1">{selectedProfile.email}</p>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X size={24} className="text-neutral-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">User ID</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1">{selectedProfile.userId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1">{selectedProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Username</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1">{selectedProfile.username || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Submitted Date</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {selectedProfile.createdAt ? new Date(selectedProfile.createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Answers */}
              {selectedProfile.answers && Object.keys(selectedProfile.answers).length > 0 ? (
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-4">Risk Assessment Answers</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedProfile.answers).map(([key, value], idx) => (
                      <div key={idx} className="bg-white rounded p-3 border border-neutral-200">
                        <p className="text-xs text-neutral-500 uppercase tracking-wide font-semibold mb-2">{key}</p>
                        <p className="text-sm text-neutral-900">
                          {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 text-center">
                  <p className="text-sm text-neutral-500">No risk assessment data available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-neutral-50 border-t p-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
