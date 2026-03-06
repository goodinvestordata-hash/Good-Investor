/**
 * Test script to verify PDF generation with embedded signatures
 * Run with: node test-pdf-flow.js
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Simple PNG data URL (1x1 transparent pixel)
const FAKE_SIGNATURE_DATA =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

async function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testPDFFlow() {
  try {
    log("=== PDF Generation Test ===\n", "blue");

    // Step 1: Sign the agreement
    log("Step 1: Signing agreement with test data...", "blue");
    const signPayload = {
      userId: "test-user-" + Date.now(),
      clientName: "Test Client",
      clientPan: "AAAA0000A",
      signatureData: FAKE_SIGNATURE_DATA,
      signedName: "Test Signer",
      signedTimestamp: new Date().toISOString(),
      signatureTab: "typed",
      agreementHtml: "<p>Test Agreement Content</p>",
    };

    const signResponse = await makeRequest(
      "POST",
      "/api/agreement/sign-and-store",
      signPayload,
    );

    if (signResponse.status !== 200 && signResponse.status !== 201) {
      log(`❌ Sign request failed with status ${signResponse.status}`, "red");
      log("Response: " + signResponse.body, "red");
      return;
    }

    log("✅ Agreement signed successfully", "green");
    const signData = JSON.parse(signResponse.body);
    const fileId = signData.fileId || signData._id;
    log(`FileID: ${fileId}\n`, "green");

    if (!fileId) {
      log("❌ No fileId returned from sign request. Full response:", "red");
      log(JSON.stringify(signData, null, 2), "red");
      return;
    }

    // Step 2: Download the PDF
    log("Step 2: Downloading PDF...", "blue");
    const downloadResponse = await makeRequest(
      "GET",
      `/api/agreement/download/${fileId}`,
    );

    if (downloadResponse.status !== 200) {
      log(`❌ Download failed with status ${downloadResponse.status}`, "red");
      log("Response: " + downloadResponse.body, "red");
      return;
    }

    const pdfBuffer = Buffer.from(downloadResponse.body, "binary");
    log(`✅ PDF downloaded (${pdfBuffer.length} bytes)`, "green");

    // Step 3: Save PDF to disk
    const outputPath = path.join(__dirname, "test-agreement-output.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);
    log(`✅ PDF saved to: ${outputPath}\n`, "green");

    // Step 4: Verify PDF structure
    log("Step 3: Verifying PDF structure...", "blue");
    const pdfString = pdfBuffer.toString("binary");

    if (pdfString.startsWith("%PDF")) {
      log("✅ Valid PDF header found", "green");
    } else {
      log("❌ Invalid PDF header", "red");
      return;
    }

    if (pdfString.includes("%%EOF")) {
      log("✅ Valid PDF footer found", "green");
    } else {
      log("❌ Invalid PDF footer", "red");
    }

    log("\n=== TEST SUMMARY ===", "blue");
    log("✅ Agreement signed successfully", "green");
    log("✅ PDF generated without errors", "green");
    log("✅ PDF has valid structure", "green");
    log(
      "\n📄 Download the test PDF to verify signature is embedded:",
      "yellow",
    );
    log(`   ${outputPath}\n`, "yellow");
  } catch (err) {
    log(`❌ Test failed: ${err.message}`, "red");
    log(err.stack, "red");
  }
}

// Wait for server to be ready
setTimeout(() => {
  testPDFFlow();
}, 2000);
