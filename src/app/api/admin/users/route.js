import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import mongoose from "mongoose";

// Dynamic import for Payment and SignedAgreement (now in lib/models)
const getPaymentModel = async () => {
  try {
    return await import("@/app/lib/models/Payment");
  } catch {
    return null;
  }
};
const getSignedAgreementModel = async () => {
  try {
    return await import("@/app/lib/models/SignedAgreement");
  } catch {
    return null;
  }
};

export async function GET() {
  await connectDB();

  // Get all users
  const users = await User.find().lean();

  // Get all payments
  let Payment = null;
  try {
    Payment = (await getPaymentModel())?.default;
  } catch {}
  let payments = [];
  if (Payment) {
    payments = await Payment.find().lean();
  }

  // Get all signed agreements
  let SignedAgreement = null;
  try {
    SignedAgreement = (await getSignedAgreementModel())?.default;
  } catch {}
  let signedAgreements = [];
  if (SignedAgreement) {
    signedAgreements = await SignedAgreement.find().lean();
  }

  // Get all risk profiles
  let riskProfiles = [];
  try {
    const RiskProfile =
      mongoose.models.RiskProfile ||
      mongoose.model(
        "RiskProfile",
        new mongoose.Schema({
          userId: String,
          username: String,
          email: String,
          answers: Object,
          createdAt: { type: Date, default: Date.now },
        }),
      );
    riskProfiles = await RiskProfile.find().lean();
  } catch {}

  // Aggregate all info per user
  const userDetails = users.map((user) => {
    const userPayments = payments.filter((p) => p.email === user.email);
    const userAgreements = signedAgreements.filter(
      (a) => a.userId === String(user._id) || a.userId === user.email,
    );
    const userRiskProfile = riskProfiles.find(
      (r) => r.userId === String(user._id) || r.email === user.email,
    );
    return {
      ...user,
      payments: userPayments,
      signedAgreements: userAgreements,
      riskProfile: userRiskProfile || null,
    };
  });

  return NextResponse.json({ users: userDetails });
}
