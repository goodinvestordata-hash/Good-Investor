import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  const mongoose = (await import("mongoose")).default;
  const Agreement =
    mongoose.models.Agreement ||
    mongoose.model(
      "Agreement",
      new mongoose.Schema({
        version: Number,
        pdfUrl: String,
        createdAt: { type: Date, default: Date.now },
        cloudinaryPublicId: String,
        isActive: Boolean,
      }),
    );
  const agreements = await Agreement.find().lean();
  return NextResponse.json({ agreements });
}
