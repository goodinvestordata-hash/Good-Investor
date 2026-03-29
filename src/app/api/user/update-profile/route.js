import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import { verifyToken } from "@/app/lib/jwt";

export async function PUT(req) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const decoded = verifyToken(token);
    await connectDB();

    const body = await req.json();
    const { fullName, phone, dob, gender, state, panNumber } = body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        fullName: fullName || undefined,
        phone: phone || undefined,
        dob: dob || undefined,
        gender: gender || undefined,
        state: state || undefined,
        panNumber: panNumber || undefined,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
