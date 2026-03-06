const pdf = require("pdfjs-dist");
const fs = require("fs");

(async () => {
  const data = fs.readFileSync("./Client_Agreement.pdf");
  const uint8Array = new Uint8Array(data);
  const doc = await pdf.getDocument(uint8Array).promise;

  let allText = "";

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const text = await page.getTextContent();
    const pageText = text.items.map((item) => item.str).join(" ");
    allText += `\n\n========== PAGE ${i} ==========\n${pageText}`;
  }

  console.log(allText);
  fs.writeFileSync("./pdf_extracted_text.txt", allText);
  console.log("\n\nExtracted text saved to pdf_extracted_text.txt");
})().catch((err) => console.error("Error:", err));
