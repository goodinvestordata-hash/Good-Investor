const pdf = require("pdfjs-dist");
const fs = require("fs");

(async () => {
  const data = fs.readFileSync("./Client_Agreement.pdf");
  const uint8Array = new Uint8Array(data);
  const doc = await pdf.getDocument(uint8Array).promise;

  let layoutInfo = "";

  for (let i = 1; i <= Math.min(doc.numPages, 2); i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const text = await page.getTextContent();

    layoutInfo += `\n\n========== PAGE ${i} (${viewport.width}x${viewport.height}) ==========\n`;

    text.items.forEach((item, idx) => {
      if (item.str.trim().length > 0) {
        layoutInfo += `[x:${item.x.toFixed(1)}, y:${item.y.toFixed(1)}, w:${item.width ? item.width.toFixed(1) : "auto"}, h:${item.height ? item.height.toFixed(1) : "auto"}, size:${item.fontName}] "${item.str}"\n`;
      }
    });
  }

  console.log(layoutInfo);
  fs.writeFileSync("./pdf_layout_info.txt", layoutInfo);
  console.log("\n\nLayout info saved to pdf_layout_info.txt");
})().catch((err) => console.error("Error:", err));
