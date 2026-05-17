"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import { format } from "date-fns"
import { ShiftWithAssignment, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types"

interface TodayRosterProps {
  shifts: ShiftWithAssignment[]
}

export function TodayRoster({ shifts }: TodayRosterProps) {
  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case "morning":
        return "bg-amber-100 text-amber-700"
      case "kitchen_afternoon":
        return "bg-orange-100 text-orange-700"
      case "care_afternoon":
        return "bg-blue-100 text-blue-700"
      case "night":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today&apos;s Roster
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, d MMMM")}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {shifts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No shifts scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {shifts.map((shift) => {
              const assignment = shift.shift_assignments?.[0]
              const staff = assignment?.staff_members
              const roleConfig = ROLE_CONFIG[shift.required_role as keyof typeof ROLE_CONFIG]
              const shiftConfig = SHIFT_CONFIG[shift.shift_type]

              return (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getShiftTypeColor(shift.shift_type)}>
                      {shiftConfig?.label || shift.shift_type}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">
                        {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {roleConfig?.label || shift.required_role} required
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {staff ? (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {staff.first_name[0]}
                            {staff.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {staff.first_name} {staff.last_name}
                          </p>
                          <Badge variant="outline" className={`text-xs ${roleConfig?.bgColor} ${roleConfig?.textColor}`}>
                            {staff.role}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <Badge variant="destructive">Unfilled</Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
