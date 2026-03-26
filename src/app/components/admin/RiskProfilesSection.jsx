"use client";

export default function RiskProfilesSection({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No risk profiles found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((r) => (
        <div key={r._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-semibold">User ID: {r.userId}</div>
              <div className="text-sm text-neutral-600 mt-1">{r.email}</div>
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Profile</span>
          </div>
          <div className="text-xs text-neutral-500">
            Submitted: {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
