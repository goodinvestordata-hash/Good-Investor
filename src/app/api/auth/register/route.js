import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import { signToken } from "@/app/lib/jwt";
import { sendTermsAndConditionsMail } from "@/app/lib/mailer";
import { isValidEmail, sanitizeString } from "@/app/lib/validators";
import { serializeAuthUser } from "@/app/lib/serializers";
import { setSecureCookie } from "@/app/lib/apiHelpers";

export async function POST(req) {
  try {
    const body = await req.json();

    // Extract and validate inputs
    const { email, password, username } = body;

    // Input validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Sanitize username
    const sanitizedUsername = sanitizeString(username);
    if (!sanitizedUsername || sanitizedUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hash,
      username: sanitizedUsername,
      role: "user",
      emailVerified: true,
    });

    // Send confirmation email (non-blocking)
    sendTermsAndConditionsMail(email).catch((err) => {
      console.error("Email sending failed (non-blocking):", err.message);
    });

    // Generate token
    const token = signToken(user);

    // Return safe user data
    const res = NextResponse.json({
      user: serializeAuthUser(user),
    });

    // Set secure cookie
    setSecureCookie(res, "token", token);
    return res;
  } catch (error) {
    console.error("Register error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
