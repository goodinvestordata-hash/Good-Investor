import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import { generateInvoicePDF } from "@/app/lib/generateInvoicePDF";

export async function POST(req) {
  try {
    await connectDB();

    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Fetch the invoice
    const mongoose = (await import("mongoose")).default;
    const InvoiceSchema = new mongoose.Schema({
      clientName: String,
      amount: Number,
      startDate: Date,
      endDate: Date,
      createdAt: { type: Date, default: Date.now },
      email: String,
      phone: String,
      state: String,
      pan: String,
      planId: String,
      planName: String,
      razorpay_payment_id: String,
    });
    const Invoice =
      mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

    const invoice = await Invoice.findById(invoiceId).lean();

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Generate invoice PDF
    const invoiceData = {
      clientName: invoice.clientName,
      email: invoice.email,
      mobile: invoice.phone,
      state: invoice.state || "",
      pan: invoice.pan || "",
      planName: invoice.planName || "",
      price: `Rs. ${Math.round(invoice.amount / 1.18)}`,
      gst: `Rs. ${invoice.amount - Math.round(invoice.amount / 1.18)}`,
      subtotal: `Rs. ${Math.round(invoice.amount / 1.18)}`,
      total: `Rs. ${invoice.amount}`,
    };

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    // Generate filename
    const fileName = `invoice-${invoice.clientName}-${new Date(invoice.createdAt).getTime()}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
