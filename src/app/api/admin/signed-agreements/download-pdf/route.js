import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import SignedAgreement from "@/app/lib/models/SignedAgreement";
import { generateCompleteAgreementPDF } from "@/app/lib/generateCompletePDF";

export async function POST(req) {
  try {
    await connectDB();

    const { agreementId } = await req.json();

    if (!agreementId) {
      return NextResponse.json(
        { error: "Agreement ID is required" },
        { status: 400 }
      );
    }

    // Fetch the signed agreement
    const agreement = await SignedAgreement.findById(agreementId).lean();

    if (!agreement) {
      return NextResponse.json(
        { error: "Agreement not found" },
        { status: 404 }
      );
    }

    // Generate the EXACT same PDF that was sent in email
    // Using the same function as email sending
    const pdfBuffer = await generateCompleteAgreementPDF({
      ...agreement,
      _id: agreement._id.toString(),
      signedDate: agreement.signedTimestamp
        ? new Date(agreement.signedTimestamp).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN"),
    });

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    // Update download stats
    await SignedAgreement.findByIdAndUpdate(agreementId, {
      downloadCount: (agreement.downloadCount || 0) + 1,
      lastDownloadedAt: new Date(),
    });

    // Return PDF with proper filename
    const fileName = `agreement-${agreement.clientEmail || agreement.userId}-${new Date(agreement.signedTimestamp).getTime()}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
