import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const { amount, name, email, phone } = body;
  const Razorpay =
    (await import("razorpay")).default || (await import("razorpay"));
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order });
  } catch (err) {
    console.error("RAZORPAY ORDER ERROR:", err);
    return NextResponse.json(
      {
        error: "Order creation failed",
        details: err.message,
        stack: err.stack,
      },
      { status: 500 },
    );
  }
}
