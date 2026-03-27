/**
 * Admin Dashboard Tab Testing
 * Tests all tabs and their API calls
 */

const API_ENDPOINTS = {
  users: "/api/admin/users",
  payments: "/api/admin/payments",
  agreements: "/api/admin/agreements",
  signedAgreements: "/api/admin/signed-agreements",
  documents: "/api/admin/documents",
  riskprofiles: "/api/admin/riskprofiles",
  analytics: "/api/admin/analytics",
  subscriptions: "/api/admin/payments", // Subscriptions reuse payments API
  paymentAudit: "/api/admin/payments-audit",
  plans: "/api/plans",
};

const TABS = [
  "users",
  "payments",
  "agreements",
  "signedAgreements",
  "documents",
  "riskprofiles",
  "analytics",
  "plans",
  "subscriptions",
  "paymentAudit",
];

async function testAllAPIs() {
  console.log("🧪 Testing All Admin Dashboard APIs...\n");
  
  const results = {};
  let passCount = 0;
  let failCount = 0;
  const baseUrl = "http://localhost:3000";
  
  for (const tab of TABS) {
    const endpoint = API_ENDPOINTS[tab];
    const fullUrl = `${baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(fullUrl);
      const status = response.status;
      
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }
      
      const isValid = 
        status === 200 || 
        (status === 401) || // Auth check
        (status === 400 && data?.message); // Some endpoints return 400 with message
      
      results[tab] = {
        endpoint,
        status,
        ok: response.ok,
        hasData: data ? true : false,
        error: isValid ? null : "Unexpected response",
      };
      
      if (response.ok || status === 401) {
        console.log(`✅ ${tab.padEnd(20)} → Status: ${status}`);
        passCount++;
      } else {
        console.log(`⚠️  ${tab.padEnd(20)} → Status: ${status}`);
        failCount++;
      }
    } catch (err) {
      results[tab] = {
        endpoint,
        ok: false,
        error: err.message,
      };
      console.log(`❌ ${tab.padEnd(20)} → Error: ${err.message}`);
      failCount++;
    }
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Working: ${passCount} | ⚠️  Issues: ${failCount}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  return results;
}

async function testStateIsolation() {
  console.log("🔍 Testing State Isolation Between Tabs...\n");
  
  // This would need to be run in browser context with React dev tools
  console.log("ℹ️  State isolation must be verified in browser console:");
  console.log("   1. Open DevTools (F12)");
  console.log("   2. Click each tab");
  console.log("   3. Verify activeTab state changes");
  console.log("   4. Confirm data doesn't leak between tabs\n");
}

async function testNoDoubleRequests() {
  console.log("🔄 Checking for Duplicate API Calls...\n");
  console.log("ℹ️  Use Network tab in DevTools to verify:");
  console.log("   1. Each tab's API only loads once per switch");
  console.log("   2. No duplicate requests on tab switch");
  console.log("   3. Analytics/Plans/Subscriptions have their own useEffect\n");
}

// Run tests
(async () => {
  await testAllAPIs();
  await testStateIsolation();
  await testNoDoubleRequests();
})();
