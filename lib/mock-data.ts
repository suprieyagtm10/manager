import {
  StaffMember,
  Shift,
  LeaveRequest,
  Availability,
  StaffRole,
  ShiftType,
} from "./types"

import { addDays, subDays, startOfDay } from "date-fns"

const today = startOfDay(new Date()).toISOString().split("T")[0]

function date(offset: number): string {
  return addDays(startOfDay(new Date()), offset).toISOString().split("T")[0]
}

function timestamp(offset: number): string {
  return subDays(new Date(), offset).toISOString()
}

export const mockStaff: StaffMember[] = [
  {
    id: "s1",
    user_id: null,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "0412 345 678",
    role: "RN",
    employment_type: "full-time",
    status: "active",
    contracted_hours: 38,
    hourly_rate: 45,
    facility_id: null,
    hire_date: date(-365),
    created_at: timestamp(365),
    updated_at: timestamp(1),
  },
  {
    id: "s2",
    user_id: null,
    first_name: "Michael",
    last_name: "Chen",
    email: "michael.chen@email.com",
    phone: "0423 456 789",
    role: "EN",
    employment_type: "full-time",
    status: "active",
    contracted_hours: 38,
    hourly_rate: 38,
    facility_id: null,
    hire_date: date(-200),
    created_at: timestamp(200),
    updated_at: timestamp(1),
  },
  {
    id: "s3",
    user_id: null,
    first_name: "Emma",
    last_name: "Williams",
    email: "emma.williams@email.com",
    phone: "0434 567 890",
    role: "AIN",
    employment_type: "part-time",
    status: "active",
    contracted_hours: 24,
    hourly_rate: 32,
    facility_id: null,
    hire_date: date(-150),
    created_at: timestamp(150),
    updated_at: timestamp(1),
  },
  {
    id: "s4",
    user_id: null,
    first_name: "James",
    last_name: "Brown",
    email: "james.brown@email.com",
    phone: "0445 678 901",
    role: "AIN",
    employment_type: "casual",
    status: "active",
    contracted_hours: 20,
    hourly_rate: 34,
    facility_id: null,
    hire_date: date(-100),
    created_at: timestamp(100),
    updated_at: timestamp(1),
  },
]

function generateShifts(): Shift[] {
  const shifts: Shift[] = []
  const shiftTypes: ShiftType[] = ["morning", "afternoon", "night"]
  const roles: (StaffRole | "ANY")[] = ["RN", "EN", "AIN"]

  for (let dayOffset = -3; dayOffset <= 10; dayOffset++) {
    for (const shiftType of shiftTypes) {
      for (const role of roles) {
        shifts.push({
          id: `shift-${dayOffset}-${shiftType}-${role}`,
          facility_id: null,
          date: date(dayOffset),
          shift_type: shiftType,
          start_time:
            shiftType === "morning"
              ? "06:00"
              : shiftType === "afternoon"
                ? "14:00"
                : "22:00",
          end_time:
            shiftType === "morning"
              ? "14:00"
              : shiftType === "afternoon"
                ? "22:00"
                : "06:00",
          required_role: role,
          status: dayOffset === 2 && role === "AIN" ? "unfilled" : "filled",
          notes: dayOffset === 2 && role === "AIN" ? "Need replacement" : null,
          created_at: timestamp(10),
          updated_at: timestamp(1),
        })
      }
    }
  }

  return shifts
}

export const mockShifts: Shift[] = generateShifts()

export const mockLeave: LeaveRequest[] = [
  {
    id: "l1",
    staff_id: "s3",
    leave_type: "annual",
    start_date: date(5),
    end_date: date(12),
    status: "approved",
    reason: "Family vacation",
    approved_by: "s1",
    approved_at: timestamp(3),
    created_at: timestamp(14),
    updated_at: timestamp(3),
  },
  {
    id: "l2",
    staff_id: "s2",
    leave_type: "personal",
    start_date: date(20),
    end_date: date(22),
    status: "pending",
    reason: "Personal appointment",
    approved_by: null,
    approved_at: null,
    created_at: timestamp(3),
    updated_at: timestamp(1),
  },
  {
    id: "l3",
    staff_id: "s1",
    leave_type: "emergency",
    start_date: date(-2),
    end_date: today,
    status: "approved",
    reason: "Unwell",
    approved_by: null,
    approved_at: null,
    created_at: timestamp(2),
    updated_at: timestamp(1),
  },
]

export const mockAvailability: Availability[] = [
  {
    id: "a1",
    staff_id: "s3",
    day_of_week: 1,
    shift_type: "morning",
    is_available: true,
    effective_from: today,
    effective_until: null,
    created_at: timestamp(5),
    updated_at: timestamp(1),
  },
  {
    id: "a2",
    staff_id: "s4",
    day_of_week: 2,
    shift_type: "afternoon",
    is_available: true,
    effective_from: today,
    effective_until: null,
    created_at: timestamp(3),
    updated_at: timestamp(1),
  },
  {
    id: "a3",
    staff_id: "s2",
    day_of_week: 5,
    shift_type: "night",
    is_available: false,
    effective_from: today,
    effective_until: null,
    created_at: timestamp(1),
    updated_at: timestamp(1),
  },
]

export function getStaffById(id: string): StaffMember | undefined {
  return mockStaff.find((s) => s.id === id)
}

export function getActiveStaff(): StaffMember[] {
  return mockStaff.filter((s) => s.status === "active")
}

export function getStaffByRole(role: StaffRole): StaffMember[] {
  return mockStaff.filter((s) => s.role === role && s.status === "active")
}

export function getShiftsByDate(targetDate: string): Shift[] {
  return mockShifts.filter((s) => s.date === targetDate)
}

export function getUnfilledShifts(): Shift[] {
  return mockShifts.filter((s) => s.status === "unfilled")
}

export function getUpcomingLeave(): LeaveRequest[] {
  return mockLeave.filter(
    (l) => l.end_date >= today && l.status === "approved"
  )
}

export function getPendingLeave(): LeaveRequest[] {
  return mockLeave.filter((l) => l.status === "pending")
}