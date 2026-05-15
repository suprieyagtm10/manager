// Database Types matching Supabase schema

export type StaffRole = "RN" | "EN" | "AIN" | "ADMIN"
export type EmploymentType = "full-time" | "part-time" | "casual"
export type ShiftType = "morning" | "afternoon" | "night"
export type ShiftStatus = "unfilled" | "filled" | "partial"
export type AssignmentStatus = "assigned" | "confirmed" | "completed" | "cancelled" | "no-show"
export type LeaveType = "annual" | "sick" | "personal" | "unpaid" | "other"
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
  staff_members: StaffMember
}

export interface WarningWithRelations extends Warning {
  staff_members?: StaffMember | null
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
export const SHIFT_CONFIG: Record<ShiftType, { label: string; startTime: string; endTime: string }> = {
  morning: {
    label: "Morning",
    startTime: "06:00",
    endTime: "14:00",
  },
  afternoon: {
    label: "Afternoon",
    startTime: "14:00",
    endTime: "22:00",
  },
  night: {
    label: "Night",
    startTime: "22:00",
    endTime: "06:00",
  },
}

export const ROLE_CONFIG: Record<StaffRole, { label: string; bgColor: string; textColor: string }> = {
  RN: {
    label: "Registered Nurse",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  EN: {
    label: "Enrolled Nurse",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  AIN: {
    label: "Assistant in Nursing",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  ADMIN: {
    label: "Administrator",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
}

export const STATUS_CONFIG: Record<ShiftStatus, { label: string; bgColor: string; textColor: string }> = {
  filled: { label: "Filled", bgColor: "bg-green-100", textColor: "text-green-700" },
  unfilled: { label: "Unfilled", bgColor: "bg-red-100", textColor: "text-red-700" },
  partial: { label: "Partial", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
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
