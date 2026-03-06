import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

import { generateInvoicePDF } from "@/app/lib/generateInvoicePDF";
import Payment from "@/app/lib/models/Payment";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    phone,
    amount,
  } = body;
  const crypto = (await import("crypto")).default || (await import("crypto"));
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");
  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Store payment in MongoDB
  try {
    // Set paidAt to now, expiresAt to one month later
    const paidAt = new Date();
    const expiresAt = new Date(paidAt);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const payment = new Payment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      phone,
      amount,
      paidAt,
      expiresAt,
    });
    await payment.save();

    // Generate invoice PDF (in memory, not saved to disk)
    const invoiceData = {
      clientName: name,
      email,
      mobile: phone,
      price: `Rs. ${amount - 399}`,
      gst: "Rs. 399",
      subtotal: `Rs. ${amount}`,
      total: `Rs. ${amount}`,
    };
    await generateInvoicePDF(invoiceData);

    return NextResponse.json({
      success: true,
      razorpay_payment_id,
      name,
      email,
      phone,
      amount,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to save payment or generate invoice",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
