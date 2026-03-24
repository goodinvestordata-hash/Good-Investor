import { NextResponse } from "next/server";
import { generateInvoicePDF } from "@/app/lib/generateInvoicePDF";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const paymentId = searchParams.get("payment_id");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const amount = Number(searchParams.get("amount"));
  const service = searchParams.get("service") || "KMR LargeMidCap Services";
  const qty = Number(searchParams.get("qty")) || 1;

  if (!paymentId || !name || !email || !phone || !amount) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  // Calculate GST and base price
  const gstRate = 0.18;
  const basePrice = Math.round(amount / (1 + gstRate));
  const gst = amount - basePrice;

  const invoiceData = {
    clientName: name,
    email,
    mobile: phone,
    service,
    price: `Rs. ${basePrice}`,
    qty: `${qty}`,
    gst: `Rs. ${gst}`,
    subtotal: `Rs. ${basePrice}`,
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
