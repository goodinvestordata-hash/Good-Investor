import PlanList from "@/app/components/admin/PlanList";

/**
 * Admin Plans Page
 * Full plan management interface for admins
 * Route: /admin/plans
 */
export default function AdminPlansPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <PlanList />
      </div>
    </div>
  );
}
