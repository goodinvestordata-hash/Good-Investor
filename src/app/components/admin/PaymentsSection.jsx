"use client";

export default function PaymentsSection({ data, isExpiringSoon }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-neutral-500 bg-white">
        <p className="text-lg">No payments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-neutral-100 border-b">
            <th className="p-3 text-left font-semibold">Name</th>
            <th className="p-3 text-left font-semibold">Email</th>
            <th className="p-3 text-left font-semibold">Phone</th>
            <th className="p-3 text-left font-semibold">Amount</th>
            <th className="p-3 text-left font-semibold">Paid At</th>
            <th className="p-3 text-left font-semibold">Expires At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr
              key={p._id}
              className={`border-b ${
                isExpiringSoon(p.expiresAt) ? "bg-red-50" : "hover:bg-neutral-50"
              }`}
            >
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">{p.phone}</td>
              <td className="p-3 font-semibold">₹{p.amount}</td>
              <td className="p-3 text-xs">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</td>
              <td className="p-3 text-xs font-semibold">
                {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
