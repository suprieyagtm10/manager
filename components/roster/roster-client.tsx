"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RosterCalendar } from "@/components/roster/roster-calendar"
import { RosterToolbar } from "@/components/roster/roster-toolbar"
import { ShiftDialog } from "@/components/roster/shift-dialog"
import { AssignStaffDialog } from "@/components/roster/assign-staff-dialog"
import { ShiftWithAssignment, StaffRole, StaffMember } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { format } from "date-fns"

export type ViewMode = "day" | "week" | "month"

interface RosterClientProps {
  initialShifts: ShiftWithAssignment[]
  staff: StaffMember[]
}

export function RosterClient({ initialShifts, staff }: RosterClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [shifts, setShifts] = useState<ShiftWithAssignment[]>(initialShifts)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all")
  const [showOnlyIssues, setShowOnlyIssues] = useState(false)

  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<ShiftWithAssignment | null>(null)
  const [newShiftDate, setNewShiftDate] = useState<Date | null>(null)

  const handleAddShift = (date: Date) => {
    setNewShiftDate(date)
    setSelectedShift(null)
    setIsShiftDialogOpen(true)
  }

  const handleEditShift = (shift: ShiftWithAssignment) => {
    setSelectedShift(shift)
    setNewShiftDate(null)
    setIsShiftDialogOpen(true)
  }

  const handleAssignStaff = (shift: ShiftWithAssignment) => {
    setSelectedShift(shift)
    setIsAssignDialogOpen(true)
  }

  const handleSaveShift = async (shiftData: Partial<ShiftWithAssignment>) => {
    try {
      if (selectedShift) {
        const { error } = await supabase
          .from("shifts")
          .update({
            date: shiftData.date,
            shift_type: shiftData.shift_type,
            start_time: shiftData.start_time,
            end_time: shiftData.end_time,
            required_role: shiftData.required_role,
            notes: shiftData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedShift.id)

        if (error) throw error

        setShifts((prev) =>
          prev.map((s) =>
            s.id === selectedShift.id ? { ...s, ...shiftData } : s
          )
        )
        toast.success("Shift updated successfully")
      } else if (newShiftDate) {
        const { data, error } = await supabase
          .from("shifts")
          .insert({
            facility_id: "00000000-0000-0000-0000-000000000001",
            date: format(newShiftDate, "yyyy-MM-dd"),
            shift_type: shiftData.shift_type || "morning",
            start_time: shiftData.start_time || "07:00",
            end_time: shiftData.end_time || "15:00",
            required_role: shiftData.required_role || "AIN",
            status: "unfilled",
            notes: shiftData.notes || "",
          })
          .select()
          .single()

        if (error) throw error

        setShifts((prev) => [...prev, { ...data, shift_assignments: [] }])
        toast.success("Shift created successfully")
      }
      setIsShiftDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving shift:", error)
      toast.error("Failed to save shift")
    }
  }

  const handleStaffAssigned = async (staffId: string, staffName: string) => {
    if (!selectedShift) return

    try {
      // Check if there's an existing assignment
      const existingAssignment = selectedShift.shift_assignments?.[0]

      if (existingAssignment) {
        // Update existing assignment
        const { error } = await supabase
          .from("shift_assignments")
          .update({
            staff_id: staffId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingAssignment.id)

        if (error) throw error
      } else {
        // Create new assignment
        const { error } = await supabase
          .from("shift_assignments")
          .insert({
            shift_id: selectedShift.id,
            staff_id: staffId,
            status: "assigned",
          })

        if (error) throw error
      }

      // Update shift status to filled
      await supabase
        .from("shifts")
        .update({ status: "filled", updated_at: new Date().toISOString() })
        .eq("id", selectedShift.id)

      // Update local state
      const staffMember = staff.find((s) => s.id === staffId)
      setShifts((prev) =>
        prev.map((s) =>
          s.id === selectedShift.id
            ? {
                ...s,
                status: "filled",
                shift_assignments: [
                  {
                    id: existingAssignment?.id || crypto.randomUUID(),
                    shift_id: selectedShift.id,
                    staff_id: staffId,
                    status: "assigned",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    staff_members: staffMember!,
                  },
                ],
              }
            : s
        )
      )

      toast.success(`${staffName} assigned to shift`)
      setIsAssignDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error assigning staff:", error)
      toast.error("Failed to assign staff")
    }
  }

  const handleRemoveStaff = async (shiftId: string) => {
    try {
      // Delete the assignment
      const { error: deleteError } = await supabase
        .from("shift_assignments")
        .delete()
        .eq("shift_id", shiftId)

      if (deleteError) throw deleteError

      // Update shift status to unfilled
      const { error: updateError } = await supabase
        .from("shifts")
        .update({ status: "unfilled", updated_at: new Date().toISOString() })
        .eq("id", shiftId)

      if (updateError) throw updateError

      setShifts((prev) =>
        prev.map((s) =>
          s.id === shiftId
            ? { ...s, status: "unfilled", shift_assignments: [] }
            : s
        )
      )

      toast.success("Staff removed from shift")
      router.refresh()
    } catch (error) {
      console.error("Error removing staff:", error)
      toast.error("Failed to remove staff")
    }
  }

  const handleDeleteShift = async (shiftId: string) => {
    try {
      // Delete assignments first
      await supabase.from("shift_assignments").delete().eq("shift_id", shiftId)

      // Delete the shift
      const { error } = await supabase.from("shifts").delete().eq("id", shiftId)

      if (error) throw error

      setShifts((prev) => prev.filter((s) => s.id !== shiftId))
      toast.success("Shift deleted successfully")
      setIsShiftDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting shift:", error)
      toast.error("Failed to delete shift")
    }
  }

  return (
    <>
      <RosterToolbar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        showOnlyIssues={showOnlyIssues}
        setShowOnlyIssues={setShowOnlyIssues}
      />

      <div className="flex-1 overflow-auto p-6">
        <RosterCalendar
          shifts={shifts}
          selectedDate={selectedDate}
          viewMode={viewMode}
          roleFilter={roleFilter}
          showOnlyIssues={showOnlyIssues}
          onAddShift={handleAddShift}
          onEditShift={handleEditShift}
          onAssignStaff={handleAssignStaff}
          onRemoveStaff={handleRemoveStaff}
        />
      </div>

      <ShiftDialog
        open={isShiftDialogOpen}
        onOpenChange={setIsShiftDialogOpen}
        shift={selectedShift}
        date={newShiftDate}
        onSave={handleSaveShift}
        onDelete={selectedShift ? () => handleDeleteShift(selectedShift.id) : undefined}
      />

      <AssignStaffDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        shift={selectedShift}
        staff={staff}
        onAssign={handleStaffAssigned}
      />
    </>
  )
}
