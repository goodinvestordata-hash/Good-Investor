import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  const mongoose = (await import("mongoose")).default;
  const SignedAgreement =
    mongoose.models.SignedAgreement ||
    mongoose.model(
      "SignedAgreement",
      new mongoose.Schema({
        userId: String,
        status: String,
        signedTimestamp: Date,
        fileHash: String,
        createdAt: { type: Date, default: Date.now },
      }),
    );
  const signedAgreements = await SignedAgreement.find().lean();
  return NextResponse.json({ signedAgreements });
}
