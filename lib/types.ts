// Database Types matching Supabase schema

export type StaffRole = "RN" | "EN" | "PCA" | "FSA" | "CHEF" | "ADMIN"
export type EmploymentType = "full-time" | "part-time" | "casual"
export type ShiftType = "morning" | "kitchen_afternoon" | "care_afternoon" | "night"
export type ShiftStatus = "unfilled" | "filled" | "partial" | "urgent"
export type AssignmentStatus = "assigned" | "confirmed" | "completed" | "cancelled" | "no-show"
export type LeaveType = "annual" | "sick" | "personal" | "unpaid" | "other" | "emergency"
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled"
export type CertificationStatus = "valid" | "expiring" | "expired"
export type WarningType = "overtime" | "certification" | "understaffed" | "compliance" | "no-break"
export type WarningSeverity = "info" | "warning" | "critical"

// Database Row Types
export interface Facility {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export type Staff = StaffMember
export type Leave = LeaveRequest

export interface StaffMember {
  id: string
  user_id: string | null
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: StaffRole
  employment_type: EmploymentType
  status: "active" | "inactive" | "on-leave"
  contracted_hours: number | null
  hourly_rate: number | null
  facility_id: string | null
  hire_date: string | null
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  staff_id: string
  name: string
  expiry_date: string
  status: CertificationStatus
  created_at: string
  updated_at: string
}

export interface Shift {
  // Legacy client-side fields kept optional for older helper code
  assignedStaffId?: string | null
  shiftType?: ShiftType
  roleRequired?: StaffRole | "ANY"
  id: string
  facility_id: string | null
  date: string
  shift_type: ShiftType
  start_time: string
  end_time: string
  required_role: StaffRole | "ANY"
  status: ShiftStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ShiftAssignment {
  id: string
  shift_id: string
  staff_id: string
  status: AssignmentStatus
  assigned_at: string
  confirmed_at: string | null
  created_at: string
  updated_at: string
}

export interface LeaveRequest {
  // Legacy client-side fields kept optional for older helper code
  staffId?: string
  startDate?: Date
  endDate?: Date
  id: string
  staff_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  status: LeaveStatus
  reason: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface Availability {
  // Optional display fields used by the demo availability portal
  staffName?: string
  role?: StaffRole
  startDate?: Date
  endDate?: Date
  preferredShifts?: ShiftType[]
  availableDates?: Date[]
  unavailableDates?: Date[]
  notes?: string | null
  submittedAt?: Date
  id: string
  staff_id: string
  day_of_week: number
  shift_type: ShiftType
  is_available: boolean
  effective_from: string
  effective_until: string | null
  created_at: string
  updated_at: string
}

export interface Warning {
  id: string
  staff_id: string | null
  shift_id: string | null
  warning_type: WarningType
  severity: WarningSeverity
  message: string
  resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
}


export interface WorkingHoursEntry {
  id: string
  staff_id: string
  work_date: string
  start_time: string
  end_time: string
  break_minutes: number
  total_hours: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface WorkingHoursEntryWithStaff extends WorkingHoursEntry {
  staff_members?: StaffMember | null
}

// Extended types with joins
export interface ShiftWithAssignment extends Shift {
  shift_assignments: (ShiftAssignment & {
    staff_members: StaffMember
  })[]
}

export interface StaffMemberWithCertifications extends StaffMember {
  certifications: Certification[]
}

export interface LeaveRequestWithStaff extends LeaveRequest {
  staff_members?: StaffMember | null
  staff?: StaffMember | null
  approver?: StaffMember | null
}

export interface WarningWithRelations extends Warning {
  staff_members?: StaffMember | null
  resolver?: StaffMember | null
  shifts?: Shift | null
}

// Staff Suggestion Types
export type SuggestionRank = "best-match" | "available" | "warning" | "not-suitable"

export interface StaffSuggestion {
  staff: StaffMember
  rank: SuggestionRank
  warnings: string[]
  weeklyHoursAssigned: number
  matchScore: number
}

// Configuration
export const SHIFT_CONFIG: Record<
  ShiftType,
  {
    label: string
    startTime: string
    endTime: string
    roles: StaffRole[]
  }
> = {
  morning: {
    label: "Morning 7am-3pm",
    startTime: "07:00",
    endTime: "15:00",
    roles: ["RN", "EN", "PCA", "FSA", "CHEF"],
  },
  kitchen_afternoon: {
    label: "Kitchen 3pm-7pm",
    startTime: "15:00",
    endTime: "19:00",
    roles: ["FSA", "CHEF"],
  },
  care_afternoon: {
    label: "Care 3pm-11pm",
    startTime: "15:00",
    endTime: "23:00",
    roles: ["RN", "EN", "PCA"],
  },
  night: {
    label: "Night 11pm-7am",
    startTime: "23:00",
    endTime: "07:00",
    roles: ["RN", "EN", "PCA"],
  },
}

export const ROLE_CONFIG: Record<StaffRole, { label: string; group: "Nursing" | "Kitchen" | "Admin"; bgColor: string; textColor: string }> = {
  RN: {
    label: "Registered Nurse",
    group: "Nursing",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  EN: {
    label: "Enrolled Nurse",
    group: "Nursing",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  PCA: {
    label: "Personal Care Assistant",
    group: "Nursing",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  FSA: {
    label: "Food Services Assistant",
    group: "Kitchen",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  CHEF: {
    label: "Chef",
    group: "Kitchen",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  ADMIN: {
    label: "Administrator",
    group: "Admin",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
  },
}

export const STATUS_CONFIG: Record<ShiftStatus, { label: string; bgColor: string; textColor: string }> = {
  filled: { label: "Filled", bgColor: "bg-green-100", textColor: "text-green-700" },
  unfilled: { label: "Unfilled", bgColor: "bg-red-100", textColor: "text-red-700" },
  partial: { label: "Partial", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  urgent: { label: "Urgent", bgColor: "bg-orange-100", textColor: "text-orange-700" },
}

export const LEAVE_STATUS_CONFIG: Record<LeaveStatus, { label: string; bgColor: string; textColor: string }> = {
  pending: { label: "Pending", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  approved: { label: "Approved", bgColor: "bg-green-100", textColor: "text-green-700" },
  rejected: { label: "Rejected", bgColor: "bg-red-100", textColor: "text-red-700" },
  cancelled: { label: "Cancelled", bgColor: "bg-gray-100", textColor: "text-gray-700" },
}

export const CERTIFICATION_STATUS_CONFIG: Record<CertificationStatus, { label: string; bgColor: string; textColor: string }> = {
  valid: { label: "Valid", bgColor: "bg-green-100", textColor: "text-green-700" },
  expiring: { label: "Expiring Soon", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  expired: { label: "Expired", bgColor: "bg-red-100", textColor: "text-red-700" },
}

export const WARNING_SEVERITY_CONFIG: Record<WarningSeverity, { label: string; bgColor: string; textColor: string }> = {
  info: { label: "Info", bgColor: "bg-blue-100", textColor: "text-blue-700" },
  warning: { label: "Warning", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  critical: { label: "Critical", bgColor: "bg-red-100", textColor: "text-red-700" },
}

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
