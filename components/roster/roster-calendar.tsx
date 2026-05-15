"use client"

import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns"
import { Plus, User, MoreHorizontal, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShiftWithAssignment, StaffRole, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types"
import { ViewMode } from "@/components/roster/roster-client"
import { cn } from "@/lib/utils"

interface RosterCalendarProps {
  shifts: ShiftWithAssignment[]
  selectedDate: Date
  viewMode: ViewMode
  roleFilter: StaffRole | "all"
  showOnlyIssues: boolean
  onAddShift: (date: Date) => void
  onEditShift: (shift: ShiftWithAssignment) => void
  onAssignStaff: (shift: ShiftWithAssignment) => void
  onRemoveStaff: (shiftId: string) => void
}

export function RosterCalendar({
  shifts,
  selectedDate,
  viewMode,
  roleFilter,
  showOnlyIssues,
  onAddShift,
  onEditShift,
  onAssignStaff,
  onRemoveStaff,
}: RosterCalendarProps) {
  const getDaysToShow = () => {
    switch (viewMode) {
      case "day":
        return [selectedDate]
      case "week":
        return eachDayOfInterval({
          start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
        })
      case "month":
        return eachDayOfInterval({
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
        })
    }
  }

  const days = getDaysToShow()

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    let dayShifts = shifts.filter((s) => s.date === dateStr)

    if (roleFilter !== "all") {
      dayShifts = dayShifts.filter((s) => s.required_role === roleFilter)
    }

    if (showOnlyIssues) {
      dayShifts = dayShifts.filter((s) => s.status === "unfilled" || s.status === "urgent")
    }

    return dayShifts
  }

  if (viewMode === "day") {
    return (
      <DayView
        day={days[0]}
        shifts={getShiftsForDay(days[0])}
        onAddShift={onAddShift}
        onEditShift={onEditShift}
        onAssignStaff={onAssignStaff}
        onRemoveStaff={onRemoveStaff}
      />
    )
  }

  if (viewMode === "week") {
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            shifts={getShiftsForDay(day)}
            onAddShift={onAddShift}
            onEditShift={onEditShift}
            onAssignStaff={onAssignStaff}
            onRemoveStaff={onRemoveStaff}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
          {day}
        </div>
      ))}
      {days.map((day) => (
        <MonthDayCell
          key={day.toISOString()}
          day={day}
          shifts={getShiftsForDay(day)}
          selectedDate={selectedDate}
          onAddShift={onAddShift}
          onEditShift={onEditShift}
        />
      ))}
    </div>
  )
}

function DayView({
  day,
  shifts,
  onAddShift,
  onEditShift,
  onAssignStaff,
  onRemoveStaff,
}: {
  day: Date
  shifts: ShiftWithAssignment[]
  onAddShift: (date: Date) => void
  onEditShift: (shift: ShiftWithAssignment) => void
  onAssignStaff: (shift: ShiftWithAssignment) => void
  onRemoveStaff: (shiftId: string) => void
}) {
  const shiftsByType = {
    morning: shifts.filter((s) => s.shift_type === "morning"),
    afternoon: shifts.filter((s) => s.shift_type === "afternoon"),
    night: shifts.filter((s) => s.shift_type === "night"),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(day, "EEEE, d MMMM yyyy")}</h2>
        <Button onClick={() => onAddShift(day)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Shift
        </Button>
      </div>

      {Object.entries(shiftsByType).map(([type, typeShifts]) => {
        const config = SHIFT_CONFIG[type as keyof typeof SHIFT_CONFIG]
        return (
          <div key={type} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>{config?.label || type}</span>
              <span className="text-muted-foreground">
                ({config?.startTime} - {config?.endTime})
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {typeShifts.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No shifts scheduled
                </div>
              ) : (
                typeShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    onEdit={onEditShift}
                    onAssign={onAssignStaff}
                    onRemove={onRemoveStaff}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayColumn({
  day,
  shifts,
  onAddShift,
  onEditShift,
  onAssignStaff,
  onRemoveStaff,
}: {
  day: Date
  shifts: ShiftWithAssignment[]
  onAddShift: (date: Date) => void
  onEditShift: (shift: ShiftWithAssignment) => void
  onAssignStaff: (shift: ShiftWithAssignment) => void
  onRemoveStaff: (shiftId: string) => void
}) {
  const today = isToday(day)

  return (
    <div
      className={cn(
        "min-h-[400px] rounded-lg border bg-card p-2",
        today && "border-blue-300 bg-blue-50/50"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
          <p className={cn("text-lg font-semibold", today && "text-blue-600")}>
            {format(day, "d")}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onAddShift(day)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1.5">
        {shifts.map((shift) => (
          <MiniShiftCard
            key={shift.id}
            shift={shift}
            onEdit={onEditShift}
            onAssign={onAssignStaff}
            onRemove={onRemoveStaff}
          />
        ))}
      </div>
    </div>
  )
}

function MonthDayCell({
  day,
  shifts,
  selectedDate,
  onAddShift,
  onEditShift,
}: {
  day: Date
  shifts: ShiftWithAssignment[]
  selectedDate: Date
  onAddShift: (date: Date) => void
  onEditShift: (shift: ShiftWithAssignment) => void
}) {
  const today = isToday(day)
  const sameMonth = isSameMonth(day, selectedDate)
  const unfilledCount = shifts.filter((s) => s.status === "unfilled" || s.status === "urgent").length

  return (
    <div
      className={cn(
        "min-h-[80px] rounded border p-1 cursor-pointer hover:bg-accent/50 transition-colors",
        !sameMonth && "opacity-50",
        today && "border-blue-300 bg-blue-50"
      )}
      onClick={() => (shifts.length === 0 ? onAddShift(day) : undefined)}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-sm", today && "font-semibold text-blue-600")}>
          {format(day, "d")}
        </span>
        {unfilledCount > 0 && (
          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs justify-center">
            {unfilledCount}
          </Badge>
        )}
      </div>
      <div className="mt-1 space-y-0.5">
        {shifts.slice(0, 3).map((shift) => {
          const roleConfig = ROLE_CONFIG[shift.required_role as keyof typeof ROLE_CONFIG]
          const shiftConfig = SHIFT_CONFIG[shift.shift_type]
          return (
            <div
              key={shift.id}
              className={cn(
                "text-xs rounded px-1 py-0.5 truncate cursor-pointer",
                shift.status === "filled"
                  ? `${roleConfig?.bgColor} ${roleConfig?.textColor}`
                  : "bg-gray-100 text-gray-500"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onEditShift(shift)
              }}
            >
              {shiftConfig?.label?.slice(0, 3) || shift.shift_type}
            </div>
          )
        })}
        {shifts.length > 3 && (
          <div className="text-xs text-muted-foreground">+{shifts.length - 3} more</div>
        )}
      </div>
    </div>
  )
}

function ShiftCard({
  shift,
  onEdit,
  onAssign,
  onRemove,
}: {
  shift: ShiftWithAssignment
  onEdit: (shift: ShiftWithAssignment) => void
  onAssign: (shift: ShiftWithAssignment) => void
  onRemove: (shiftId: string) => void
}) {
  const roleConfig = ROLE_CONFIG[shift.required_role as keyof typeof ROLE_CONFIG]
  const assignment = shift.shift_assignments?.[0]
  const staff = assignment?.staff_members
  const isFilled = shift.status === "filled" && staff

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        !isFilled && shift.status === "urgent" && "border-red-200 bg-red-50",
        !isFilled && shift.status === "unfilled" && "border-orange-200 bg-orange-50"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isFilled ? roleConfig?.bgColor : "bg-gray-100"
            )}
          >
            {isFilled ? (
              <User className={cn("h-5 w-5", roleConfig?.textColor)} />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {isFilled ? `${staff.first_name} ${staff.last_name}` : "Unfilled"}
            </p>
            <Badge
              variant="secondary"
              className={`${roleConfig?.bgColor} ${roleConfig?.textColor} text-xs`}
            >
              {roleConfig?.label || shift.required_role}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(shift)}>Edit Shift</DropdownMenuItem>
            {!isFilled && (
              <DropdownMenuItem onClick={() => onAssign(shift)}>Assign Staff</DropdownMenuItem>
            )}
            {isFilled && (
              <DropdownMenuItem onClick={() => onRemove(shift.id)}>Remove Staff</DropdownMenuItem>
            )}
            {isFilled && (
              <DropdownMenuItem onClick={() => onAssign(shift)}>Replace Staff</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {shift.notes && <p className="mt-2 text-sm text-muted-foreground">{shift.notes}</p>}
    </div>
  )
}

function MiniShiftCard({
  shift,
  onEdit,
  onAssign,
  onRemove,
}: {
  shift: ShiftWithAssignment
  onEdit: (shift: ShiftWithAssignment) => void
  onAssign: (shift: ShiftWithAssignment) => void
  onRemove: (shiftId: string) => void
}) {
  const roleConfig = ROLE_CONFIG[shift.required_role as keyof typeof ROLE_CONFIG]
  const shiftConfig = SHIFT_CONFIG[shift.shift_type]
  const assignment = shift.shift_assignments?.[0]
  const staff = assignment?.staff_members
  const isFilled = shift.status === "filled" && staff

  return (
    <div
      className={cn(
        "rounded p-2 text-xs cursor-pointer",
        isFilled
          ? `${roleConfig?.bgColor} ${roleConfig?.textColor}`
          : shift.status === "urgent"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-600"
      )}
      onClick={() => (isFilled ? onEdit(shift) : onAssign(shift))}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{shiftConfig?.label || shift.shift_type}</span>
        {!isFilled && <AlertCircle className="h-3 w-3" />}
      </div>
      <div className="truncate">
        {isFilled ? `${staff.first_name} ${staff.last_name}` : "Unfilled"}
      </div>
    </div>
  )
}
