import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  const mongoose = (await import("mongoose")).default;
  const Payment =
    mongoose.models.Payment ||
    mongoose.model(
      "Payment",
      new mongoose.Schema({
        name: String,
        email: String,
        phone: String,
        amount: Number,
        paidAt: Date,
        expiresAt: Date,
        createdAt: { type: Date, default: Date.now },
      }),
    );
  const payments = await Payment.find().lean();
  return NextResponse.json({ payments });
}
