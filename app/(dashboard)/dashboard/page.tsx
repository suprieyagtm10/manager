import { AppHeader } from "@/components/app-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { TodayRoster } from "@/components/dashboard/today-roster";
import { UnfilledShifts } from "@/components/dashboard/unfilled-shifts";
import { UpcomingLeave } from "@/components/dashboard/upcoming-leave";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentWarnings } from "@/components/dashboard/recent-warnings";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Dashboard"
        subtitle="Overview of today's roster and key actions"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <DashboardStats />
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <TodayRoster />
              <UnfilledShifts />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <UpcomingLeave />
              <RecentWarnings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
