"use client";

export default function UsersSection({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No users found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((u) => (
        <div key={u._id} className="border rounded-xl p-4 bg-white hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-green-500 flex items-center justify-center text-green-600 font-bold">
              {(u.fullName || u.username || "U")[0].toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-sm">{u.fullName || u.username}</div>
              <div className="text-xs text-neutral-500">ID: {u._id}</div>
            </div>
          </div>
          <div className="text-xs text-neutral-600">
            <div>Email: {u.email}</div>
            <div className="mt-1">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {u.role}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
