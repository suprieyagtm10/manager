import { createClient } from "@/lib/supabase/server"
import type {
  StaffMember,
  Shift,
  ShiftAssignment,
  LeaveRequest,
  Availability,
  Warning,
  Certification,
  ShiftWithAssignment,
  StaffMemberWithCertifications,
  LeaveRequestWithStaff,
  WarningWithRelations,
  Facility,
} from "@/lib/types"

// Facilities
export async function getFacilities(): Promise<Facility[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("facilities")
    .select("*")
    .order("name")

  if (error) throw error
  return data || []
}

// Staff Members
export async function getStaffMembers(): Promise<StaffMember[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("staff_members")
    .select("*")
    .order("last_name")

  if (error) throw error
  return data || []
}

export async function getActiveStaffMembers(): Promise<StaffMember[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("staff_members")
    .select("*")
    .eq("status", "active")
    .order("last_name")

  if (error) throw error

  return data || []
}

export async function getStaffMembersWithCertifications(): Promise<StaffMemberWithCertifications[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("staff_members")
    .select(`
      *,
      certifications (*)
    `)
    .order("last_name")

  if (error) throw error
  return data || []
}

export async function getStaffMemberById(id: string): Promise<StaffMemberWithCertifications | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("staff_members")
    .select(`
      *,
      certifications (*)
    `)
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function createStaffMember(staff: Omit<StaffMember, "id" | "created_at" | "updated_at">): Promise<StaffMember> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("staff_members")
    .insert(staff)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStaffMember(id: string, updates: Partial<StaffMember>): Promise<StaffMember> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("staff_members")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteStaffMember(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("staff_members")
    .delete()
    .eq("id", id)

  if (error) throw error
}

// Shifts
export async function getShifts(startDate?: string, endDate?: string): Promise<Shift[]> {
  const supabase = await createClient()
  let query = supabase.from("shifts").select("*").order("date").order("start_time")

  if (startDate) {
    query = query.gte("date", startDate)
  }
  if (endDate) {
    query = query.lte("date", endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getShiftsWithAssignments(startDate?: string, endDate?: string): Promise<ShiftWithAssignment[]> {
  const supabase = await createClient()
  let query = supabase
    .from("shifts")
    .select(`
      *,
      shift_assignments (
        *,
        staff_members (*)
      )
    `)
    .order("date")
    .order("start_time")

  if (startDate) {
    query = query.gte("date", startDate)
  }
  if (endDate) {
    query = query.lte("date", endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getShiftById(id: string): Promise<ShiftWithAssignment | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shifts")
    .select(`
      *,
      shift_assignments (
        *,
        staff_members (*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function createShift(shift: Omit<Shift, "id" | "created_at" | "updated_at">): Promise<Shift> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shifts")
    .insert(shift)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateShift(id: string, updates: Partial<Shift>): Promise<Shift> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shifts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteShift(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("shifts").delete().eq("id", id)

  if (error) throw error
}

// Shift Assignments
export async function createShiftAssignment(assignment: Omit<ShiftAssignment, "id" | "created_at" | "updated_at" | "assigned_at">): Promise<ShiftAssignment> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shift_assignments")
    .insert(assignment)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateShiftAssignment(id: string, updates: Partial<ShiftAssignment>): Promise<ShiftAssignment> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shift_assignments")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteShiftAssignment(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("shift_assignments").delete().eq("id", id)

  if (error) throw error
}

// Leave Requests
export async function getLeaveRequests(): Promise<LeaveRequestWithStaff[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("leave_requests")
.select(`
  *,
  staff_members:staff_members!leave_requests_staff_id_fkey (*),
  approver:staff_members!leave_requests_approved_by_fkey (*)
`)
    .order("start_date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getLeaveRequestsByStaff(staffId: string): Promise<LeaveRequest[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("staff_id", staffId)
    .order("start_date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createLeaveRequest(leave: Omit<LeaveRequest, "id" | "created_at" | "updated_at">): Promise<LeaveRequest> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("leave_requests")
    .insert(leave)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLeaveRequest(id: string, updates: Partial<LeaveRequest>): Promise<LeaveRequest> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("leave_requests")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Availability
export async function getAvailability(): Promise<Availability[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .order("staff_id")
    .order("day_of_week")

  if (error) throw error
  return data || []
}

export async function getAvailabilityByStaff(staffId: string): Promise<Availability[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("staff_id", staffId)
    .order("day_of_week")

  if (error) throw error
  return data || []
}

export async function upsertAvailability(availability: Omit<Availability, "id" | "created_at" | "updated_at">): Promise<Availability> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("availability")
    .upsert(availability, { 
      onConflict: "staff_id,day_of_week,shift_type,effective_from" 
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Certifications
export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("expiry_date")

  if (error) throw error
  return data || []
}

export async function createCertification(cert: Omit<Certification, "id" | "created_at" | "updated_at">): Promise<Certification> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("certifications")
    .insert(cert)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("certifications")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Warnings
export async function getWarnings(resolved?: boolean): Promise<WarningWithRelations[]> {
  const supabase = await createClient()
  let query = supabase
    .from("warnings")
    .select(`
      *,
      staff_members:staff_members!warnings_staff_id_fkey (*),
      resolver:staff_members!warnings_resolved_by_fkey (*),
      shifts (*)
    `)
    .order("created_at", { ascending: false })

  if (resolved !== undefined) {
    query = query.eq("resolved", resolved)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function createWarning(warning: Omit<Warning, "id" | "created_at">): Promise<Warning> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("warnings")
    .insert(warning)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function resolveWarning(id: string, resolvedBy: string): Promise<Warning> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("warnings")
    .update({
      resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: resolvedBy,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Dashboard Stats
export async function getDashboardStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const [
    { count: totalStaff },
    { count: activeStaff },
    { data: todayShifts },
    { count: unfilledShifts },
    { count: pendingLeave },
    { count: unresolvedWarnings },
  ] = await Promise.all([
    supabase.from("staff_members").select("*", { count: "exact", head: true }),
    supabase.from("staff_members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("shifts").select("*").eq("date", today),
    supabase.from("shifts").select("*", { count: "exact", head: true }).eq("status", "unfilled"),
    supabase.from("leave_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("warnings").select("*", { count: "exact", head: true }).eq("resolved", false),
  ])

  return {
    totalStaff: totalStaff || 0,
    activeStaff: activeStaff || 0,
    todayShiftsCount: todayShifts?.length || 0,
    todayFilledShifts: todayShifts?.filter((s) => s.status === "filled").length || 0,
    unfilledShifts: unfilledShifts || 0,
    pendingLeave: pendingLeave || 0,
    unresolvedWarnings: unresolvedWarnings || 0,
  }
}
