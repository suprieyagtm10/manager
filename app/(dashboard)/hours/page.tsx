export const dynamic = "force-dynamic"

import { AppHeader } from "@/components/app-header"
import { WorkingHoursClient } from "@/components/working-hours-client"
import { getStaffMembers, getWorkingHours } from "@/lib/db"

export default async function HoursPage() {
  const [staff, entries] = await Promise.all([getStaffMembers(), getWorkingHours()])

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        title="Working Hours"
        subtitle="Record individual hours, breaks and payable time for nurses, PCAs, FSAs and chefs"
      />
      <div className="flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
        <WorkingHoursClient staff={staff} initialEntries={entries} />
      </div>
    </div>
  )
}
