"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LeaveTable } from "@/components/leave/leave-table"
import { LeaveDialog } from "@/components/leave/leave-dialog"
import { LeaveFilters } from "@/components/leave/leave-filters"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPlus, AlertTriangle } from "lucide-react"
import { LeaveRequestWithStaff, LeaveStatus, StaffRole, StaffMember } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface LeaveClientProps {
  initialLeaves: LeaveRequestWithStaff[]
  staff: StaffMember[]
}

export function LeaveClient({ initialLeaves, staff }: LeaveClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [leaves, setLeaves] = useState<LeaveRequestWithStaff[]>(initialLeaves)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLeave, setEditingLeave] = useState<LeaveRequestWithStaff | null>(null)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "all">("all")
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all")

  const pendingLeaves = leaves.filter((l) => l.status === "pending")
  const approvedLeaves = leaves.filter((l) => l.status === "approved")
  const rejectedLeaves = leaves.filter((l) => l.status === "rejected")

  const filteredLeaves = leaves.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false
    if (roleFilter !== "all" && l.staff_members?.role !== roleFilter) return false
    return true
  })

  const handleAddLeave = (emergency: boolean = false) => {
    setEditingLeave(null)
    setIsEmergencyMode(emergency)
    setIsDialogOpen(true)
  }

  const handleEditLeave = (leave: LeaveRequestWithStaff) => {
    setEditingLeave(leave)
    setIsEmergencyMode(leave.leave_type === "emergency")
    setIsDialogOpen(true)
  }

  const handleSaveLeave = async (leaveData: Partial<LeaveRequestWithStaff>) => {
    try {
      if (editingLeave) {
        const { error } = await supabase
          .from("leave_requests")
          .update({
            staff_id: leaveData.staff_id,
            start_date: leaveData.start_date,
            end_date: leaveData.end_date,
            leave_type: leaveData.leave_type,
            reason: leaveData.reason,
            status: leaveData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingLeave.id)

        if (error) throw error

        // Update local state
        const staffMember = staff.find((s) => s.id === leaveData.staff_id)
        setLeaves((prev) =>
          prev.map((l) =>
            l.id === editingLeave.id
              ? { ...l, ...leaveData, staff_members: staffMember || l.staff_members }
              : l
          )
        )
        toast.success("Leave request updated successfully")
      } else {
        const { data, error } = await supabase
          .from("leave_requests")
          .insert({
            staff_id: leaveData.staff_id,
            start_date: leaveData.start_date,
            end_date: leaveData.end_date,
            leave_type: isEmergencyMode ? "emergency" : leaveData.leave_type || "annual",
            reason: leaveData.reason,
            status: isEmergencyMode ? "approved" : "pending",
          })
          .select()
          .single()

        if (error) throw error

        const staffMember = staff.find((s) => s.id === leaveData.staff_id)
        setLeaves((prev) => [
          ...prev,
          { ...data, staff_members: staffMember! },
        ])
        toast.success("Leave request created successfully")
      }
      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving leave:", error)
      toast.error("Failed to save leave request")
    }
  }

  const handleStatusChange = async (leaveId: string, status: LeaveStatus) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", leaveId)

      if (error) throw error

      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status } : l))
      )
      toast.success(`Leave request ${status}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating leave status:", error)
      toast.error("Failed to update leave status")
    }
  }

  const handleDelete = async (leaveId: string) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .delete()
        .eq("id", leaveId)

      if (error) throw error

      setLeaves((prev) => prev.filter((l) => l.id !== leaveId))
      toast.success("Leave request deleted successfully")
      router.refresh()
    } catch (error) {
      console.error("Error deleting leave:", error)
      toast.error("Failed to delete leave request")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <LeaveFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleAddLeave(true)}
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <AlertTriangle className="h-4 w-4" />
            Emergency Leave
          </Button>
          <Button onClick={() => handleAddLeave(false)} className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            Add Leave
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({leaves.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingLeaves.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedLeaves.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedLeaves.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <LeaveTable
            leaves={filteredLeaves}
            onEdit={handleEditLeave}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="pending">
          <LeaveTable
            leaves={pendingLeaves.filter(
              (l) => roleFilter === "all" || l.staff_members?.role === roleFilter
            )}
            onEdit={handleEditLeave}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="approved">
          <LeaveTable
            leaves={approvedLeaves.filter(
              (l) => roleFilter === "all" || l.staff_members?.role === roleFilter
            )}
            onEdit={handleEditLeave}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <LeaveTable
            leaves={rejectedLeaves.filter(
              (l) => roleFilter === "all" || l.staff_members?.role === roleFilter
            )}
            onEdit={handleEditLeave}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <LeaveDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        leave={editingLeave}
        staff={staff}
        isEmergency={isEmergencyMode}
        onSave={handleSaveLeave}
      />
    </div>
  )
}
