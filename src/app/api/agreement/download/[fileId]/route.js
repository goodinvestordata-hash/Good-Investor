// api/agreement/download/[fileId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import SignedAgreement from "@/app/lib/models/SignedAgreement";
import { generateCompleteAgreementPDF } from "@/app/lib/generateCompletePDF";

export async function GET(req, { params }) {
  try {
    const { fileId } = await params;
    console.log("Download request for fileId:", fileId);

    await connectDB();

    // Fetch agreement by ID
    const agreement = await SignedAgreement.findById(fileId);
    console.log("Agreement found:", agreement ? "yes" : "no");

    if (!agreement) {
      console.error("Agreement not found for fileId:", fileId);
      return NextResponse.json(
        { message: "Agreement not found" },
        { status: 404 },
      );
    }

    // Check agreement status
    if (agreement.status !== "SIGNED") {
      console.error("Agreement status is not SIGNED:", agreement.status);
      return NextResponse.json(
        { message: "Agreement is not in signed state" },
        { status: 400 },
      );
    }

    // Log download activity
    agreement.downloadCount = (agreement.downloadCount || 0) + 1;
    agreement.lastDownloadedAt = new Date();
    await agreement.save();
    console.log("Download count updated:", agreement.downloadCount);

    // Generate PDF using pdfkit
    console.log("Generating PDF for fileId:", fileId);
    console.log("Agreement data for PDF:", {
      clientName: agreement.clientName,
      clientPan: agreement.clientPan,
      signedName: agreement.signedName,
      signatureDataLength: agreement.signatureData
        ? agreement.signatureData.length
        : 0,
      signatureDataStart: agreement.signatureData
        ? agreement.signatureData.substring(0, 50)
        : "MISSING",
      signatureTab: agreement.signatureTab,
      signedTimestamp: agreement.signedTimestamp,
    });

    let pdfBuffer;
    try {
      pdfBuffer = await generateCompleteAgreementPDF({
        ...agreement.toObject(),
        _id: agreement._id.toString(),
        signedDate: agreement.signedTimestamp
          ? new Date(agreement.signedTimestamp).toLocaleDateString("en-IN")
          : new Date().toLocaleDateString("en-IN"),
      });
      console.log(
        "PDF buffer generated successfully:",
        pdfBuffer.length,
        "bytes",
      );
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
      return NextResponse.json(
        { message: "Failed to generate PDF", error: pdfErr.message },
        { status: 500 },
      );
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error("PDF buffer is empty");
      return NextResponse.json(
        { message: "Generated PDF is empty" },
        { status: 500 },
      );
    }

    // Return PDF as binary file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="agreement-${fileId}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return NextResponse.json(
      { message: "Failed to download agreement", error: err.message },
      { status: 500 },
    );
  }
}
