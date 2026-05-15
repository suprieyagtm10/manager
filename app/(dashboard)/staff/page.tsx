import { AppHeader } from "@/components/app-header"
import { StaffClient } from "@/components/staff/staff-client"
import { getStaffMembersWithCertifications } from "@/lib/db"

export default async function StaffPage() {
  const staff = await getStaffMembersWithCertifications()

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Staff Management"
        subtitle="Manage staff members, roles, and availability"
      />
      <div className="flex-1 overflow-auto p-6">
        <StaffClient initialStaff={staff} />
      </div>
    </div>
  )
}
