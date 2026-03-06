import { NextResponse } from "next/server";
import { generateInvoicePDF } from "@/app/lib/generateInvoicePDF";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const amount = searchParams.get("amount");

  if (!paymentId || !name || !email || !phone || !amount) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  const invoiceData = {
    clientName: name,
    email,
    mobile: phone,
    price: `Rs. ${amount - 399}`,
    gst: "Rs. 399",
    subtotal: `Rs. ${amount}`,
    total: `Rs. ${amount}`,
  };

  try {
    const pdfBuffer = await generateInvoicePDF(invoiceData);
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${paymentId}.pdf`,
      },
    });
  } catch (err) {
    return new NextResponse("Invoice generation failed", { status: 500 });
  }
}
