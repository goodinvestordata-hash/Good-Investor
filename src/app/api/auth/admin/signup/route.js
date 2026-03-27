import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import { signToken } from "@/app/lib/jwt";

export async function POST(req) {
  try {
    const { email, password, otp } = await req.json();

    // Validate all fields
    if (!email || !password || !otp) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP must be 6 digits" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with this email and OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "admin",
    });

    if (!user) {
      return NextResponse.json(
        { message: "Admin account not found. Please request OTP again." },
        { status: 404 }
      );
    }

    // Verify OTP
    if (user.emailOtp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (!user.emailOtpExpiry || user.emailOtpExpiry < new Date()) {
      return NextResponse.json(
        { message: "OTP has expired. Request a new one." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with password and clear OTP
    user.password = hashedPassword;
    user.emailOtp = null;
    user.emailOtpExpiry = null;
    user.role = "admin";
    user.emailVerified = true;
    user.authProvider = "email";
    user.lastLoginAt = new Date();

    await user.save();

    // Generate JWT token
    const token = signToken(user);

    // Set response with cookie
    const res = NextResponse.json({
      message: "Admin account created successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("Admin account created successfully:", user.email);

    return res;
  } catch (error) {
    console.error("Admin signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
