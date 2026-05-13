"use client";

import { Users, Calendar, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockStaff, mockShifts, mockLeave, getShiftsByDate, getUnfilledShifts, getUpcomingLeave } from "@/lib/mock-data";

export function DashboardStats() {
  const today = new Date();
  const todayShifts = getShiftsByDate(today);
  const unfilledShifts = getUnfilledShifts();
  const upcomingLeave = getUpcomingLeave();
  const activeStaff = mockStaff.filter((s) => s.isActive);
  const staffOnDuty = todayShifts.filter((s) => s.assignedStaffId).length;

  const stats = [
    {
      label: "Staff on Duty",
      value: staffOnDuty,
      subtext: `of ${todayShifts.length} shifts today`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Active Staff",
      value: activeStaff.length,
      subtext: `${mockStaff.length} total registered`,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Unfilled Shifts",
      value: unfilledShifts.length,
      subtext: "Need attention",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Staff on Leave",
      value: upcomingLeave.length,
      subtext: "Current & upcoming",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.subtext}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
