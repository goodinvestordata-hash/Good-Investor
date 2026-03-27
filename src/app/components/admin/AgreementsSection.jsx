"use client";

export default function AgreementsSection({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No agreements found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((a) => (
        <div key={a._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
          <div className="font-semibold mb-2">{a.title}</div>
          <div className="text-sm text-neutral-600 space-y-1">
            <div>Status: <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{a.status || "Active"}</span></div>
            {a.createdAt && <div>Created: {new Date(a.createdAt).toLocaleDateString()}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
