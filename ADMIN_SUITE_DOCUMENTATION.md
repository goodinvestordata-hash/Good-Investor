# 🎛️ Admin Suite - Complete Documentation

## 📌 Overview

The admin suite provides complete subscription & payment management with three powerful pages:

1. **Plan Management** (`/admin-plans`)
2. **Plan Details & Analytics** (`/admin-plan-details`)
3. **Payment Audit History** (`/admin-payment-audit`)

---

## 🗂️ Files Created

### Backend API Endpoints

**`src/app/api/admin/payments-audit/route.js`** - Admin Payment Audit API
```javascript
GET /api/admin/payments-audit
- Requires: JWT token + Admin role
- Returns: All payments, stats
- Stats: totalRevenue, totalTransactions, activeCount
```

### Frontend Pages

**`src/app/admin-plan-details/page.js`** - Plan Details & Analytics
- Expandable plan cards
- View all plan features
- Edit/Delete/Activate/Deactivate actions

**`src/app/admin-payment-audit/page.js`** - Payment Audit History
- Search by customer, email, payment ID
- Filter by status (All, Active, Expired)
- Export to CSV
- Pagination
- Revenue statistics

### Updated Files

**`src/app/admin-dashboard/page.js`** - Added sidebar links
- "Payment Audit" link to `/admin-payment-audit`
- "Plan Details" link to `/admin-plan-details`

---

## 🚀 How to Access

### 1. Login as Admin
```
Go to: /login
Email: admin@example.com (or any admin account)
Password: your_password
```

### 2. Go to Admin Dashboard
```
URL: /admin-dashboard
Or click profile → (admin only sees this)
```

### 3. Access Admin Features from Sidebar
- **Plans** → `/admin-plans` (create/edit plans)
- **Plan Details** → `/admin-plan-details` (view & manage)
- **Payment Audit** → `/admin-payment-audit` (all payments)
- **Subscriptions** → `/admin-subscriptions` (user subscriptions)

---

## 💻 Detailed Features

### Page 1: Admin Plans (`/admin-plans`)

#### What You Can Do:
✅ Create new plans  
✅ Edit existing plans  
✅ Delete plans  
✅ Toggle active/inactive status  
✅ View all plans in table  

#### Features:
- Plan name, type, price, duration, features
- Quick add/edit forms
- Drag to expand row for more details
- Green badge = Active, Gray badge = Inactive

---

### Page 2: Plan Details & Analytics (`/admin-plan-details`)

#### What You Can Do:
✅ View all plans with full details  
✅ Expand plans to see description & features  
✅ Edit/Delete/Activate plans  
✅ See purchase analytics  

#### Features:
- Expandable plan cards
- Type badge
- Price & duration display
- Active status indicator
- Quick actions: Edit, Delete, Activate/Deactivate
- View all features for each plan

#### Example Usage:
```
1. Go to /admin-plan-details
2. See all your plans listed
3. Click on a plan to expand it
4. See full description and feature list
5. Click "Edit" to modify
6. Click "Delete" to remove
7. Click "Activate/Deactivate" to toggle visibility
```

---

### Page 3: Payment Audit History (`/admin-payment-audit`)

#### What You Can Do:
✅ View all payments from all users  
✅ Search by customer name, email, payment ID  
✅ Filter by status (Active/Expired)  
✅ Export data as CSV  
✅ View payment details  

#### Features:

**Statistics Cards:**
- Total Revenue
- Total Transactions
- Active Subscriptions

**Search & Filter:**
- Real-time search box
- Status filter buttons (All, Active, Expired)
- Result counter

**Payment Table Columns:**
| Column | Details |
|--------|---------|
| DATE | Payment date & time |
| CUSTOMER | User's name |
| EMAIL | User's email |
| PHONE | User's phone |
| AMOUNT | Payment amount (₹) |
| STATUS | Active or Expired |
| PAYMENT ID | Razorpay payment ID |
| DETAILS | View button for details |

**Pagination:**
- Shows 10 payments per page
- Previous/Next buttons
- Page numbers

**Export:**
- Download CSV button
- Exports search results
- Filename: `payment-audit-{date}.csv`

#### Example Usage:
```
1. Go to /admin-payment-audit
2. See dashboard stats at top
3. Use search box to find specific payments
4. Click status filters to narrow down
5. Click "View" button to see full payment details
6. Click "Export CSV" to download data
7. Use pagination to browse through payments
```

---

## 📊 Complete Flow Chart

```
Admin Login
    ↓
/admin-dashboard (sidebar)
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│                 │                 │                 │
▼                 ▼                 ▼                 ▼
Plans         Subscriptions    Payment Audit    Plan Details
├─ Create     ├─ View all      ├─ Search        ├─ View plans
├─ Edit       │  subscriptions  ├─ Filter        ├─ Expand
├─ Delete     ├─ Filter by     ├─ Export CSV    ├─ Edit
└─ Toggle     │  status        ├─ View stats    ├─ Delete
              └─ Track         └─ Paginate      └─ Toggle
                 expiry
```

---

## 🔍 Search & Filter Examples

### Searching Payments
```
Search Term         | Result
────────────────────|──────────────────────
"user@email.com"   | All payments by that user
"pay_ABC123"       | Specific payment ID
"John"             | All payments by customers named John
```

### Filtering by Status
```
Status      | Shows
────────────|──────────────────────
All         | All payments
Active      | Payments not yet expired
Expired     | Payments that have expired
```

---

## 📈 Statistics Explained

### Revenue Stats (Payment Audit Page)
- **Total Revenue**: Sum of all payment amounts
- **Total Transactions**: Number of payments received
- **Active Subscriptions**: Payments not yet expired

### Plan Stats (Plan Details Page)
- Plan count
- Active vs Inactive status
- Feature count
- Price range

---

## 🎨 Color Scheme

```
Green (#9BE749)   = Active/Positive status
Red (#EF4444)     = Expired/Negative status
Blue (#3B82F6)    = Primary actions (Edit)
Orange (#F97316)  = Warning (Deactivate)
Gray              = Inactive/Disabled
```

---

## 🔐 Authorization

All admin pages require:
1. ✅ Valid JWT token in cookies
2. ✅ User role must be "admin"
3. ✅ If not admin → redirects to home page

---

## ⚡ Quick Start Checklist

- [ ] Login as admin
- [ ] Go to `/admin-dashboard`
- [ ] Click "Payment Audit" in sidebar
- [ ] See all payments & statistics
- [ ] Use search to find specific payments
- [ ] Click "View" to see payment details
- [ ] Export CSV for records
- [ ] Check "Subscriptions" tab
- [ ] Check "Plan Details" tab
- [ ] Edit/Delete/Activate plans as needed

---

## 🐛 Troubleshooting

### Issue: "Admin access required" error
**Solution:** Log in with an admin account (check user role in database)

### Issue: No payments showing
**Solution:** Users need to complete purchases first; test with existing payments

### Issue: Search not working
**Solution:** Make sure to type exactly (case-insensitive); click a filter first

### Issue: Export CSV not working
**Solution:** Check browser download settings; file should be in Downloads folder

---

## 📱 Responsive Design

All pages work on:
✅ Desktop (full features)  
✅ Tablet (optimized layout)  
✅ Mobile (scrollable tables)  

---

## 🌐 API Reference

### Get All Payments (Admin)
```
GET /api/admin/payments-audit

Response:
{
  success: true,
  payments: [
    {
      _id: "...",
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      amount: 4999,
      paidAt: "2026-03-26T10:00:00Z",
      expiresAt: "2026-04-25T10:00:00Z",
      razorpay_payment_id: "pay_...",
      razorpay_order_id: "order_..."
    }
  ],
  stats: {
    totalRevenue: 100000,
    totalTransactions: 25,
    activeCount: 20
  }
}
```

---

## 📝 Example Workflow

### Scenario: Track a specific customer's purchases

1. **Step 1:** Go to `/admin-payment-audit`
2. **Step 2:** Type customer email in search box
3. **Step 3:** See all their payments
4. **Step 4:** Click "View" on any payment for details
5. **Step 5:** Check if subscription is active or expired
6. **Step 6:** Note the expiry date for follow-up

---

## 🎯 Best Practices

1. **Check Payment Audit regularly** - Monitor revenue trends
2. **Export CSV monthly** - Keep records for accounting
3. **Review expired subscriptions** - Identify renewal opportunities
4. **Keep plans active** - Inactive plans hidden from users
5. **Update plan prices** - Reflect market changes
6. **Monitor customer emails** - Spot duplicate accounts

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Verify JWT token is valid
3. Ensure user role is "admin"
4. Check MongoDB connection
5. Look at server logs for errors

---

**Everything is ready to use!** 🚀

**Happy managing!** 🎉
