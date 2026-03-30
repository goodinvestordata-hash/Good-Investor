import connectDB from "@/app/lib/db";
import Payment from "@/app/lib/models/Payment";
import Plan from "@/app/lib/models/Plan";
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

    const planIds = [...new Set((payments || []).map((p) => String(p.planId || "").trim()).filter(Boolean))];
    const plans = planIds.length
      ? await Plan.find({ _id: { $in: planIds } })
          .select({ _id: 1, type: 1, name: 1 })
          .lean()
      : [];

    const planMap = new Map(plans.map((plan) => [String(plan._id), plan]));

    const enrichedPayments = (payments || []).map((payment) => {
      const plan = planMap.get(String(payment.planId || "").trim());
      return {
        ...payment,
        planName: payment.planName || plan?.name || "N/A",
        planType: plan?.type || "N/A",
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        payments: enrichedPayments,
        total: enrichedPayments.length,
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
