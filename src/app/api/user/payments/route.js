import connectDB from "@/app/lib/db";
import Payment from "@/app/lib/models/Payment";
import { verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user's payments by email
    const payments = await Payment.find({ email: decoded.email })
      .sort({ createdAt: -1 })
      .lean();

    return new Response(
      JSON.stringify({
        success: true,
        payments: payments || [],
        total: payments?.length || 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user payments:", error);
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
