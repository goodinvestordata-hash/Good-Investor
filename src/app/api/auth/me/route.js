import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import { verifyToken } from "@/app/lib/jwt";
import { serializeAuthUser } from "@/app/lib/serializers";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const decoded = verifyToken(token);
    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    // ✅ SECURITY: Serialize user data to exclude sensitive fields
    const serialized = serializeAuthUser(user);
    return NextResponse.json({ user: serialized });
  } catch (err) {
    const name = err?.name;
    const msg = String(err?.message ?? err);
    const isAuthFailure =
      name === "JsonWebTokenError" ||
      name === "TokenExpiredError" ||
      msg.startsWith("FATAL: JWT_SECRET");
    if (isAuthFailure) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    console.error("/api/auth/me error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
