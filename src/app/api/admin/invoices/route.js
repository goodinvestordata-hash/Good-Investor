import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  const mongoose = (await import("mongoose")).default;
  
  const InvoiceSchema = new mongoose.Schema({
    clientName: String,
    amount: Number,
    startDate: Date,
    endDate: Date,
    createdAt: { type: Date, default: Date.now },
  });

  const Invoice =
    mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

  try {
    const invoices = await Invoice.find().lean().sort({ createdAt: -1 });
    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { message: "Error fetching invoices", error: error.message },
      { status: 500 }
    );
  }
}
