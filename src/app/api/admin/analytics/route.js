import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import Payment from "@/app/lib/models/Payment";
import { verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    // Verify user is authenticated and is admin
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return Response.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Calculate date ranges
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. USER STATISTICS
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ emailVerified: true });

    // Daily signups
    const newSignupsToday = await User.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const newSignupsThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // 2. LOGIN STATISTICS
    // Count unique users logged in today
    const loggedInToday = await User.countDocuments({
      lastLoginAt: { $gte: startOfToday },
    });

    // Count total login events today (if tracking login events separately)
    const loginEventsToday = await User.countDocuments({
      lastLoginAt: { $gte: startOfToday },
    });

    // Active users in last 7 days and 30 days
    const activeLast7Days = await User.countDocuments({
      lastLoginAt: { $gte: sevenDaysAgo },
    });

    const activeLast30Days = await User.countDocuments({
      lastLoginAt: { $gte: thirtyDaysAgo },
    });

    // 3. LOGIN METHOD BREAKDOWN
    const googleUsers = await User.countDocuments({ authProvider: "google" });
    const emailUsers = await User.countDocuments({ authProvider: "email" });

    const loginMethodBreakdown = [];
    if (emailUsers > 0) {
      loginMethodBreakdown.push({ method: "email", count: emailUsers });
    }
    if (googleUsers > 0) {
      loginMethodBreakdown.push({ method: "google", count: googleUsers });
    }

    // 4. DAILY SIGNUPS FOR LAST 30 DAYS
    const dailySignups = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const count = await User.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      dailySignups.push({
        date: date.toISOString().split("T")[0],
        count,
      });
    }

    // 5. RECENT LOGINS
    const recentLogins = await User.find(
      { lastLoginAt: { $exists: true, $ne: null } },
      { email: 1, fullName: 1, username: 1, authProvider: 1, lastLoginAt: 1, _id: 1 }
    )
      .sort({ lastLoginAt: -1 })
      .limit(10)
      .lean();

    const recentLoginsFormatted = recentLogins.map((user) => ({
      user_id: user._id,
      email: user.email,
      name: user.fullName || user.username || "Unknown",
      method: user.authProvider || "email",
      ip: "Not tracked", // Optional: add IP tracking if needed
      logged_in_at: user.lastLoginAt,
    }));

    // 6. PAYMENT STATISTICS
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const thisMonthRevenue = await Payment.aggregate([
      { $match: { paidAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalPayments = await Payment.countDocuments();
    const paidUsers = await Payment.distinct("email");

    // Active subscriptions (not expired)
    const activeSubscriptions = await Payment.countDocuments({
      expiresAt: { $gt: today },
    });

    // Renewals (multiple payments from same email)
    const userPaymentCounts = await Payment.aggregate([
      { $group: { _id: "$email", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);
    const renewals = userPaymentCounts.length;

    // Monthly revenue details
    const monthlyRevenueDetails = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

      const monthRevenue = await Payment.aggregate([
        { $match: { paidAt: { $gte: month, $lt: nextMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]);

      const uniqueUsers = await Payment.distinct("email", {
        paidAt: { $gte: month, $lt: nextMonth },
      });

      const monthName = month.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });

      monthlyRevenueDetails.push({
        month: monthName,
        revenue: monthRevenue[0]?.total || 0,
        transactions: monthRevenue[0]?.count || 0,
        unique_users: uniqueUsers.length,
      });
    }

    return Response.json({
      success: true,
      summary: {
        total_users: totalUsers,
        verified_users: verifiedUsers,
        new_signups_today: newSignupsToday,
        new_signups_this_month: newSignupsThisMonth,
        total_logged_in_today: loggedInToday,
        total_login_events_today: loginEventsToday,
        active_last_7_days: activeLast7Days,
        active_last_30_days: activeLast30Days,
        google_users_total: googleUsers,
        email_users_total: emailUsers,
        total_revenue: totalRevenue[0]?.total || 0,
        this_month_revenue: thisMonthRevenue[0]?.total || 0,
        total_payments: totalPayments,
        paid_users_count: paidUsers.length,
        active_subscriptions: activeSubscriptions,
        renewals: renewals,
      },
      daily_signups_30d: dailySignups,
      login_method_breakdown: loginMethodBreakdown,
      recent_logins: recentLoginsFormatted,
      monthly_revenue_details: monthlyRevenueDetails,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return Response.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
