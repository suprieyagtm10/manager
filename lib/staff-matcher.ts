import {
  StaffMember,
  Shift,
  LeaveRequest,
  Availability,
  StaffSuggestion,
  SuggestionRank,
  SHIFT_CONFIG,
} from "./types"
import { mockShifts, mockLeave, mockAvailability } from "./mock-data"
import { isSameDay, isWithinInterval, startOfWeek, endOfWeek, parseISO, subDays } from "date-fns"

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : parseISO(value)
}

function getStaffName(staff: StaffMember): string {
  return `${staff.first_name} ${staff.last_name}`.trim()
}

function getAssignedStaffId(shift: Shift): string | null {
  return shift.assignedStaffId ?? null
}

function getShiftType(shift: Shift) {
  return shift.shiftType ?? shift.shift_type
}

function getRequiredRole(shift: Shift) {
  return shift.roleRequired ?? shift.required_role
}

function getShiftHours(shiftType: string): number {
  const config = SHIFT_CONFIG[shiftType as keyof typeof SHIFT_CONFIG]
  if (!config) return 8

  const startHour = Number(config.startTime.split(":")[0])
  const endHour = Number(config.endTime.split(":")[0])

  return endHour > startHour ? endHour - startHour : 24 - startHour + endHour
}

export function getWeeklyHours(staffId: string, weekStartDate: Date): number {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 })

  const assignedShifts = mockShifts.filter((shift) => {
    const shiftDate = toDate(shift.date)
    return (
      getAssignedStaffId(shift) === staffId &&
      isWithinInterval(shiftDate, { start: weekStart, end: weekEnd })
    )
  })

  return assignedShifts.reduce((total, shift) => total + getShiftHours(getShiftType(shift)), 0)
}

export function isStaffOnLeave(staffId: string, date: Date): boolean {
  return mockLeave.some((leave: LeaveRequest) => {
    const start = leave.startDate ?? toDate(leave.start_date)
    const end = leave.endDate ?? toDate(leave.end_date)

    return (
      (leave.staffId ?? leave.staff_id) === staffId &&
      leave.status === "approved" &&
      isWithinInterval(date, { start, end })
    )
  })
}

export function getStaffAvailability(
  staffName: string,
  date: Date
): { isAvailable: boolean; isPreferred: boolean } | null {
  const availability = mockAvailability.find((record: Availability) => {
    if (record.staffName && record.staffName !== staffName) return false

    const start = record.startDate ?? toDate(record.effective_from)
    const end = record.endDate ?? (record.effective_until ? toDate(record.effective_until) : start)
    return isWithinInterval(date, { start, end })
  })

  if (!availability) return null

  const unavailableDates = availability.unavailableDates ?? []
  const availableDates = availability.availableDates ?? []
  const isUnavailable = unavailableDates.some((day) => isSameDay(day, date))
  const isAvailable =
    availability.is_available || availableDates.some((day) => isSameDay(day, date))

  return {
    isAvailable: isAvailable && !isUnavailable,
    isPreferred: isAvailable && !isUnavailable,
  }
}

export function hasUnsafeNightMorningSchedule(
  staffId: string,
  date: Date,
  shiftType: string
): boolean {
  if (shiftType !== "morning") return false

  const previousDay = subDays(date, 1)
  return mockShifts.some(
    (shift) =>
      getAssignedStaffId(shift) === staffId &&
      isSameDay(toDate(shift.date), previousDay) &&
      getShiftType(shift) === "night"
  )
}

export function isDoubleBooked(staffId: string, date: Date, excludeShiftId?: string): boolean {
  return mockShifts.some(
    (shift) =>
      getAssignedStaffId(shift) === staffId &&
      isSameDay(toDate(shift.date), date) &&
      shift.id !== excludeShiftId
  )
}

export function getStaffSuggestions(
  availableStaff: StaffMember[],
  shift: Shift
): StaffSuggestion[] {
  const suggestions: StaffSuggestion[] = []
  const shiftType = getShiftType(shift)
  const requiredRole = getRequiredRole(shift)
  const shiftConfig = SHIFT_CONFIG[shiftType]
  const shiftDate = toDate(shift.date)

  for (const staff of availableStaff) {
    const warnings: string[] = []
    let rank: SuggestionRank = "best-match"
    let matchScore = 100

    if (requiredRole !== "ANY" && staff.role !== requiredRole) {
      warnings.push("Role does not match shift requirement")
      rank = "not-suitable"
      matchScore -= 60
    }

    if (!shiftConfig.roles.includes(staff.role)) {
      warnings.push("Shift type is not suitable for this role")
      rank = "not-suitable"
      matchScore -= 40
    }

    if (isStaffOnLeave(staff.id, shiftDate)) {
      warnings.push("Staff is on approved leave")
      rank = "not-suitable"
      matchScore -= 80
    }

    if (isDoubleBooked(staff.id, shiftDate, shift.id)) {
      warnings.push("Already assigned to another shift")
      rank = "not-suitable"
      matchScore -= 80
    }

    const weeklyHours = getWeeklyHours(staff.id, shiftDate)
    const shiftHours = getShiftHours(shiftType)
    const maxHours = staff.contracted_hours ?? 38

    if (weeklyHours + shiftHours > maxHours) {
      warnings.push(`Would exceed weekly hours (${weeklyHours + shiftHours}/${maxHours})`)
      if (rank === "best-match") rank = "warning"
      matchScore -= 20
    }

    if (hasUnsafeNightMorningSchedule(staff.id, shiftDate, shiftType)) {
      warnings.push("Night shift followed by morning shift")
      if (rank === "best-match") rank = "warning"
      matchScore -= 20
    }

    const availability = getStaffAvailability(getStaffName(staff), shiftDate)
    if (availability && !availability.isAvailable) {
      warnings.push("Marked as unavailable")
      if (rank === "best-match") rank = "warning"
      matchScore -= 20
    }

    if (rank === "best-match" && warnings.length > 0) rank = "available"

    suggestions.push({
      staff,
      rank,
      warnings,
      weeklyHoursAssigned: weeklyHours,
      matchScore: Math.max(0, matchScore),
    })
  }

  const rankOrder: Record<SuggestionRank, number> = {
    "best-match": 0,
    available: 1,
    warning: 2,
    "not-suitable": 3,
  }

  return suggestions.sort((a, b) => {
    const rankDiff = rankOrder[a.rank] - rankOrder[b.rank]
    if (rankDiff !== 0) return rankDiff
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
    return a.weeklyHoursAssigned - b.weeklyHoursAssigned
  })
}

export interface RosterWarning {
  shiftId: string
  staffId?: string
  type: string
  message: string
  severity: "error" | "warning"
}

export function validateRoster(shifts: Shift[], staff: StaffMember[]): RosterWarning[] {
  const warnings: RosterWarning[] = []

  for (const shift of shifts) {
    const shiftType = getShiftType(shift)
    const requiredRole = getRequiredRole(shift)
    const assignedStaffId = getAssignedStaffId(shift)
    const shiftDate = toDate(shift.date)

    if (!assignedStaffId) {
      warnings.push({
        shiftId: shift.id,
        type: "unfilled",
        message: `Unfilled ${SHIFT_CONFIG[shiftType].label} shift`,
        severity: shift.status === "urgent" ? "error" : "warning",
      })
      continue
    }

    const assignedStaff = staff.find((member) => member.id === assignedStaffId)
    if (!assignedStaff) continue

    const staffName = getStaffName(assignedStaff)

    if (requiredRole !== "ANY" && assignedStaff.role !== requiredRole) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "role-mismatch",
        message: `${staffName} (${assignedStaff.role}) assigned to ${requiredRole} shift`,
        severity: "error",
      })
    }

    if (isStaffOnLeave(assignedStaff.id, shiftDate)) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "leave-conflict",
        message: `${staffName} is on leave`,
        severity: "error",
      })
    }

    const otherShiftsSameDay = shifts.filter(
      (candidate) =>
        candidate.id !== shift.id &&
        getAssignedStaffId(candidate) === assignedStaff.id &&
        isSameDay(toDate(candidate.date), shiftDate)
    )

    if (otherShiftsSameDay.length > 0) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "double-booked",
        message: `${staffName} has multiple shifts on this day`,
        severity: "error",
      })
    }

    if (hasUnsafeNightMorningSchedule(assignedStaff.id, shiftDate, shiftType)) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "unsafe-schedule",
        message: `${staffName} has night shift followed by morning shift`,
        severity: "warning",
      })
    }

    const weeklyHours = getWeeklyHours(assignedStaff.id, shiftDate)
    const maxHours = assignedStaff.contracted_hours ?? 38

    if (weeklyHours > maxHours) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "hours-exceeded",
        message: `${staffName} exceeds weekly hours (${weeklyHours}/${maxHours})`,
        severity: "warning",
      })
    }
  }

  return warnings
}
