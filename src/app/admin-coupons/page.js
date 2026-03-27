import CouponList from "@/app/components/admin/CouponList";

/**
 * Admin Coupons Page
 * Full coupon management interface for admins
 * Route: /admin-coupons
 */
export default function AdminCouponsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <CouponList />
      </div>
    </div>
  );
}
