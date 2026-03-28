import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateInvoicePDF(invoiceData) {
  // Helper to format date as DD/MM/YYYY
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Default startDate: today, endDate: one month from today
  const today = new Date();
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);

  const {
    clientName = "Client Name",
    email = "client@email.com",
    mobile = "xxxxxxxxxx",
    state = "State",
    pan = "PAN0000000X",
    service = "KMR LargeMidCap Services",
    price = "Rs. 4,000",
    gst = "Rs. 399",
    subtotal = "Rs. 4,399",
    total = "Rs. 12,000",
    qty = "1",
    startDate = formatDate(today),
    endDate = formatDate(oneMonthLater),
    planName = "Plan Name",
  } = invoiceData;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595, 842]);

  let y = 810;
  const margin = 40;
  const lineGap = 14;

  /* ---------- TEXT WRAP FUNCTION ---------- */

  function drawWrappedText(text, x, startY, size, maxWidth, lineHeight = 12) {
    const words = text.split(" ");
    let line = "";
    let yPos = startY;

    for (const word of words) {
      const testLine = line + word + " ";
      const width = font.widthOfTextAtSize(testLine, size);

      if (width > maxWidth) {
        page.drawText(line, {
          x,
          y: yPos,
          size,
          font,
        });

        line = word + " ";
        yPos -= lineHeight;
      } else {
        line = testLine;
      }
    }

    page.drawText(line, {
      x,
      y: yPos,
      size,
      font,
    });

    return yPos - lineHeight;
  }

  /* ---------- TOP RED BAR ---------- */

  page.drawRectangle({
    x: 0,
    y: 820,
    width: 595,
    height: 22,
    color: rgb(0.85, 0, 0),
  });

  page.drawText(
    "Investment in securities market are subject to market risks. Read all the related documents carefully before investing.",
    {
      x: 40,
      y: 826,
      size: 9,
      font,
      color: rgb(1, 1, 1),
    },
  );

  /* ---------- HEADER ---------- */

  y -= 20;

  page.drawText("Sasikumar Peyyala", {
    x: margin,
    y,
    size: 22,
    font: bold,
    color: rgb(0, 0, 0.6),
  });

  page.drawText("INVOICE", {
    x: 430,
    y: y + 6,
    size: 28,
    font: bold,
    color: rgb(0.5, 0, 0.8),
  });

  y -= 20;

  page.drawText("SEBI® Research Analyst: INH000019327", {
    x: margin,
    y,
    size: 11,
    font: bold,
    color: rgb(0.7, 0.1, 0.1),
  });

  page.drawText("Trade Name or Website: www.trademilaan.in", {
    x: 310,
    y,
    size: 10,
    font,
  });

  /* ---------- PURPLE LINE ---------- */

  y -= 10;

  page.drawRectangle({
    x: margin,
    y,
    width: 520,
    height: 3,
    color: rgb(0.5, 0, 0.8),
  });

  /* ---------- CLIENT DETAILS ---------- */

  y -= 22;

  page.drawText(`Client Name : ${clientName}`, {
    x: margin,
    y,
    size: 11,
    font,
  });

  y -= lineGap;
  page.drawText(`Email : ${email}`, { x: margin, y, size: 11, font });

  y -= lineGap;
  page.drawText(`Mobile : +91 ${mobile}`, { x: margin, y, size: 11, font });

  y -= lineGap;
  page.drawText(`State : ${state}`, { x: margin, y, size: 11, font });

  y -= lineGap;
  page.drawText(`PAN : ${pan}`, { x: margin, y, size: 11, font });

  page.drawText(`SERVICE START DATE : ${startDate}`, {
    x: 340,
    y: y + lineGap * 4,
    size: 11,
    font: bold,
  });

  page.drawText(`SERVICE END DATE : ${endDate}`, {
    x: 340,
    y: y + lineGap * 3,
    size: 11,
    font: bold,
  });

  // Add GST number below service end date
  page.drawText(`GST No: 37CNSPP5410Q2Z2`, {
    x: 340,
    y: y + lineGap * 2,
    size: 11,
    font: bold,
    color: rgb(0.1, 0.1, 0.1),
  });

  /* ---------- SERVICE TABLE ---------- */

  y -= 30;

  page.drawRectangle({
    x: margin,
    y,
    width: 515,
    height: 22,
    color: rgb(0, 0.6, 0.8),
  });

  page.drawText("PRODUCT/SERVICE", {
    x: margin + 8,
    y: y + 6,
    size: 11,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("PRICE", {
    x: 260,
    y: y + 6,
    size: 11,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("QTY", {
    x: 370,
    y: y + 6,
    size: 11,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("TOTAL", {
    x: 460,
    y: y + 6,
    size: 11,
    font: bold,
    color: rgb(1, 1, 1),
  });

  y -= 22;

  // Use planName as the service/product name if provided
  page.drawText(planName || service, {
    x: margin + 8,
    y: y + 6,
    size: 11,
    font,
  });
  page.drawText(price, { x: 260, y: y + 6, size: 11, font });
  page.drawText(qty || "1", { x: 370, y: y + 6, size: 11, font });
  page.drawText(total, { x: 460, y: y + 6, size: 11, font });

  /* ---------- PAYMENT DETAILS ---------- */

  y -= 30;

  page.drawText("PAYMENT DETAILS", {
    x: margin,
    y,
    size: 10,
    font: bold,
    color: rgb(0.7, 0.1, 0.1),
  });

  y -= 12;

  y = drawWrappedText(
    "Please make payments for our services through our website. Any payments made outside of the specified bank account or payment gateway will not be considered as payment for our services.",
    margin,
    y,
    8,
    520,
    10,
  );

  /* ---------- TOTALS ---------- */

  y -= 10;

  page.drawText("SUBTOTAL", { x: 370, y, size: 11, font: bold });
  page.drawText(subtotal, { x: 470, y, size: 11, font });

  y -= 14;

  page.drawText("GST@18%", { x: 370, y, size: 11, font: bold });
  page.drawText(gst, { x: 470, y, size: 11, font });

  y -= 14;

  page.drawText("TOTAL", { x: 370, y, size: 11, font: bold });
  page.drawText(total, { x: 470, y, size: 11, font: bold });

  /* ---------- TERMS ---------- */

  y -= 20;

  page.drawText(
    "PLEASE READ TERMS AND CONDITIONS TO AVOID ANY FUTURE CONFLICT OF INTEREST:",
    {
      x: margin,
      y,
      size: 11,
      font: bold,
    },
  );

  y -= 18;

  const terms = [
    "1.Registration by SEBI and certification from NISM do not guarantee the performance of the intermediary or assure returns for investors.",
    "2. Market Risks may result in partial or permanent losses to your investments or portfolio due to unfavorable market conditions or company-specific events.",
    "3. Past performance does not predict future results.",
    "4. We are SEBI Registered as a 'Research Analyst', not as 'Investment Advisers.'",
    "5. We do not provide any assurances or guarantees regarding returns on investments or trading. If anyone claims to do so on our behalf, please contact our Compliance Officer through our website or mail: spkumar.researchanalyst@gmail.com for assistance. We are not liable for any consequences arising from such activities, as investing in the securities market carries significant risks.",
    "6. Sasikumar Peyyala has a designated compliance officer to address all trader/investor complaints. Please send all complaints to spkumar.researchanalyst@gmail.com, and we aim to resolve them within 7 days.",
    "7. Sasikumar Peyyala is a SEBI registered Research Analyst with registration number INH000016977. We do not offer profit-sharing, PMS-based services, or Demat Account handling services. Our offerings are strictly research-based recommendations available on a prepaid subscription basis.",
    "8. We will provide Buy/Sell/Hold ratings and other research-based calls/model portfolios based on Technical and/or Fundamental analysis during the validity period.",
    "9. Investors are encouraged to act in accordance with their risk tolerance, and we do not provide Investment Advisory Services.",
    "10. Please avoid hot or stop-loss measures to mitigate open losses on your investments or portfolio.",
    "11. If you wish to activate our various package services, please contact us to proceed.",
    "12. The services are valid for the specified duration from the payment date.",
    "13. If the services are not activated due to technical reasons, you can reach us for a refund within 2 additional months of research services will be provided. In the event of a refund, one month's service will be held as a retention fee.",
    "14. To review the terms and conditions for each of our research services, please visit our website at www.trademilaan.in.",
  ];

  for (const t of terms) {
    y = drawWrappedText(t, margin, y, 8, 520, 14);

    y -= 4;
  }

  /* ---------- CONTACT ROW ---------- */

  const contactY = 115;

  page.drawText("Phone.", {
    x: 40,
    y: contactY,
    size: 10,
    font: bold,
    color: rgb(0, 0.55, 0.75),
  });

  page.drawText("+91 77022 62206", {
    x: 90,
    y: contactY,
    size: 10,
    font,
  });

  page.drawText("Email.", {
    x: 210,
    y: contactY,
    size: 10,
    font: bold,
    color: rgb(0, 0.55, 0.75),
  });

  page.drawText("spkumar.researchanalyst@gmail.com", {
    x: 260,
    y: contactY,
    size: 10,
    font,
  });

  page.drawText("Address.", {
    x: 440,
    y: contactY,
    size: 10,
    font: bold,
    color: rgb(0, 0.55, 0.75),
  });

  page.drawText(
    "1 24,29 4 Kummaripalem Centerr, Near D S M, High School, Vidyadharapuram, Vijayawada, VIJAYAWADA,ANDHRA PRADESH, 520012",
    {
      x: 440,
      y: contactY - 12,
      size: 8,
      font,
      maxWidth: 140,
      lineHeight: 10,
    },
  );
  y -= 32;

  /* ---------- FOOTER BOXES ---------- */
  const boxY = 0;
  const boxHeight = 70;

  // Draw boxes first
  page.drawRectangle({
    x: 0,
    y: boxY,
    width: 300,
    height: boxHeight,
    color: rgb(0, 0.6, 0.6),
  });
  page.drawRectangle({
    x: 300,
    y: boxY,
    width: 295,
    height: boxHeight,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Draw the title centered in the boxes, after boxes
  const grievanceTitleY = boxY + boxHeight / 2 + 10;
  page.drawText("GRIEVANCE REDRESSAL / ESCALATION MATRIX", {
    x: 110,
    y: grievanceTitleY,
    size: 16,
    font: bold,
    color: rgb(0.85, 0, 0),
  });

  /* ---------- FOOTER BOXES ---------- */

  /* LEFT BLUE BOX */

  page.drawRectangle({
    x: 0,
    y: boxY,
    width: 300,
    height: boxHeight,
    color: rgb(0, 0.6, 0.6),
  });

  /* RIGHT BLACK BOX */

  page.drawRectangle({
    x: 300,
    y: boxY,
    width: 295,
    height: boxHeight,
    color: rgb(0.15, 0.15, 0.15),
  });

  /* ---------- LEFT BOX TEXT ---------- */
  let blueY = boxY + boxHeight - 18;
  blueY = drawWrappedText(
    "In case you are not satisfied with our response you can lodge your grievance with SEBI SCORES, Phone and ODR.",
    15,
    blueY,
    9,
    260,
    12,
  );
  blueY = drawWrappedText(
    "Compliance Team: spkumar.researchanalyst@gmail.com",
    15,
    blueY - 5,
    9,
    260,
    12,
  );
  drawWrappedText("Phone: +91 77022 62206", 15, blueY - 5, 9, 260, 12);

  /* ---------- RIGHT BOX TEXT ---------- */
  let blackY = boxY + boxHeight - 18;
  const blackBoxPadding = 12;
  const blackBoxX = 300;
  const blackBoxWidth = 295;
  const blackTextX = blackBoxX + blackBoxPadding;
  const blackTextWidth = blackBoxWidth - 2 * blackBoxPadding;

  blackY = drawWrappedText(
    "For any queries, feedback or assistance contact SEBI office on toll free Helpline:",
    blackTextX,
    blackY,
    9,
    blackTextWidth,
    12,
  );
  blackY = drawWrappedText(
    "1800 22 7575 / 1800 266 7575",
    blackTextX,
    blackY - 5,
    10,
    blackTextWidth,
    12,
  );
  blackY = drawWrappedText(
    "SEBI SCORES: https://scores.sebi.gov.in/",
    blackTextX,
    blackY - 5,
    8,
    blackTextWidth,
    12,
  );
  drawWrappedText(
    "SEBI ODR: https://smartodr.in/",
    blackTextX,
    blackY - 5,
    8,
    blackTextWidth,
    12,
  );

  /* ---------- DIAGONAL DIVIDER ---------- */

  page.drawSvgPath(
    `M300 ${boxY} L330 ${boxY + boxHeight} L300 ${boxY + boxHeight} L270 ${boxY} Z`,
    {
      color: rgb(1, 1, 1),
    },
  );
  /* ---------- SAVE PDF ---------- */

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
