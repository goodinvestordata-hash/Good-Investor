# 🔗 Integration Examples - How to Connect Components

## 1️⃣ Integrate Plans into Services Page

### Current Services Page Structure
```jsx
// src/app/services/page.js (current)
export default function ServicesPage() {
  return (
    <>
      {/* Welcome section */}
      <ServicesHero />
      
      {/* Product cards */}
      <EquityPro />
      <IndexOptionsPro />
      <MITCContent />
      
      {/* Footer */}
    </>
  );
}
```

### Updated with Plans
```jsx
// src/app/services/page.js (with plans)
import PlansSection from "@/app/components/PlansSection";

export const metadata = {
  title: "Services - Trademilaan",
  description: "Choose from our premium trading plans",
};

export default function ServicesPage() {
  return (
    <>
      {/* Welcome section */}
      <ServicesHero />
      
      {/* Product information */}
      <EquityPro />
      <IndexOptionsPro />
      <MITCContent />
      
      {/* ⭐ NEW: Subscription Plans Section */}
      <div className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlansSection />
        </div>
      </div>
      
      {/* Footer */}
    </>
  );
}
```

---

## 2️⃣ Add Plans Link to Admin Dashboard

### Current Admin Dashboard
```jsx
// src/app/admin-dashboard/page.js (current - conceptual)
export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminCard title="Users" count={123} href="/admin-users" />
      <AdminCard title="Payments" count={456} href="/admin-payments" />
      <AdminCard title="Agreements" count={78} href="/admin-agreements" />
    </div>
  );
}
```

### Updated with Plans Admin Link
```jsx
// src/app/admin-dashboard/page.js (with plans)
export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminCard title="Users" count={123} href="/admin-users" />
      <AdminCard title="Payments" count={456} href="/admin-payments" />
      <AdminCard title="Agreements" count={78} href="/admin-agreements" />
      
      {/* ⭐ NEW: Plans Management */}
      <AdminCard 
        title="Subscription Plans" 
        count="Manage" 
        href="/admin-plans"
        icon="Package"
      />
    </div>
  );
}
```

### Alternative: Add to Admin Navbar
```jsx
// Assuming you have an admin navbar component
const AdminNavigation = () => {
  const menuItems = [
    { label: "Dashboard", href: "/admin-dashboard" },
    { label: "Users", href: "/admin-users" },
    { label: "Payments", href: "/admin-payments" },
    { label: "Agreements", href: "/admin-agreements" },
    { label: "Plans", href: "/admin-plans" }, // ⭐ NEW
  ];

  return (
    <nav>
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
```

---

## 3️⃣ Update Payment Page with Plan Data

### Before: Generic Payment Page
```jsx
// src/app/payment/page.js (current - conceptual)
export default function PaymentPage() {
  const [amount, setAmount] = useState(0);
  
  return (
    <>
      <h1>Make Payment</h1>
      <input 
        type="number" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </>
  );
}
```

### After: With Plan Auto-Fill
```jsx
// src/app/payment/page.js (with plan integration)
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(0);
  const [planName, setPlanName] = useState("");
  const [planId, setPlanId] = useState("");

  useEffect(() => {
    // Get plan details from URL params
    const plan = searchParams.get("planName");
    const price = searchParams.get("price");
    const id = searchParams.get("planId");
    
    if (plan) setPlanName(plan);
    if (price) setAmount(Number(price));
    if (id) setPlanId(id);
  }, [searchParams]);

  const handlePayment = async () => {
    const response = await fetch("/api/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        name: planName,
        planId, // Add plan ID for tracking
        // ... other fields
      }),
    });

    const result = await response.json();
    if (result.success) {
      // Open Razorpay
      // ...
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1>Purchase Plan</h1>
      
      <div className="bg-neutral-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-neutral-600">Plan</p>
        <p className="text-2xl font-bold text-neutral-900">{planName}</p>
      </div>

      <div className="bg-neutral-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-neutral-600">Amount</p>
        <p className="text-3xl font-bold text-lime-600">₹{amount}</p>
      </div>

      <button 
        onClick={handlePayment}
        className="w-full px-4 py-3 bg-lime-500 text-white font-semibold rounded-lg"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
```

---

## 4️⃣ Add Plans to Navigation

### Navbar Update
```jsx
// src/app/components/Navbar.jsx (existing - update navigation)

const navLinks = useMemo(
  () => [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/services#plans", label: "Plans" },  // ⭐ NEW: Direct to plans section
    { href: "/investor-charter", label: "Investor Charter" },
    { href: "/disclaimer-disclosure", label: "Disclaimer & Disclosure" },
    { href: "/mitc", label: "MITC" },
    { href: "/contact", label: "Contact Us" },
  ],
  [],
);
```

---

## 5️⃣ Create Separate Pricing Page (Optional)

### New Pricing Page
```jsx
// src/app/pricing/page.js (NEW - optional)
import PlansSection from "@/app/components/PlansSection";
import Link from "next/link";

export const metadata = {
  title: "Pricing & Plans | Trademilaan",
  description: "Choose the trading plan that fits your needs",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Transparent Pricing
          </h1>
          <p className="text-xl text-neutral-300">
            Choose the right plan for your trading journey
          </p>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PlansSection />
      </div>

      {/* FAQ */}
      <div className="bg-neutral-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg border border-neutral-200">
              <summary className="font-semibold cursor-pointer">
                Can I change my plan?
              </summary>
              <p className="mt-4 text-neutral-600">
                Yes, you can upgrade or downgrade your plan anytime.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-neutral-200">
              <summary className="font-semibold cursor-pointer">
                What if I'm not satisfied?
              </summary>
              <p className="mt-4 text-neutral-600">
                Check our refund policy for details.
                <Link href="/refund-policy" className="text-lime-600 hover:underline ml-1">
                  Learn more →
                </Link>
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-neutral-200">
              <summary className="font-semibold cursor-pointer">
                Do you offer discounts for yearly plans?
              </summary>
              <p className="mt-4 text-neutral-600">
                Yes! Yearly plans include significant discounts.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add link to navbar or footer
```

---

## 6️⃣ Email Notification When Plan Purchased

### After Payment Verification
```javascript
// src/app/api/payment/verify/route.js (existing - add plan logic)

export async function POST(req) {
  try {
    // ... existing verification code ...

    if (signatureValid) {
      // ⭐ NEW: Get plan details if planId in request
      if (body.planId) {
        const plan = await Plan.findById(body.planId);
        if (plan) {
          // Store plan purchase with user
          user.purchasedPlan = {
            planId: plan._id,
            planName: plan.name,
            purchasedAt: new Date(),
            expiresAt: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
          };
          await user.save();

          // Send email notification
          await sendPlanPurchaseEmail(user.email, plan);
        }
      }

      // ... rest of code ...
    }
  } catch (error) {
    // ...
  }
}
```

### Email Template
```javascript
// src/app/lib/mailer.js (add new function)

export const sendPlanPurchaseEmail = async (email, plan) => {
  const transporter = getEmailTransporter();

  const htmlContent = `
    <h2>Welcome to ${plan.name}!</h2>
    <p>You've successfully purchased the <strong>${plan.name}</strong> plan.</p>
    
    <h3>Plan Details:</h3>
    <ul>
      <li>Plan: ${plan.name}</li>
      <li>Price: ₹${plan.price.toLocaleString("en-IN")}</li>
      <li>Duration: ${plan.duration} days</li>
    </ul>

    <h3>Features Included:</h3>
    <ul>
      ${plan.features.map((f) => `<li>${f}</li>`).join("")}
    </ul>

    <p>You can now access all premium features on your dashboard.</p>
    <a href="${process.env.PUBLIC_BASE_URL}/dashboard">Go to Dashboard</a>
  `;

  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: `Welcome to ${plan.name} - Trademilaan`,
    html: htmlContent,
  });
};
```

---

## 7️⃣ Display User's Active Plan in Profile

### Profile Page Enhancement
```jsx
// src/app/profile/page.js (add plan display)
"use client";

import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>My Profile</h1>

      {/* Existing profile fields */}
      <div className="space-y-6">
        <div>
          <label>Name</label>
          <input type="text" value={user?.fullName || ""} disabled />
        </div>
        
        {/* ⭐ NEW: Show active plan */}
        {user?.purchasedPlan && (
          <div className="bg-lime-50 border border-lime-200 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-lime-900 mb-2">
              Current Plan
            </h2>
            <p className="text-lime-800">
              {user.purchasedPlan.planName}
            </p>
            <p className="text-sm text-lime-700 mt-2">
              Expires: {new Date(user.purchasedPlan.expiresAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {!user?.purchasedPlan && (
          <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-lg">
            <p className="text-neutral-600">
              No active plan. 
              <a href="/services" className="text-lime-600 hover:underline ml-1">
                Browse plans →
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 8️⃣ Add Plan Filtering to Admin Dashboard

### Admin Statistics
```jsx
// src/app/admin-dashboard/page.js (add stats)
"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const plansRes = await fetch("/api/plans");
        const plans = await plansRes.json();

        if (plans.success) {
          const allPlans = plans.data;
          const activePlans = allPlans.filter((p) => p.isActive);
          const totalRevenue = allPlans.reduce(
            (sum, p) => sum + p.price,
            0
          );

          setStats({
            totalPlans: allPlans.length,
            activePlans: activePlans.length,
            totalRevenue,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Plans" value={stats.totalPlans} />
      <StatCard title="Active Plans" value={stats.activePlans} />
      <StatCard 
        title="Plan Revenue" 
        value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} 
      />
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
    <p className="text-sm text-neutral-600">{title}</p>
    <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
  </div>
);
```

---

## 9️⃣ Connect to Footer

### Add Plans Link to Footer
```jsx
// src/app/components/Footer.jsx (add link)

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
          <h3 className="font-bold mb-4">Products</h3>
          <ul className="space-y-2 text-neutral-400">
            <li><a href="/services">Services</a></li>
            <li><a href="/services#plans">Plans</a></li>  {/* ⭐ NEW */}
            <li><a href="/pricing">Pricing</a></li>      {/* ⭐ NEW (if created) */}
          </ul>
        </div>

        {/* ... other footer sections ... */}
      </div>
    </footer>
  );
}
```

---

## 🔟 Summary of Integration Points

| Location | Change | Impact |
|----------|--------|--------|
| `/services` | Add `<PlansSection />` | Users see plans to buy |
| Admin Navbar | Add `/admin-plans` link | Admins can manage plans |
| Payment Page | Accept `planId` via params | Track which plan purchased |
| Profile Page | Show active plan | Users see their subscription |
| Navbar | Add "Plans" link | Easier navigation |
| Footer | Add "Plans" link | Better SEO |
| Email | Send plan purchase email | User confirmation |
| Admin Dashboard | Show plan stats | Oversight dashboard |

---

## ✅ Integration Checklist

- [ ] Add `<PlansSection />` to `/services`
- [ ] Add `/admin-plans` link to admin navbar
- [ ] Update payment page with plan params
- [ ] Display plan in user profile
- [ ] Add plans link to navbar
- [ ] Add plans link to footer
- [ ] (Optional) Create `/pricing` page
- [ ] (Optional) Send purchase email
- [ ] Test full purchase flow
- [ ] Deploy to production

---

**All integration patterns are ready to copy/paste!**
