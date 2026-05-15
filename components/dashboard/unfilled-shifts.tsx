"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, UserPlus } from "lucide-react"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import { ShiftWithAssignment, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types"

interface UnfilledShiftsProps {
  shifts: ShiftWithAssignment[]
}

export function UnfilledShifts({ shifts }: UnfilledShiftsProps) {
  const sortedShifts = [...shifts].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.start_time.localeCompare(b.start_time)
  }).slice(0, 5)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Unfilled Shifts
          {shifts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {shifts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedShifts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm">All shifts are covered!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedShifts.map((shift) => {
              const roleConfig = ROLE_CONFIG[shift.required_role as keyof typeof ROLE_CONFIG]
              const shiftConfig = SHIFT_CONFIG[shift.shift_type]
              const isToday = shift.date === format(new Date(), "yyyy-MM-dd")
              const isTomorrow = shift.date === format(new Date(Date.now() + 86400000), "yyyy-MM-dd")

              let dateLabel = format(parseISO(shift.date), "EEE, MMM d")
              if (isToday) dateLabel = "Today"
              if (isTomorrow) dateLabel = "Tomorrow"

              return (
                <div
                  key={shift.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isToday ? "border-red-200 bg-red-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{dateLabel}</p>
                        {isToday && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {shiftConfig?.label} ({shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${roleConfig?.bgColor} ${roleConfig?.textColor}`}>
                      {roleConfig?.label || shift.required_role}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/roster?date=${shift.date}&shift=${shift.id}`}>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
            {shifts.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" asChild>
                  <Link href="/roster?status=unfilled">
                    View all {shifts.length} unfilled shifts
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
