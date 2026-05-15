import { AppHeader } from "@/components/app-header"
import { RosterClient } from "@/components/roster/roster-client"
import { getShiftsWithAssignments, getActiveStaffMembers } from "@/lib/db"

export default async function RosterPage() {
  const [shifts, staff] = await Promise.all([
    getShiftsWithAssignments(),
    getActiveStaffMembers(),
  ])

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Roster Calendar"
        subtitle="View and manage staff schedules"
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <RosterClient initialShifts={shifts} staff={staff} />
      </div>
    </div>
  )
}
