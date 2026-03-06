import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function POST(request) {
  await connectDB();
  const mongoose = (await import("mongoose")).default;
  const Invoice =
    mongoose.models.Invoice ||
    mongoose.model(
      "Invoice",
      new mongoose.Schema({
        clientName: String,
        amount: Number,
        startDate: Date,
        endDate: Date,
        createdAt: { type: Date, default: Date.now },
      }),
    );
  const body = await request.json();
  const { clientName, amount, startDate, endDate } = body;
  const invoice = await Invoice.create({
    clientName,
    amount,
    startDate,
    endDate,
  });
  return NextResponse.json(invoice, { status: 201 });
}

export async function GET() {
  await connectDB();
  const mongoose = (await import("mongoose")).default;
  const Invoice =
    mongoose.models.Invoice ||
    mongoose.model(
      "Invoice",
      new mongoose.Schema({
        clientName: String,
        amount: Number,
        startDate: Date,
        endDate: Date,
        createdAt: { type: Date, default: Date.now },
      }),
    );
  const invoices = await Invoice.find().lean();
  return NextResponse.json({ invoices });
}
