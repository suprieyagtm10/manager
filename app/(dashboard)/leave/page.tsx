export const dynamic = "force-dynamic"

import { AppHeader } from "@/components/app-header"
import { LeaveClient } from "@/components/leave/leave-client"
import { getLeaveRequests, getActiveStaffMembers } from "@/lib/db"

export default async function LeavePage() {
  const [leaves, staff] = await Promise.all([
    getLeaveRequests(),
    getActiveStaffMembers(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        title="Leave Management"
        subtitle="Manage staff leave requests and emergency absences"
      />
      <div className="flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
        <LeaveClient initialLeaves={leaves} staff={staff} />
      </div>
    </div>
  )
}