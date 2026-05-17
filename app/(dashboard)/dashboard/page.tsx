export const dynamic = "force-dynamic"

import { AppHeader } from "@/components/app-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { TodayRoster } from "@/components/dashboard/today-roster"
import { UnfilledShifts } from "@/components/dashboard/unfilled-shifts"
import { UpcomingLeave } from "@/components/dashboard/upcoming-leave"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentWarnings } from "@/components/dashboard/recent-warnings"
import { getDashboardStats, getShiftsWithAssignments, getLeaveRequests, getWarnings } from "@/lib/db"
import { format, addDays } from "date-fns"

export default async function DashboardPage() {
  const today = new Date()
  const todayStr = format(today, "yyyy-MM-dd")
  const nextWeekStr = format(addDays(today, 7), "yyyy-MM-dd")

  const [stats, shiftsData, leaveData, warningsData] = await Promise.all([
    getDashboardStats(),
    getShiftsWithAssignments(todayStr, nextWeekStr),
    getLeaveRequests(),
    getWarnings(false),
  ])

  const todayShifts = shiftsData.filter((s) => s.date === todayStr)
  const unfilledShifts = shiftsData.filter((s) => s.status === "unfilled")
  const pendingLeave = leaveData.filter((l) => l.status === "pending" || l.status === "approved")
  const activeWarnings = warningsData.slice(0, 5)

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Dashboard"
        subtitle="Overview of today's roster and key actions"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <DashboardStats stats={stats} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <TodayRoster shifts={todayShifts} />
              <UnfilledShifts shifts={unfilledShifts} />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <UpcomingLeave leaves={pendingLeave} />
              <RecentWarnings warnings={activeWarnings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
