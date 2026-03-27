import connectDB from "@/app/lib/db";
import Payment from "@/app/lib/models/Payment";
import { verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    // Verify user is authenticated and is admin
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, message: "Admin access required" }),
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Get all payments
    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Calculate stats
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = payments.length;
    const activeCount = payments.filter((p) => new Date(p.expiresAt) > new Date()).length;

    return new Response(
      JSON.stringify({
        success: true,
        payments: payments || [],
        stats: {
          totalRevenue,
          totalTransactions,
          activeCount,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin payments:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch payments",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
