import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

import { generateInvoicePDF } from "@/app/lib/generateInvoicePDF";
import { sendInvoicePDFMail } from "@/app/lib/mailer";
import Payment from "@/app/lib/models/Payment";
import Coupon from "@/app/lib/models/Coupon";

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
    couponCode,
    planId,
    planName,
  } = body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !name ||
    !email ||
    !phone
  ) {
    return NextResponse.json(
      { error: "Missing required payment fields" },
      { status: 400 },
    );
  }

  const safeAmount = Number(amount);
  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    return NextResponse.json(
      { error: "Invalid payment amount" },
      { status: 400 },
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment gateway is not configured" },
      { status: 500 },
    );
  }

  const Razorpay =
    (await import("razorpay")).default || (await import("razorpay"));
  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to validate payment order" },
      { status: 400 },
    );
  }

  const incomingAmountPaise = Math.round(safeAmount * 100);
  if (Number(razorpayOrder?.amount) !== incomingAmountPaise) {
    return NextResponse.json(
      { error: "Payment amount mismatch detected" },
      { status: 400 },
    );
  }

  const orderNoteFinalAmount = Number(razorpayOrder?.notes?.finalAmount || 0);
  if (orderNoteFinalAmount > 0 && orderNoteFinalAmount !== Math.round(safeAmount)) {
    return NextResponse.json(
      { error: "Payment metadata mismatch detected" },
      { status: 400 },
    );
  }

  const orderCouponCode = (razorpayOrder?.notes?.couponCode || "").trim().toUpperCase();
  const payloadCouponCode = (couponCode || "").trim().toUpperCase();
  if (orderCouponCode !== payloadCouponCode) {
    return NextResponse.json(
      { error: "Coupon mismatch detected" },
      { status: 400 },
    );
  }

  const orderPlanId = String(razorpayOrder?.notes?.planId || "").trim();
  const payloadPlanId = String(planId || "").trim();
  if (!orderPlanId || !payloadPlanId || orderPlanId !== payloadPlanId) {
    return NextResponse.json(
      { error: "Plan ID mismatch detected" },
      { status: 400 },
    );
  }

  const orderPlanName = String(razorpayOrder?.notes?.planName || "").trim();
  const payloadPlanName = String(planName || "").trim();
  if (!orderPlanName || !payloadPlanName || orderPlanName !== payloadPlanName) {
    return NextResponse.json(
      { error: "Plan name mismatch detected" },
      { status: 400 },
    );
  }

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
      planId: orderPlanId,
      planName: orderPlanName,
      name,
      email,
      phone,
      amount: safeAmount,
      paidAt,
      expiresAt,
      ...(couponCode && { couponCode }),
    });
    await payment.save();

    // ✅ Mark coupon as used (increment usedCount)
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } },
        { new: true }
      );
    }

    // Generate invoice PDF (in memory, not saved to disk)
    const invoiceData = {
      clientName: name,
      email,
      mobile: phone,
      price: `Rs. ${Math.round(safeAmount / 1.18)}`,
      gst: `Rs. ${safeAmount - Math.round(safeAmount / 1.18)}`,
      subtotal: `Rs. ${Math.round(safeAmount / 1.18)}`,
      total: `Rs. ${safeAmount}`,
    };
    const invoicePDFBuffer = await generateInvoicePDF(invoiceData);

    // Send invoice email to user
    await sendInvoicePDFMail({
      to: email,
      pdfBuffer: invoicePDFBuffer,
      clientName: name,
      email,
      phone,
      planName: orderPlanName,
      amount: safeAmount,
    });

    return NextResponse.json({
      success: true,
      razorpay_payment_id,
      planId: orderPlanId,
      planName: orderPlanName,
      name,
      email,
      phone,
      amount: safeAmount,
      ...(couponCode && { couponCode }),
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      {
        error: "Failed to save payment or send invoice",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
