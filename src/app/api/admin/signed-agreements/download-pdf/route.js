import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import SignedAgreement from "@/app/lib/models/SignedAgreement";
import { generateCompleteAgreementPDF } from "@/app/lib/generateCompletePDF";
import { requireAdmin } from "@/app/lib/authServer";
import { isValidObjectId } from "@/app/lib/validators";

export async function POST(req) {
  try {
    // ✅ SECURITY: Require admin authentication
    await requireAdmin();

    const { agreementId } = await req.json();

    // ✅ SECURITY: Validate ObjectId
    if (!agreementId || !isValidObjectId(agreementId)) {
      return NextResponse.json(
        { error: "Invalid agreement ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch the signed agreement
    const agreement = await SignedAgreement.findById(agreementId).lean();

    if (!agreement) {
      return NextResponse.json(
        { error: "Agreement not found" },
        { status: 404 }
      );
    }

    // Generate PDF
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

    // Return PDF
    const fileName = `agreement-${agreement.clientName || "unknown"}-${new Date(agreement.signedTimestamp).getTime()}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Admin agreement download error:", error.message);
    return NextResponse.json(
      { error: error.statusCode === 403 ? "Forbidden" : "Something went wrong" },
      { status: error.statusCode || 500 }
    );
  }
}
