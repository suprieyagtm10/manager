export const dynamic = "force-dynamic"

import { AppHeader } from "@/components/app-header"
import { StaffClient } from "@/components/staff/staff-client"
import { getStaffMembersWithCertifications } from "@/lib/db"

export default async function StaffPage() {
  const staff = await getStaffMembersWithCertifications()

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        title="Staff Management"
        subtitle="Manage staff members, roles, and availability"
      />
      <div className="flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
        <StaffClient initialStaff={staff} />
      </div>
    </div>
  )
}
