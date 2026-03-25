# ✅ Testing & Validation Checklist

## 🧪 Manual Testing Guide

### Test 1: Admin Can Create a Plan

**Steps:**
1. Login as admin at `/login`
2. Navigate to `/admin-plans`
3. Click "Create Plan" button
4. Fill in form:
   ```
   Name: "Test Equity Pro"
   Type: "monthly"
   Description: "Test equity trading plan"
   Price: 4999
   Duration: 30
   Features: ["Feature 1", "Feature 2", "Feature 3"]
   Active: Checked
   ```
5. Click "Create Plan"

**Expected:**
- ✓ Form validates input
- ✓ No error messages
- ✓ Success message shows
- ✓ Redirects to plan list
- ✓ New plan appears in table

**If Failed:**
- Check browser console for errors
- Check terminal for API logs
- Verify JWT token is valid (admin role)
- Verify MongoDB connection

---

### Test 2: User Cannot Create a Plan

**Steps:**
1. Login as regular user at `/login`
2. Try accessing `/admin-plans` directly
3. Or try API call:
   ```bash
   curl -X POST http://localhost:3000/api/plans \
     -H "Content-Type: application/json" \
     -H "Cookie: token=USER_TOKEN" \
     -d '{"name":"Test","price":999,"duration":30,"features":["test"]}'
   ```

**Expected:**
- ✓ Gets "Forbidden" error (403)
- ✓ Cannot see admin panel
- ✓ Cannot create plans

---

### Test 3: Plans Display on Services Page

**Steps:**
1. Create at least one active plan (Test 1)
2. Navigate to `/services`
3. Scroll down

**Expected:**
- ✓ See "Choose Your Plan" section
- ✓ Plans appear in grid
- ✓ Plan cards show:
  - Name
  - Type badge
  - Description
  - Price
  - Features list
  - "Buy Now" button
  - Duration

---

### Test 4: User Cannot See Inactive Plans

**Steps:**
1. Create a plan (Test 1)
2. In admin table, click the green "Active" badge to toggle
3. Go to `/services`

**Expected:**
- ✓ Plan disappears from services page
- ✓ Plan still visible in admin panel
- ✓ Clicking badge again re-shows plan

---

### Test 5: Edit a Plan

**Steps:**
1. Go to `/admin-plans`
2. Click edit icon (pencil) on a plan
3. Change:
   - Name: "Updated Name"
   - Price: 5999
   - Add a feature
4. Click "Update Plan"

**Expected:**
- ✓ Form pre-fills with existing data
- ✓ Changes save
- ✓ Table updates
- ✓ Changes visible on services page

---

### Test 6: Delete a Plan

**Steps:**
1. Go to `/admin-plans`
2. Click delete icon (trash) on a plan
3. Confirm deletion

**Expected:**
- ✓ Confirmation dialog shows
- ✓ Plan removed from table
- ✓ Plan removed from services page

---

### Test 7: Purchase Flow

**Steps:**
1. Go to `/services`
2. Click "Buy Now" on a plan

**Expected:**
- Logged out user:
  - ✓ Redirects to `/login`
- Logged in user:
  - ✓ Redirects to payment page
  - ✓ Plan name & price pre-filled
  - ✓ Can proceed with Razorpay payment

---

### Test 8: Form Validation

**Test Invalid Inputs:**

```javascript
// Test 1: Empty name
{
  name: "",
  type: "monthly",
  price: 999,
  duration: 30,
  features: ["Feature"]
}
// Expected: Error "Plan name is required"

// Test 2: Name too short
{
  name: "ab", // Only 2 chars
  // ...
}
// Expected: Error "Plan name must be at least 3 characters"

// Test 3: Negative price
{
  price: -100,
  // ...
}
// Expected: Error "Price cannot be negative"

// Test 4: Duration not integer
{
  duration: 30.5,
  // ...
}
// Expected: Error "Duration must be a whole number"

// Test 5: No features
{
  features: [],
  // ...
}
// Expected: Error "At least one feature is required"

// Test 6: Invalid type
{
  type: "invalid_type",
  // ...
}
// Expected: Error "Plan type must be one of: monthly, yearly, ..."
```

---

## 🔍 API Testing with curl

### Create Plan
```bash
curl -X POST http://localhost:3000/api/plans \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Curl Test Plan",
    "type": "monthly",
    "description": "Test via curl",
    "price": 2999,
    "duration": 30,
    "features": ["Feature 1", "Feature 2"]
  }'

# Expected: 201 Created
# Response: { success: true, data: {...} }
```

### Get All Plans
```bash
curl http://localhost:3000/api/plans \
  -H "Cookie: token=USER_JWT_TOKEN"

# Expected: 200 OK
# Response: { success: true, data: [...], count: 3 }
```

### Get Specific Plan
```bash
curl http://localhost:3000/api/plans/PLAN_ID \
  -H "Cookie: token=USER_JWT_TOKEN"

# Expected: 200 OK
# Response: { success: true, data: {...} }
```

### Update Plan
```bash
curl -X PUT http://localhost:3000/api/plans/PLAN_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Updated Plan Name",
    "price": 3999
  }'

# Expected: 200 OK
```

### Delete Plan
```bash
curl -X DELETE http://localhost:3000/api/plans/PLAN_ID \
  -H "Cookie: token=ADMIN_JWT_TOKEN"

# Expected: 200 OK
# Response: { success: true, message: "Plan deleted successfully" }
```

### Toggle Status
```bash
curl -X PATCH http://localhost:3000/api/plans/PLAN_ID/status \
  -H "Cookie: token=ADMIN_JWT_TOKEN"

# Expected: 200 OK
# Response: { success: true, message: "Plan is now active/inactive" }
```

---

## 🐛 Common Test Failures & Fixes

### ❌ "Unauthorized" on Admin Endpoints

**Problem:** Getting 401 Unauthorized

**Solution:**
```bash
# 1. Check if token exists
echo $token

# 2. Check if token is valid
# Go to jwt.io, paste token, verify signature

# 3. Check if user role is "admin"
# Decode token and look for: "role": "admin"

# 4. Verify token is in cookie
# Browser DevTools → Application → Cookies → token
```

### ❌ Validation Errors on Valid Input

**Problem:** "Plan name is required" even though provided

**Solution:**
```javascript
// Check 1: Whitespace
name: "   " // All spaces
// Fix: Trim input: name.trim()

// Check 2: Wrong type
name: 123 // Number instead of string
// Fix: Ensure string type

// Check 3: Null/undefined
name: null
// Fix: Check form state
```

### ❌ Plans Not Showing on Services Page

**Problem:** No plans visible, but no error

**Solution:**
1. Check if any plans created
   ```bash
   curl http://localhost:3000/api/plans
   # Should return array with plans
   ```

2. Check if plans are active
   ```bash
   # In admin: all plans should be green "Active"
   ```

3. Check console for fetch errors
   ```javascript
   // Open DevTools → Console
   // Look for fetch errors
   ```

### ❌ Payment Redirect Not Working

**Problem:** Clicking "Buy Now" doesn't redirect

**Solution:**
```javascript
// 1. Check if useRouter is imported
import { useRouter } from "next/navigation";

// 2. Check if router is initialized
const router = useRouter();

// 3. Check browser console for errors

// 4. Verify URL construction
console.log(`/payment?planId=${plan._id}&...`);
```

### ❌ MongoDB Connection Error

**Problem:** "Cannot connect to database"

**Solution:**
```bash
# 1. Check MONGO_URI in .env
cat .env | grep MONGO_URI

# 2. Verify MongoDB is running
# For local: mongod --version

# 3. Test connection
node -e "console.log(process.env.MONGO_URI)"

# 4. Check logs: npm run dev
# Look for: "Connected to MongoDB"
```

---

## 📊 Performance Testing

### Test with Many Plans

**Create 50 Plans:**
```bash
for i in {1..50}; do
  curl -X POST http://localhost:3000/api/plans \
    -H "Content-Type: application/json" \
    -H "Cookie: token=ADMIN_TOKEN" \
    -d "{
      \"name\": \"Plan $i\",
      \"type\": \"monthly\",
      \"price\": $((1000 + i * 100)),
      \"duration\": 30,
      \"features\": [\"Feature 1\", \"Feature 2\"]
    }"
done
```

**Check Performance:**
1. Get all plans should be fast
2. Table should load smoothly
3. Filter by active should be instant (database index)

---

## 🔐 Security Testing

### Test 1: JWT Forgery Protection

```bash
# Try with invalid JWT
curl -X POST http://localhost:3000/api/plans \
  -H "Cookie: token=INVALID.JWT.HERE" \
  -d '{"name":"Test"}'

# Expected: 401 Unauthorized
```

### Test 2: Role-Based Access

```bash
# User tries to create plan
curl -X POST http://localhost:3000/api/plans \
  -H "Cookie: token=USER_JWT" \
  -d '{"name":"Test"}'

# Expected: 403 Forbidden
```

### Test 3: MongoDB Injection

```bash
# Try MongoDB operator injection
curl -X POST http://localhost:3000/api/plans \
  -H "Cookie: token=ADMIN_JWT" \
  -d '{
    "name": {"$gt": ""},
    "price": 999
  }'

# Expected: Validation error (safe)
```

### Test 4: XSS Protection

```javascript
// Try XSS in form
name: "<script>alert('XSS')</script>"

// Expected: Either sanitized or rejected
```

---

## ✅ Complete Test Checklist

### API Endpoints
- [ ] POST /api/plans (create) - Admin only
- [ ] GET /api/plans (list) - Everyone, filters apply
- [ ] GET /api/plans/:id (single) - Everyone
- [ ] PUT /api/plans/:id (update) - Admin only
- [ ] DELETE /api/plans/:id (delete) - Admin only
- [ ] PATCH /api/plans/:id/status (toggle) - Admin only

### Authorization
- [ ] Admin can create plans
- [ ] User cannot create plans
- [ ] User sees only active plans
- [ ] Admin sees all plans
- [ ] Invalid JWT returns 401
- [ ] Missing JWT returns 401

### Validation
- [ ] Name validation works
- [ ] Price validation works
- [ ] Duration validation works
- [ ] Features validation works
- [ ] Type validation works
- [ ] Error messages clear

### UI Features
- [ ] Plans display on services page
- [ ] Plan cards render correctly
- [ ] "Buy Now" button works
- [ ] Admin form validates client-side
- [ ] Admin table shows all fields
- [ ] Edit form pre-fills data
- [ ] Toggle status button works
- [ ] Delete button works

### Integration
- [ ] Payment receives plan data
- [ ] Profile shows active plan
- [ ] Email sends after purchase
- [ ] Navbar shows plans link
- [ ] Footer shows plans link

### Edge Cases
- [ ] Empty plans list handled
- [ ] No active plans shows message
- [ ] Network error handled gracefully
- [ ] Duplicate plan names allowed
- [ ] Very long descriptions handled

---

## 📋 Before Going to Production

- [ ] All tests pass locally
- [ ] Environmental variables set correctly
- [ ] Error messages are user-friendly
- [ ] Loading states show properly
- [ ] Mobile responsive tested
- [ ] No console errors
- [ ] API responses consistent
- [ ] Database backups configured
- [ ] Rate limiting prepared
- [ ] Error monitoring (Sentry) optional

---

## 🎯 Test Success Criteria

| Criteria | Status |
|----------|--------|
| All CRUD operations work | ✓ |
| Authorization enforced | ✓ |
| Validation prevents bad data | ✓ |
| UI provides good UX | ✓ |
| No console errors | ✓ |
| Performance acceptable | ✓ |
| Mobile works fine | ✓ |
| Security measures in place | ✓ |

---

**Ready for production when all tests pass! 🚀**
