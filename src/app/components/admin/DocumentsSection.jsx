"use client";

export default function DocumentsSection({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No documents found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold mb-1">{d.filename}</div>
              <div className="text-xs text-neutral-500 space-y-1">
                <div>Type: {d.contentType}</div>
                <div>Size: {(d.size / 1024).toFixed(2)} KB</div>
                <div>Uploaded: {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "-"}</div>
              </div>
            </div>
            <a
              href={d.secureUrl}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
