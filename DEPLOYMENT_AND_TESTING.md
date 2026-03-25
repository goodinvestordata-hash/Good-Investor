# 🚀 Deployment & Testing Guide

**For: Developers, QA, DevOps Team**

---

## ✅ Pre-Deployment Checklist

### Environment Setup

- [ ] Node.js 18+ installed
- [ ] MongoDB connection string configured
- [ ] JWT secret key set in `.env.local`
- [ ] Razorpay API keys configured
- [ ] All dependencies installed (`npm install`)

### Code Review

- [ ] All files created successfully
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (if applicable)

### Database

- [ ] MongoDB connection working
- [ ] All models properly created
- [ ] Indexes created for performance
- [ ] Sample test data inserted

### Authentication

- [ ] JWT token generation working
- [ ] HTTP-only cookies set properly
- [ ] Token expiry (7 days) configured
- [ ] Admin role verification working

---

## 🧪 Testing Procedures

### Test 1: User Payment History (`/my-subscriptions`)

**Objective:** Verify user can view personal payment history

**Steps:**
```
1. Login as regular user
2. Click profile picture (top right)
3. Click "My Subscriptions"
4. Should see table with payment history
5. Each row shows: Date, Amount, Status, Expires
6. Status should match: Active (green) or Expired (red)
```

**Expected Results:**
- ✅ Page loads without errors
- ✅ User sees only their own payments
- ✅ Correct payment data displayed
- ✅ Status badges show correct colors
- ✅ Days remaining calculated correctly

**Test Data Setup:**
```javascript
// Insert test payment for user
db.payments.insertOne({
  name: "Test User",
  email: "test@example.com",
  phone: "9876543210",
  amount: 4999,
  paidAt: new Date(),
  expiresAt: new Date(Date.now() + 30*24*60*60*1000), // 30 days from now
  razorpay_payment_id: "pay_test123",
  razorpay_order_id: "order_test123",
  razorpay_signature: "sig_test123"
})
```

---

### Test 2: Admin Payment Audit (`/admin-payment-audit`)

**Objective:** Verify admin can view all payments with search/filter

**Steps:**
```
1. Login as admin user
2. Go to admin dashboard
3. Click "Payment Audit" sidebar link
4. Should see dashboard with statistics
5. See payment table below
```

**Expected Results:**
- ✅ Statistics cards display correct numbers
- ✅ Payment table shows all payments
- ✅ Search box works (type email, name, payment ID)
- ✅ Filter buttons work (All, Active, Expired)
- ✅ Export CSV downloads file
- ✅ Pagination works (prev/next buttons)

**Manual Testing Sequence:**
```
1. Search by email: Type "test@example.com"
   → Should show only payments from that user

2. Filter by Active: Click "Active" button
   → Should show only non-expired payments

3. Filter by Expired: Click "Expired" button
   → Should show only expired payments

4. Export CSV: Click "Export CSV"
   → File should download to Downloads folder
   → Open in Excel to verify data

5. Check Pagination: If > 10 payments, click "Next"
   → Should show next 10 payments
```

---

### Test 3: Admin Plan Management (`/admin-plans`)

**Objective:** Verify admin can CRUD plans

**Steps:**

#### Create Plan:
```
1. Go to /admin-plans
2. Click "Create Plan" button
3. Fill form:
   - Name: "Test Plan Pro"
   - Type: "Monthly"
   - Price: "999"
   - Duration: "30"
   - Features: "Feature 1, Feature 2"
   - Description: "Test description"
4. Click "Save"
5. Plan should appear in table
```

#### Expected:
- ✅ Form validates (required fields)
- ✅ Plan saved to database
- ✅ Appears in table immediately
- ✅ New plan accessible in `/api/plans`

#### Edit Plan:
```
1. Find plan in table
2. Click "Edit" button
3. Change price to "1999"
4. Click "Save"
5. Table updates with new price
```

#### Expected:
- ✅ Edit form pre-fills current data
- ✅ Changes saved to database
- ✅ Table reflects updated data

#### Toggle Status:
```
1. Find plan in table
2. Click status toggle
3. Green (Active) → Gray (Inactive) or vice versa
```

#### Expected:
- ✅ Badge changes color immediately
- ✅ Database updated
- ✅ Inactive plans not visible to users

#### Delete Plan:
```
1. Find plan in table
2. Click "Delete" button
3. Confirm delation
4. Plan disappears from table
```

#### Expected:
- ✅ Confirmation dialog appears
- ✅ Plan removed from database
- ✅ Table updates immediately

---

### Test 4: Admin Plan Details (`/admin-plan-details`)

**Objective:** Verify admin can view and manage plan analytics

**Steps:**
```
1. Go to /admin-plan-details
2. Should see all plans listed
3. Click on plan to expand
4. Should see full description and features
5. Click "Edit" to modify plan
6. Click "Delete" to remove
7. Click "Activate"/"Deactivate" to toggle
```

**Expected Results:**
- ✅ All plans display correctly
- ✅ Expansion shows full details
- ✅ Edit button opens form
- ✅ Delete button removes plan
- ✅ Status toggle works

---

### Test 5: API Authentication

**Objective:** Verify all APIs properly authenticate requests

**Test Admin-Only Endpoint:**
```bash
# Without token - should fail
curl "http://localhost:3000/api/admin/payments-audit"
# Expected: 401 Unauthorized or redirected

# With valid admin token - should work
curl -H "Cookie: token=YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/admin/payments-audit"
# Expected: 200 OK with payment data

# With invalid token - should fail
curl -H "Cookie: token=invalid_token" \
  "http://localhost:3000/api/admin/payments-audit"
# Expected: 401 Unauthorized
```

**Test User Endpoint:**
```bash
# Without token - should fail
curl "http://localhost:3000/api/user/payments"
# Expected: 401 Unauthorized

# With valid user token - should work
curl -H "Cookie: token=YOUR_USER_TOKEN" \
  "http://localhost:3000/api/user/payments"
# Expected: 200 OK with user's payments only
```

---

### Test 6: Data Isolation

**Objective:** Verify users can't see other users' data

**Setup:**
```javascript
// Create two test users
User 1: user1@test.com
User 2: user2@test.com

// Create payments for each
User 1: 3 payments
User 2: 2 payments
```

**Test Procedure:**
```
1. Login as User 1
2. Go to /my-subscriptions
3. Should see exactly 3 payments
4. Should NOT see User 2's payments

5. Logout and login as User 2
6. Go to /my-subscriptions
7. Should see exactly 2 payments
8. Should NOT see User 1's payments

9. Login as admin
10. Go to /admin-payment-audit
11. Should see all 5 payments from both users
```

---

### Test 7: CSV Export Functionality

**Objective:** Verify CSV export works correctly

**Steps:**
```
1. Go to /admin-payment-audit
2. Click "Export CSV"
3. Check Downloads folder
4. Open file in Excel/Sheets
5. Verify headers and data
```

**Expected CSV Format:**
```csv
Date,Customer Name,Email,Phone,Amount,Status,Payment ID
2026-03-26,John Doe,john@test.com,9876543210,4999,Active,pay_ABC123
2026-03-20,Jane Doe,jane@test.com,9876543211,9999,Expired,pay_ABC124
```

---

### Test 8: Pagination

**Objective:** Verify pagination works with many records

**Setup:**
```bash
# Create 25 test payments
# This will create pages with 10 items each
for i in {1..25}; do
  db.payments.insertOne({
    name: "Test User $i",
    email: "user$i@test.com",
    phone: "98765432${i}0",
    amount: 4999,
    paidAt: new Date(),
    expiresAt: new Date(Date.now() + 30*24*60*60*1000),
    razorpay_payment_id: "pay_test${i}",
    razorpay_order_id: "order_test${i}",
    razorpay_signature: "sig_test${i}"
  })
done
```

**Test:**
```
1. Go to /admin-payment-audit
2. Should see "Showing 1-10 of 25"
3. Click "Next" button
4. Should show "Showing 11-20 of 25"
5. Click "Next" again
6. Should show "Showing 21-25 of 25"
7. Click "Previous"
8. Should go back to previous page
```

---

## 🔍 Browser DevTools Testing

### Check Network Requests:
```
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (search, filter, etc.)
4. Look for API requests
5. Verify:
   - Status: 200 (success)
   - Response has correct data
   - No 400/500 errors
```

### Check Console for Errors:
```
1. Open DevTools (F12)
2. Go to Console tab
3. Perform all actions
4. Should see no red error messages
5. Should see successful API calls logged
```

### Check Application (Cookies):
```
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Cookies"
4. Find your domain
5. Should see "token" cookie:
   - HttpOnly: ✅ (checked)
   - Secure: ✅ (checked for HTTPS)
   - SameSite: Strict or Lax
```

---

## 📊 Performance Testing

### Load Test Payment Audit Page:
```
1. Create 1000 test payments
2. Go to /admin-payment-audit
3. Page should load in < 3 seconds
4. Search should return results < 1 second
5. Filter should apply < 1 second
6. Export should complete < 5 seconds
```

### Load Test with Multiple Admins:
```
1. Have 5 users simultaneously view /admin-payment-audit
2. Each should load without timeouts
3. No database connection errors
4. All see consistent data
```

---

## 🛡️ Security Testing

### Test SQL Injection Protection:

**Try searching with:**
```
"; DROP TABLE payments; --
' OR '1'='1
```

**Expected:**
- ✅ Search treats as literal string
- ✅ No data deleted or modified
- ✅ Returns no results (gibberish search)

### Test XSS Protection:

**Try creating plan with:**
```
Name: <script>alert('XSS')</script>
```

**Expected:**
- ✅ Script saved as literal text
- ✅ No alert shows on page
- ✅ Text displays escaped/sanitized

### Test Authorization:

**Try accessing admin endpoints as regular user:**
```
User token → GET /api/admin/payments-audit
```

**Expected:**
- ✅ 401 Unauthorized error
- ✅ User cannot see data
- ✅ Error logged for audit

---

## 📝 Deployment Steps

### Step 1: Final Build
```bash
cd /path/to/project
npm run build
# Should complete without errors
```

### Step 2: Environment Checks
```bash
# Verify all environment variables set
echo $MONGODB_URI
echo $JWT_SECRET
echo $RAZORPAY_KEY_ID
echo $RAZORPAY_KEY_SECRET
# All should output values
```

### Step 3: Database Migrations
```bash
# Run any pending migrations
npm run migrate
# or manually verify indexes exist
```

### Step 4: Start Server
```bash
npm start
# or
npm run dev
```

### Step 5: Verification Tests
```bash
# Run quick smoke tests
npm test
# or manually:
1. Login as admin
2. Go to /admin-payment-audit
3. Should see data immediately
4. No errors in console
```

---

## 🐛 Debugging Guide

### Issue: API returns 401 Unauthorized

**Check:**
```
1. Is JWT token in cookies?
2. Has token expired? (7 days)
3. Is signature valid?
4. Is user role correct for endpoint?
```

**Fix:**
```bash
# Re-login to get new token
# Check JWT_SECRET matches
echo $JWT_SECRET
```

### Issue: Database connection fails

**Check:**
```
1. MongoDB URI correct in .env
2. MongoDB server running
3. Network connection stable
4. Credentials correct
```

**Fix:**
```bash
# Test connection
npm run test:db
# or
mongo "mongodb://..." --eval "db.adminCommand('ping')"
```

### Issue: Payment data not showing

**Check:**
```
1. Payments exist in database
2. User is admin (for /admin-payment-audit)
3. Email matches in search
4. No filters hiding results
```

**Fix:**
```bash
# Check database
db.payments.find().count()
db.payments.findOne()
# Check user role
db.users.findOne({email: "admin@test.com"})
```

### Issue: Export CSV is empty

**Check:**
```
1. Payment data exists
2. Search/filters not too restrictive
3. Sufficient permissions
4. Browser allows downloads
```

**Fix:**
```
1. Clear filters (click "All")
2. Check browser download settings
3. Try with different browser
```

---

## ✅ Go-Live Checklist

**Final Approval:**
- [ ] All tests pass
- [ ] No console errors
- [ ] Database optimized (indexes created)
- [ ] Environment variables set correctly
- [ ] SSL/HTTPS configured
- [ ] Backups created
- [ ] Monitoring set up
- [ ] Team trained on features
- [ ] Documentation complete
- [ ] Support process defined

**Day 1 Monitoring:**
- [ ] Check error logs every hour
- [ ] Monitor database performance
- [ ] Verify no unexpected user reports
- [ ] Check payment audit updates in real-time
- [ ] Test export functionality during business hours

**Week 1 Review:**
- [ ] Analyze usage patterns
- [ ] Check for any data inconsistencies
- [ ] Review admin feedback
- [ ] Adjust database indexes if needed

---

## 📞 Support Contacts

**Database Issues:**
- MongoDB Support: [support.mongodb.com](https://support.mongodb.com)
- Check: Disk space, connection limits, slow queries

**API Issues:**
- Check: JWT secret, CORS headers, request format
- Logs: `/var/log/app.log` (if available)

**Frontend Issues:**
- Browser console (F12) for errors
- Network tab to verify API responses
- Clear cache: Ctrl+Shift+Delete

---

**Deployment complete! 🎉**

**All systems ready for production!** ✅
