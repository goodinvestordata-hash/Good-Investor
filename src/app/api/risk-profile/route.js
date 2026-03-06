import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const { user, riskForm } = body;
    if (!user || !riskForm) {
      return NextResponse.json(
        { error: "Missing user or form data" },
        { status: 400 },
      );
    }

    await connectDB();
    const RiskProfile =
      mongoose.models.RiskProfile ||
      mongoose.model(
        "RiskProfile",
        new mongoose.Schema({
          userId: String,
          username: String,
          email: String,
          answers: Object,
          createdAt: { type: Date, default: Date.now },
        }),
      );
    await RiskProfile.create({
      userId: user._id || user.id || user.email,
      username: user.username,
      email: user.email,
      answers: riskForm,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
