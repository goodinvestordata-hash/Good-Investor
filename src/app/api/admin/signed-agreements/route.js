import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import SignedAgreement from "@/app/lib/models/SignedAgreement";

export async function GET(req) {
  try {
    await connectDB();

    // Get email filter from query params
    const { searchParams } = new URL(req.url);
    const emailFilter = searchParams.get("email");

    let query = {};
    if (emailFilter) {
      // Case-insensitive email search
      query.clientEmail = { $regex: emailFilter, $options: "i" };
    }

    const signedAgreements = await SignedAgreement.find(query)
      .lean()
      .sort({ signedTimestamp: -1 });

    return NextResponse.json({ signedAgreements });
  } catch (error) {
    console.error("Error fetching signed agreements:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
