"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarOff } from "lucide-react"
import { format, parseISO, differenceInDays } from "date-fns"
import { LeaveRequestWithStaff, LEAVE_STATUS_CONFIG, ROLE_CONFIG } from "@/lib/types"

interface UpcomingLeaveProps {
  leaves: LeaveRequestWithStaff[]
}

export function UpcomingLeave({ leaves }: UpcomingLeaveProps) {
  const upcomingLeaves = leaves
    .filter((l) => parseISO(l.end_date) >= new Date())
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarOff className="h-5 w-5" />
          Upcoming Leave
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingLeaves.length === 0 ? (
          <p className="text-muted-foreground text-sm">No upcoming leave requests.</p>
        ) : (
          <div className="space-y-3">
            {upcomingLeaves.map((leave) => {
              const staff = leave.staff_members
              const roleConfig = ROLE_CONFIG[staff.role]
              const statusConfig = LEAVE_STATUS_CONFIG[leave.status]
              const startDate = parseISO(leave.start_date)
              const endDate = parseISO(leave.end_date)
              const daysUntil = differenceInDays(startDate, new Date())
              const duration = differenceInDays(endDate, startDate) + 1

              return (
                <div key={leave.id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">
                      {staff.first_name} {staff.last_name}
                    </p>
                    <Badge variant="outline" className={`text-xs ${roleConfig?.bgColor} ${roleConfig?.textColor}`}>
                      {staff.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {format(startDate, "MMM d")} - {format(endDate, "MMM d")} ({duration} day{duration > 1 ? "s" : ""})
                    </span>
                    <Badge variant="outline" className={`${statusConfig.bgColor} ${statusConfig.textColor}`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  {daysUntil <= 3 && daysUntil >= 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      {daysUntil === 0 ? "Starts today" : `Starts in ${daysUntil} day${daysUntil > 1 ? "s" : ""}`}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
