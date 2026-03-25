# 📘 Admin Suite - Quick Reference Guide

**For: Operations Team, Customer Service, Management**

---

## 🎯 What Can You Do?

### 1. View All Customer Payments
- See every payment made by customers
- Search for specific customers
- Check if subscription is active or expired
- Download payment records

### 2. Manage Subscription Plans
- Create new subscription packages
- Edit plan prices and details
- Delete plans customers don't want
- Hide/show plans to customers

### 3. View Plan Analytics
- See which plans are popular
- Track revenue per plan
- Monitor customer subscriptions

---

## 🚪 How to Access

### Step 1: Login
```
1. Go to: trademilaan.com/login
2. Enter your admin email & password
3. Click "Login"
```

### Step 2: Go to Admin Dashboard
```
Click your profile picture (top right)
You should see "Admin Dashboard" option
Click it
```

### Step 3: Select What You Want to Do

From the left sidebar, click:

| Menu Item | What It Does |
|-----------|-------------|
| **Plans** | Add/Edit/Delete subscription plans |
| **Payment Audit** | View all customer payments |
| **Plan Details** | View & manage plan information |
| **Subscriptions** | Overview of active subscriptions |

---

## 💳 Payment Audit Page Explained

### What You See:

**Top Section (Statistics):**
```
┌─────────────────────────────────────────┐
│ Total Revenue  │ Total Payments │ Active │
│  ₹84,95,000   │      125      │   45   │
└─────────────────────────────────────────┘
```

**Search & Filter Section:**
```
Search: [Type customer name or email...]
Filter: [All] [Active] [Expired]
```

**Payment Table:**
```
DATE      | CUSTOMER | EMAIL           | AMOUNT | STATUS   | DETAILS
2026-03-26| John Doe | john@email.com  | ₹4,999 | ✓ Active | [View]
2026-03-20| Jane Doe | jane@email.com  | ₹9,999 | ✗ Expired| [View]
```

---

## 🔍 How to Find Specific Payments

### Method 1: Search by Email
1. Type customer's email in search box
2. Press Enter or wait for auto-search
3. See all their payments

### Method 2: Search by Name
1. Type customer's first/last name
2. See matching payments

### Method 3: Filter by Status
1. Click "Active" button to see active subscriptions only
2. Click "Expired" button to see expired subscriptions only
3. Click "All" to see everything

### Method 4: Use Multiple Filters
1. Type email in search
2. Click "Active" filter
3. See only active subscriptions for that person

---

## 📥 Download Payment Records

### How to Export CSV:
```
1. (Optional) Search/filter payments you want
2. Click "Export CSV" button
3. File downloads to your computer
4. Open in Excel to view/analyze
```

### File Contents:
```
Customer Name | Email | Phone | Amount | Date Paid | Expires | Status
John Doe      | john@...| 9876543210 | 4999 | 2026-03-26 | 2026-04-25 | Active
```

---

## 📋 Plan Management

### Create New Plan
```
1. Go to "Plans" page
2. Click "Create Plan" button
3. Fill in:
   - Plan Name (e.g., "Pro Monthly")
   - Type (Monthly/Yearly)
   - Price (in ₹)
   - Duration (number of days)
   - Features (comma-separated)
   - Description
4. Click "Save"
```

### Edit Existing Plan
```
1. Go to "Plans" page
2. Find the plan in the table
3. Click "Edit" icon (pencil)
4. Change any details
5. Click "Save"
```

### Delete Plan
```
1. Go to "Plans" page
2. Find the plan
3. Click "Delete" icon (trash)
4. Confirm deletion
```

### Activate/Deactivate Plan
```
1. Go to "Plans" page
2. Find the plan
3. Click the Status toggle
- Green = Visible to customers
- Gray = Hidden from customers
```

---

## 👥 Customer Information Available

When you click "View" on a payment, you see:
- Customer's full name
- Email address
- Phone number
- Amount paid
- When they paid
- When subscription expires
- Payment ID (for Razorpay)
- Order ID

---

## ⏰ Understanding Subscription Status

### ✅ ACTIVE
- Customer's subscription is currently valid
- They can access premium features
- Days left until expiration shown

### ❌ EXPIRED
- Customer's subscription has ended
- They no longer have access
- They need to renew

### Example:
```
Paid: March 26, 2026
Expires: April 25, 2026
Today: April 10, 2026

Status: ✓ ACTIVE
Days Left: 15 days
```

---

## 📊 Statistics Explained

**Total Revenue**
- Total money received from all customers
- Includes active and expired subscriptions

**Total Payments**
- How many purchases were made
- Not the same as number of customers

**Active Subscriptions**
- Number of customers with valid subscriptions right now
- Helps you know user count

---

## 🛠️ Common Tasks

### Task 1: Find Payments from This Week
```
1. Go to Payment Audit
2. Look at "DATE" column
3. Find entries from this week
4. Click "View" for details
```

### Task 2: Find Expired Subscriptions
```
1. Go to Payment Audit
2. Click "Expired" filter
3. See all payments that have ended
```

### Task 3: Check Customer Payment History
```
1. Go to Payment Audit
2. Type customer's email
3. See all their purchases
4. Check active and expired subscriptions
```

### Task 4: Create New Monthly Plan
```
1. Go to Plans
2. Click "Create Plan"
3. Name: "Standard Monthly"
4. Type: "Monthly"
5. Price: 499
6. Duration: 30
7. Features: "Access to all tools"
8. Click "Save"
```

### Task 5: Update Plan Price
```
1. Go to Plans
2. Click "Edit" on the plan
3. Change price field
4. Click "Save"
```

---

## ⚠️ Important Notes

❌ **Don't:**
- Delete popular plans suddenly (gives 24h notice to customers)
- Change prices drastically without notification
- Share payment data with unauthorized people

✅ **Do:**
- Export records regularly for backup
- Check expired subscriptions for renewal opportunities
- Keep plan names clear and descriptive
- Monitor revenue trends

---

## 🆘 Issues & Solutions

### Issue: Can't see other admins' changes
**Solution:** Refresh the page (press F5)

### Issue: Search returned no results
**Solution:** Try full email address or first name only

### Issue: Download button doesn't work
**Solution:** Check browser pop-up blocker settings

### Issue: Can't edit a plan
**Solution:** Make sure you're logged in as admin

### Issue: New plan not showing to customers
**Solution:** Make sure it's "Active" (green badge)

---

## 📞 Tips for Support Staff

### When Customer Asks: "Did my payment go through?"
```
1. Go to Payment Audit
2. Search customer's email
3. If you see payment → "Yes, completed on [DATE]"
4. If you see "Active" status → "Yes, subscription is active until [DATE]"
5. If payment shows "Expired" → "Your subscription ended on [DATE], please renew"
```

### When Customer Asks: "When does my subscription end?"
```
1. Search customer's email
2. Find their most recent payment
3. Look at "EXPIRES" column
4. Tell them: "Your subscription expires on [DATE]"
5. Calculate days left: "That's X days from today"
```

### When Customer Asks: "I paid but don't have access"
```
1. Search customer's email
2. If recent payment shows "Expired" → "It has ended, please renew"
3. If payment shows "Active" → "Your access should be working, contact support"
4. If no payment found → "No payment record, did you complete the purchase?"
```

---

## 🎓 Training Checklist

- [ ] Can login to admin dashboard
- [ ] Know where Payment Audit page is
- [ ] Can search for customer payments
- [ ] Can filter by status (Active/Expired)
- [ ] Can export CSV file
- [ ] Know what each column means
- [ ] Can find customer subscription expiry date
- [ ] Can tell if subscription is active
- [ ] Know how to create new plan
- [ ] Know how to edit plan price
- [ ] Can correctly answer customer queries

---

## 🎯 Daily Checklist

**Every morning:**
- [ ] Check Total Revenue from yesterday
- [ ] Review new payments
- [ ] Note any payment issues

**Every week:**
- [ ] Export payment records
- [ ] Review active subscription count
- [ ] Check for customers nearing expiry

**Every month:**
- [ ] Calculate revenue trends
- [ ] Review most popular plans
- [ ] Update plan prices if needed

---

## 📱 Mobile Access

You can access from phone:
```
1. Open browser
2. Go to: [your-domain]/admin-dashboard
3. View is optimized for mobile
4. All features work on phone
```

However, detailed work better on desktop.

---

## 🔐 Security Reminders

🔒 **Never share:**
- Your admin password
- Customer payment details
- Admin dashboard link

✅ **Always:**
- Logout when done
- Use strong password
- Report suspicious activity

---

**Questions?** Ask your team lead or IT support!

**That's it - you're ready to use the Admin Suite!** 🎉
