// api/agreement/download/[fileId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import SignedAgreement from "@/app/lib/models/SignedAgreement";
import { generateCompleteAgreementPDF } from "@/app/lib/generateCompletePDF";
import { sendAgreementPDFMail } from "@/app/lib/mailer";
import { requireAuth, userOwnsResource } from "@/app/lib/authServer";
import { isValidObjectId } from "@/app/lib/validators";

export async function GET(req, { params }) {
  try {
    // ✅ SECURITY: Require authentication
    const user = await requireAuth();

    const { fileId } = await params;

    // ✅ SECURITY: Validate ObjectId format
    if (!isValidObjectId(fileId)) {
      return NextResponse.json(
        { error: "Invalid agreement ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch agreement
    const agreement = await SignedAgreement.findById(fileId);

    if (!agreement) {
      return NextResponse.json(
        { error: "Agreement not found" },
        { status: 404 }
      );
    }

    // ✅ SECURITY: IDOR Check - verify ownership
    if (!userOwnsResource(agreement.userId, user.userId, user.role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Check agreement status
    if (agreement.status !== "SIGNED") {
      return NextResponse.json(
        { error: "Agreement is not in signed state" },
        { status: 400 }
      );
    }

    // Update download tracking
    agreement.downloadCount = (agreement.downloadCount || 0) + 1;
    agreement.lastDownloadedAt = new Date();
    await agreement.save();

    // Generate PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generateCompleteAgreementPDF({
        ...agreement.toObject(),
        _id: agreement._id.toString(),
        signedDate: agreement.signedTimestamp
          ? new Date(agreement.signedTimestamp).toLocaleDateString("en-IN")
          : new Date().toLocaleDateString("en-IN"),
      });
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr.message);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    // Send confirmation mail (non-blocking)
    if (agreement.clientEmail) {
      sendAgreementPDFMail({
        to: agreement.clientEmail,
        pdfBuffer,
        clientName: agreement.clientName || "User",
        clientPan: agreement.clientPan || "",
      }).catch((err) => {
        console.error("Email sending failed:", err.message);
      });
    }

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="agreement-${fileId}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Agreement download error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: error.statusCode || 500 }
    );
  }
}
