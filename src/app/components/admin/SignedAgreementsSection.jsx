"use client";

export default function SignedAgreementsSection({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No signed agreements found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((a) => (
        <div key={a._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Agreement #{a._id?.substring(0, 8)}</div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {a.status || "Signed"}
            </span>
          </div>
          <div className="text-sm text-neutral-600">
            <div>User ID: {a.userId}</div>
            <div>Signed: {a.signedTimestamp ? new Date(a.signedTimestamp).toLocaleDateString() : "-"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
