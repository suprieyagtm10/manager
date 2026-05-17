"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { StaffTable } from "@/components/staff/staff-table"
import { StaffDialog } from "@/components/staff/staff-dialog"
import { StaffFilters } from "@/components/staff/staff-filters"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { StaffMemberWithCertifications, StaffRole } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface StaffClientProps {
  initialStaff: StaffMemberWithCertifications[]
}

export function StaffClient({ initialStaff }: StaffClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [staff, setStaff] = useState<StaffMemberWithCertifications[]>(initialStaff)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMemberWithCertifications | null>(null)
  const initialRole = (searchParams.get("role") as StaffRole | null)
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">(initialRole || "all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "on-leave">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStaff = staff.filter((s) => {
    if (roleFilter !== "all" && s.role !== roleFilter) return false
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase()
    if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleAddStaff = () => {
    setEditingStaff(null)
    setIsDialogOpen(true)
  }

  const handleEditStaff = (staffMember: StaffMemberWithCertifications) => {
    setEditingStaff(staffMember)
    setIsDialogOpen(true)
  }

  const handleSaveStaff = async (staffData: Partial<StaffMemberWithCertifications>) => {
    try {
      if (editingStaff) {
        const { error } = await supabase
          .from("staff_members")
          .update({
            first_name: staffData.first_name,
            last_name: staffData.last_name,
            email: staffData.email,
            phone: staffData.phone,
            role: staffData.role,
            employment_type: staffData.employment_type,
            contracted_hours: staffData.contracted_hours,
            hourly_rate: staffData.hourly_rate,
            status: staffData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingStaff.id)

        if (error) throw error

        setStaff((prev) =>
          prev.map((s) =>
            s.id === editingStaff.id ? { ...s, ...staffData } : s
          )
        )
        toast.success("Staff member updated successfully")
      } else {
        const { data, error } = await supabase
          .from("staff_members")
          .insert({
            first_name: staffData.first_name,
            last_name: staffData.last_name,
            email: staffData.email,
            phone: staffData.phone,
            role: staffData.role,
            employment_type: staffData.employment_type,
            contracted_hours: staffData.contracted_hours,
            hourly_rate: staffData.hourly_rate,
            status: "active",
            facility_id: "00000000-0000-0000-0000-000000000001",
          })
          .select()
          .single()

        if (error) throw error

        setStaff((prev) => [...prev, { ...data, certifications: [] }])
        toast.success("Staff member added successfully")
      }
      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving staff:", error)
      toast.error("Failed to save staff member")
    }
  }

  const handleToggleStatus = async (staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId)
    if (!staffMember) return

    const newStatus = staffMember.status === "active" ? "inactive" : "active"

    try {
      const { error } = await supabase
        .from("staff_members")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", staffId)

      if (error) throw error

      setStaff((prev) =>
        prev.map((s) =>
          s.id === staffId ? { ...s, status: newStatus } : s
        )
      )
      toast.success(`Staff member ${newStatus === "active" ? "activated" : "deactivated"}`)
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Failed to update staff status")
    }
  }

  return (
    <div className="page-section">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <StaffFilters
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Button onClick={handleAddStaff} className="touch-button gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <StaffTable
        staff={filteredStaff}
        onEdit={handleEditStaff}
        onToggleStatus={handleToggleStatus}
      />

      <StaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        staff={editingStaff}
        onSave={handleSaveStaff}
      />
    </div>
  )
}
