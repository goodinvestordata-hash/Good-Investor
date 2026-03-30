import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import ContactMessage from "@/app/lib/models/ContactMessage";
import { verifyAuth, isAdminUser } from "@/app/lib/auth/tokenUtils";

export async function GET(req) {
  try {
    const { isValid, user, error: authError } = verifyAuth(req);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: authError || "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (!isAdminUser(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: Admin access required",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
      100
    );
    const search = String(searchParams.get("search") || "").trim();
    const status = String(searchParams.get("status") || "all").trim();

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "read") {
      query.isRead = true;
    } else if (status === "unread") {
      query.isRead = false;
    }

    const skip = (page - 1) * limit;

    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(query),
      ContactMessage.countDocuments({ isRead: false }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(Math.ceil(total / limit), 1),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
        stats: {
          unreadCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch contact messages",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
