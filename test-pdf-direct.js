import { generateCompleteAgreementPDF } from "./src/app/lib/generateCompletePDF.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPDFGeneration() {
  try {
    console.log("=== Direct PDF Generation Test ===\n");
    console.log("Step 1: Preparing test data...");

    const testData = {
      clientName: "John Doe",
      clientPan: "ABCDE1234F",
      clientEmail: "john@example.com",
      clientPhone: "+91-9999999999",
      signatureData: null, // Test without signature first
      signedDate: new Date().toLocaleDateString("en-IN"),
    };

    console.log("Test Data:", JSON.stringify(testData, null, 2));

    console.log("\nStep 2: Generating PDF with complete agreement...");
    const pdfBuffer = await generateCompleteAgreementPDF(testData);

    console.log(`✅ PDF generated successfully!`);
    console.log(`   File size: ${pdfBuffer.length} bytes`);
    console.log(`   Expected: ~15000+ bytes (much larger than 2096 bytes)`);

    // Save to file for inspection
    const outputPath = path.join(__dirname, "test-output.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`   Saved to: ${outputPath}`);

    // Verify size
    if (pdfBuffer.length > 5000) {
      console.log(
        "\n✅ SUCCESS: PDF size is substantial (includes full agreement content)",
      );
    } else {
      console.log("\n⚠️ WARNING: PDF might be truncated (size is small)");
    }

    console.log("\n=== Test Complete ===");
  } catch (error) {
    console.error("❌ Error during PDF generation:");
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testPDFGeneration();
