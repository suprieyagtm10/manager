import {
  StaffMember,
  Shift,
  LeaveRequest,
  StaffSuggestion,
  SuggestionRank,
  SHIFT_CONFIG,
} from "@/lib/types"

import { startOfWeek, endOfWeek, isWithinInterval, parseISO, subDays } from "date-fns"

// Calculate hours for a shift
function getShiftHours(shiftType: string): number {
  const config = SHIFT_CONFIG[shiftType as keyof typeof SHIFT_CONFIG]

  if (!config) return 8

  const startHour = Number(config.startTime.split(":")[0])
  const endHour = Number(config.endTime.split(":")[0])

  return endHour > startHour
    ? endHour - startHour
    : 24 - startHour + endHour
}

// Weekly hours
export function getWeeklyHours(
  staffId: string,
  weekStartDate: Date,
  shifts: Shift[]
): number {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 })

  const assignedShifts = shifts.filter((shift) => {
    const shiftDate = parseISO(shift.date)

    return (
      shift.required_role &&
      isWithinInterval(shiftDate, {
        start: weekStart,
        end: weekEnd,
      })
    )
  })

  return assignedShifts.reduce(
    (total, shift) => total + getShiftHours(shift.shift_type),
    0
  )
}

// Check leave
export function isStaffOnLeave(
  staffId: string,
  date: Date,
  leaves: LeaveRequest[]
): boolean {
  return leaves.some((leave) => {
    const start = parseISO(leave.start_date)
    const end = parseISO(leave.end_date)

    return (
      leave.staff_id === staffId &&
      leave.status === "approved" &&
      isWithinInterval(date, { start, end })
    )
  })
}

// Unsafe night → morning
export function hasUnsafeNightMorningSchedule(
  shift: Shift,
  previousShifts: Shift[]
): boolean {
  if (shift.shift_type !== "morning") return false

  const previousDay = subDays(parseISO(shift.date), 1)

  return previousShifts.some(
    (s) =>
      s.shift_type === "night" &&
      parseISO(s.date).toDateString() === previousDay.toDateString()
  )
}

// Staff suggestions
export function getStaffSuggestions(
  availableStaff: StaffMember[],
  shift: Shift,
  shifts: Shift[],
  leaves: LeaveRequest[]
): StaffSuggestion[] {
  const suggestions: StaffSuggestion[] = []

  for (const staff of availableStaff) {
    const warnings: string[] = []
    let rank: SuggestionRank = "best-match"

    // Role mismatch
    if (
      shift.required_role !== "ANY" &&
      staff.role !== shift.required_role
    ) {
      continue
    }

    // Leave check
    if (isStaffOnLeave(staff.id, parseISO(shift.date), leaves)) {
      warnings.push("Staff member is on leave")
      rank = "not-suitable"
    }

    // Weekly hours
    const weeklyHours = getWeeklyHours(
      staff.id,
      parseISO(shift.date),
      shifts
    )

    const contracted = staff.contracted_hours || 38

    if (weeklyHours > contracted) {
      warnings.push("Exceeds contracted weekly hours")
      rank = "warning"
    }

    suggestions.push({
      staff,
      rank,
      warnings,
      weeklyHoursAssigned: weeklyHours,
      matchScore: rank === "best-match" ? 100 : rank === "warning" ? 50 : 0,
    })
  }

  const rankOrder: Record<SuggestionRank, number> = {
    "best-match": 0,
    available: 1,
    warning: 2,
    "not-suitable": 3,
  }

  return suggestions.sort((a, b) => {
    const diff = rankOrder[a.rank] - rankOrder[b.rank]

    if (diff !== 0) return diff

    return a.weeklyHoursAssigned - b.weeklyHoursAssigned
  })
}