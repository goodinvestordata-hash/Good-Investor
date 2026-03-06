import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  const mongoose = (await import("mongoose")).default;
  const Document =
    mongoose.models.Document ||
    mongoose.model(
      "Document",
      new mongoose.Schema({
        filename: String,
        contentType: String,
        size: Number,
        uploadedBy: String,
        secureUrl: String,
        createdAt: { type: Date, default: Date.now },
      }),
    );
  const documents = await Document.find().lean();
  return NextResponse.json({ documents });
}
