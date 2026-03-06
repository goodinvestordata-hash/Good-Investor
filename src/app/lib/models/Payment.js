import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true, unique: true },
  razorpay_signature: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  paidAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
