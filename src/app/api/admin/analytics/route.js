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

    // ⚡ RUN ALL QUERIES IN PARALLEL (Promise.all) instead of one-by-one
    const [
      userStats,
      paymentStats,
      loginMethodStats,
      recentLogins,
      dailySignupsAgg,
      monthlyRevenueAgg
    ] = await Promise.all([
      // 1. USER STATISTICS - Single aggregation instead of 4 separate countDocuments
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            verified: { $sum: { $cond: ["$emailVerified", 1, 0] } },
            signupsToday: { $sum: { $cond: [{ $gte: ["$createdAt", startOfToday] }, 1, 0] } },
            signupsThisMonth: { $sum: { $cond: [{ $gte: ["$createdAt", startOfMonth] }, 1, 0] } },
            loggedInToday: { $sum: { $cond: [{ $gte: ["$lastLoginAt", startOfToday] }, 1, 0] } },
            activeLast7Days: { $sum: { $cond: [{ $gte: ["$lastLoginAt", sevenDaysAgo] }, 1, 0] } },
            activeLast30Days: { $sum: { $cond: [{ $gte: ["$lastLoginAt", thirtyDaysAgo] }, 1, 0] } },
            googleUsers: { $sum: { $cond: [{ $eq: ["$authProvider", "google"] }, 1, 0] } },
            emailUsers: { $sum: { $cond: [{ $eq: ["$authProvider", "email"] }, 1, 0] } },
          }
        }
      ]),

      // 2. PAYMENT STATISTICS - Single aggregation for all payment stats
      Payment.aggregate([
        {
          $facet: {
            revenue: [
              { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
            ],
            thisMonthRevenue: [
              { $match: { paidAt: { $gte: startOfMonth } } },
              { $group: { _id: null, total: { $sum: "$amount" } } }
            ],
            activeSubscriptions: [
              { $match: { expiresAt: { $gt: today } } },
              { $count: "count" }
            ],
            renewals: [
              { $group: { _id: "$email", count: { $sum: 1 } } },
              { $match: { count: { $gt: 1 } } },
              { $count: "count" }
            ],
            paidUsers: [
              { $group: { _id: "$email" } },
              { $count: "count" }
            ]
          }
        }
      ]),

      // 3. LOGIN METHOD BREAKDOWN - Combined in user aggregation above
      User.aggregate([
        {
          $group: {
            _id: "$authProvider",
            count: { $sum: 1 }
          }
        },
        { $match: { count: { $gt: 0 } } }
      ]),

      // 4. RECENT LOGINS
      User.find({ lastLoginAt: { $exists: true, $ne: null } })
        .select("email fullName username authProvider lastLoginAt _id")
        .sort({ lastLoginAt: -1 })
        .limit(10)
        .lean(),

      // 5. DAILY SIGNUPS FOR LAST 30 DAYS - Single aggregation with date bucketing
      User.aggregate([
        {
          $match: { createdAt: { $gte: thirtyDaysAgo } }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // 6. MONTHLY REVENUE DETAILS - Single aggregation for 6 months
      Payment.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" }
            },
            total: { $sum: "$amount" },
            transactions: { $sum: 1 },
            uniqueUsers: { $addToSet: "$email" }
          }
        },
        {
          $project: {
            _id: 1,
            total: 1,
            transactions: 1,
            uniqueUsers: { $size: "$uniqueUsers" }
          }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 }
      ])
    ]);

    // Transform results
    const userStat = userStats[0] || {};
    const paymentData = paymentStats[0] || {};
    const loginMethods = loginMethodStats.map(m => ({ method: m._id, count: m.count }));
    
    // Transform daily signups to include missing dates
    const signupMap = {};
    dailySignupsAgg.forEach(d => {
      signupMap[d._id] = d.count;
    });
    const dailySignups = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      dailySignups.push({
        date: dateStr,
        count: signupMap[dateStr] || 0
      });
    }

    // Transform monthly revenue
    const monthlyRevenueDetails = monthlyRevenueAgg.map(m => {
      const date = new Date(m._id.year, m._id.month - 1, 1);
      return {
        month: date.toLocaleDateString("en-US", { year: "numeric", month: "short" }),
        revenue: m.total || 0,
        transactions: m.transactions || 0,
        unique_users: m.uniqueUsers || 0
      };
    }).reverse();

    // Transform recent logins
    const recentLoginsFormatted = recentLogins.map(user => ({
      user_id: user._id,
      email: user.email,
      name: user.fullName || user.username || "Unknown",
      method: user.authProvider || "email",
      ip: "Not tracked",
      logged_in_at: user.lastLoginAt
    }));

    return Response.json({
      success: true,
      summary: {
        total_users: userStat.total || 0,
        verified_users: userStat.verified || 0,
        new_signups_today: userStat.signupsToday || 0,
        new_signups_this_month: userStat.signupsThisMonth || 0,
        total_logged_in_today: userStat.loggedInToday || 0,
        total_login_events_today: userStat.loggedInToday || 0,
        active_last_7_days: userStat.activeLast7Days || 0,
        active_last_30_days: userStat.activeLast30Days || 0,
        google_users_total: userStat.googleUsers || 0,
        email_users_total: userStat.emailUsers || 0,
        total_revenue: paymentData.revenue?.[0]?.total || 0,
        this_month_revenue: paymentData.thisMonthRevenue?.[0]?.total || 0,
        total_payments: paymentData.revenue?.[0]?.count || 0,
        paid_users_count: paymentData.paidUsers?.[0]?.count || 0,
        active_subscriptions: paymentData.activeSubscriptions?.[0]?.count || 0,
        renewals: paymentData.renewals?.[0]?.count || 0,
      },
      daily_signups_30d: dailySignups,
      login_method_breakdown: loginMethods,
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
