import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  // RiskProfile is dynamically created in risk-profile API
  const mongoose = (await import("mongoose")).default;
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
  const riskProfiles = await RiskProfile.find().lean();
  return NextResponse.json({ riskprofiles: riskProfiles });
}
