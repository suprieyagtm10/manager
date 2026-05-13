import { Staff, Shift, Leave, Availability, StaffSuggestion, SuggestionRank, SHIFT_CONFIG } from "./types";
import { mockShifts, mockLeave, mockAvailability } from "./mock-data";
import { isSameDay, isWithinInterval, startOfWeek, endOfWeek, addHours, subHours, parseISO } from "date-fns";

// Calculate hours for a shift type
function getShiftHours(shiftType: string): number {
  switch (shiftType) {
    case "morning":
      return 8;
    case "kitchen-afternoon":
      return 4;
    case "evening":
      return 8;
    case "night":
      return 8;
    default:
      return 8;
  }
}

// Get weekly hours for a staff member
export function getWeeklyHours(staffId: string, weekStartDate: Date): number {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 });

  const assignedShifts = mockShifts.filter(
    (shift) =>
      shift.assignedStaffId === staffId &&
      isWithinInterval(shift.date, { start: weekStart, end: weekEnd })
  );

  return assignedShifts.reduce((total, shift) => total + getShiftHours(shift.shiftType), 0);
}

// Check if staff is on leave
export function isStaffOnLeave(staffId: string, date: Date): boolean {
  return mockLeave.some(
    (leave) =>
      leave.staffId === staffId &&
      (leave.status === "approved" || leave.status === "emergency") &&
      isWithinInterval(date, { start: leave.startDate, end: leave.endDate })
  );
}

// Check if staff has submitted availability for a date
export function getStaffAvailability(staffName: string, date: Date): { isAvailable: boolean; isPreferred: boolean } | null {
  const availability = mockAvailability.find(
    (a) =>
      a.staffName === staffName &&
      isWithinInterval(date, { start: a.startDate, end: a.endDate })
  );

  if (!availability) return null;

  const isUnavailable = availability.unavailableDates.some((d) => isSameDay(d, date));
  const isAvailable = availability.availableDates.some((d) => isSameDay(d, date));

  return {
    isAvailable: isAvailable && !isUnavailable,
    isPreferred: isAvailable,
  };
}

// Check if staff has a night shift before a morning shift
export function hasUnsafeNightMorningSchedule(staffId: string, date: Date, shiftType: string): boolean {
  if (shiftType !== "morning") return false;

  // Check if staff has night shift the previous day
  const previousDay = subHours(date, 24);
  const previousNightShift = mockShifts.find(
    (shift) =>
      shift.assignedStaffId === staffId &&
      isSameDay(shift.date, previousDay) &&
      shift.shiftType === "night"
  );

  return !!previousNightShift;
}

// Check if staff is already assigned to another shift on the same day
export function isDoubleBooked(staffId: string, date: Date, excludeShiftId?: string): boolean {
  return mockShifts.some(
    (shift) =>
      shift.assignedStaffId === staffId &&
      isSameDay(shift.date, date) &&
      shift.id !== excludeShiftId
  );
}

// Get staff suggestions for a shift
export function getStaffSuggestions(
  availableStaff: Staff[],
  shift: Shift
): StaffSuggestion[] {
  const suggestions: StaffSuggestion[] = [];
  const shiftConfig = SHIFT_CONFIG[shift.shiftType];

  for (const staff of availableStaff) {
    const warnings: string[] = [];
    let rank: SuggestionRank = "best-match";

    // Check role match
    if (staff.role !== shift.roleRequired) {
      warnings.push("Role does not match shift requirement");
      rank = "not-suitable";
      continue; // Skip staff with wrong role
    }

    // Check if shift type is valid for role
    if (!shiftConfig.roles.includes(staff.role)) {
      warnings.push("Shift type not applicable for this role");
      rank = "not-suitable";
      continue;
    }

    // Check if on leave
    if (isStaffOnLeave(staff.id, shift.date)) {
      warnings.push("Staff is on leave");
      rank = "not-suitable";
      continue;
    }

    // Check if already assigned to another shift
    if (isDoubleBooked(staff.id, shift.date, shift.id)) {
      warnings.push("Already assigned to another shift");
      rank = "not-suitable";
      continue;
    }

    // Check weekly hours
    const weeklyHours = getWeeklyHours(staff.id, shift.date);
    const shiftHours = getShiftHours(shift.shiftType);
    if (weeklyHours + shiftHours > staff.maxWeeklyHours) {
      warnings.push(`Would exceed weekly hours (${weeklyHours + shiftHours}/${staff.maxWeeklyHours})`);
      rank = "warning";
    }

    // Check night-morning unsafe scheduling
    if (hasUnsafeNightMorningSchedule(staff.id, shift.date, shift.shiftType)) {
      warnings.push("Night shift followed by morning shift");
      rank = "warning";
    }

    // Check availability
    const availability = getStaffAvailability(staff.name, shift.date);
    if (availability) {
      if (!availability.isAvailable) {
        warnings.push("Marked as unavailable");
        rank = rank === "best-match" ? "warning" : rank;
      } else if (availability.isPreferred) {
        // Boost rank if preferred
        if (rank === "best-match" && staff.preferredShifts.includes(shift.shiftType)) {
          // Keep as best match
        }
      }
    }

    // Check preferred shifts
    if (!staff.preferredShifts.includes(shift.shiftType)) {
      if (rank === "best-match") {
        rank = "available";
      }
      warnings.push("Not a preferred shift type");
    }

    suggestions.push({
      staff,
      rank,
      warnings,
      weeklyHoursAssigned: weeklyHours,
    });
  }

  // Sort by rank priority
  const rankOrder: Record<SuggestionRank, number> = {
    "best-match": 0,
    "available": 1,
    "warning": 2,
    "not-suitable": 3,
  };

  return suggestions.sort((a, b) => {
    const rankDiff = rankOrder[a.rank] - rankOrder[b.rank];
    if (rankDiff !== 0) return rankDiff;
    // Secondary sort by weekly hours (prefer less worked)
    return a.weeklyHoursAssigned - b.weeklyHoursAssigned;
  });
}

// Validate roster for issues
export interface RosterWarning {
  shiftId: string;
  staffId?: string;
  type: string;
  message: string;
  severity: "error" | "warning";
}

export function validateRoster(shifts: Shift[], staff: Staff[]): RosterWarning[] {
  const warnings: RosterWarning[] = [];

  for (const shift of shifts) {
    // Check unfilled shifts
    if (!shift.assignedStaffId) {
      warnings.push({
        shiftId: shift.id,
        type: "unfilled",
        message: `Unfilled ${SHIFT_CONFIG[shift.shiftType].label} shift`,
        severity: shift.status === "urgent" ? "error" : "warning",
      });
      continue;
    }

    const assignedStaff = staff.find((s) => s.id === shift.assignedStaffId);
    if (!assignedStaff) continue;

    // Check role mismatch
    if (assignedStaff.role !== shift.roleRequired) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "role-mismatch",
        message: `${assignedStaff.name} (${assignedStaff.role}) assigned to ${shift.roleRequired} shift`,
        severity: "error",
      });
    }

    // Check leave conflict
    if (isStaffOnLeave(assignedStaff.id, shift.date)) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "leave-conflict",
        message: `${assignedStaff.name} is on leave`,
        severity: "error",
      });
    }

    // Check double booking
    const otherShiftsSameDay = shifts.filter(
      (s) =>
        s.id !== shift.id &&
        s.assignedStaffId === assignedStaff.id &&
        isSameDay(s.date, shift.date)
    );
    if (otherShiftsSameDay.length > 0) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "double-booked",
        message: `${assignedStaff.name} has multiple shifts on this day`,
        severity: "error",
      });
    }

    // Check night-morning
    if (hasUnsafeNightMorningSchedule(assignedStaff.id, shift.date, shift.shiftType)) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "unsafe-schedule",
        message: `${assignedStaff.name} has night shift followed by morning shift`,
        severity: "warning",
      });
    }

    // Check weekly hours
    const weeklyHours = getWeeklyHours(assignedStaff.id, shift.date);
    if (weeklyHours > assignedStaff.maxWeeklyHours) {
      warnings.push({
        shiftId: shift.id,
        staffId: assignedStaff.id,
        type: "hours-exceeded",
        message: `${assignedStaff.name} exceeds weekly hours (${weeklyHours}/${assignedStaff.maxWeeklyHours})`,
        severity: "warning",
      });
    }
  }

  return warnings;
}
