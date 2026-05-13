"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { StaffTable } from "@/components/staff/staff-table";
import { StaffDialog } from "@/components/staff/staff-dialog";
import { StaffFilters } from "@/components/staff/staff-filters";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Staff, StaffRole } from "@/lib/types";
import { mockStaff } from "@/lib/mock-data";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = staff.filter((s) => {
    if (roleFilter !== "all" && s.role !== roleFilter) return false;
    if (statusFilter === "active" && !s.isActive) return false;
    if (statusFilter === "inactive" && s.isActive) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsDialogOpen(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setIsDialogOpen(true);
  };

  const handleSaveStaff = (staffData: Partial<Staff>) => {
    if (editingStaff) {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id ? { ...s, ...staffData } : s
        )
      );
    } else {
      const newStaff: Staff = {
        id: `s${Date.now()}`,
        name: staffData.name || "",
        role: staffData.role || "pca",
        phone: staffData.phone || "",
        email: staffData.email || "",
        employmentType: staffData.employmentType || "casual",
        preferredShifts: staffData.preferredShifts || [],
        maxWeeklyHours: staffData.maxWeeklyHours || 38,
        isActive: true,
        notes: staffData.notes || "",
        createdAt: new Date(),
      };
      setStaff((prev) => [...prev, newStaff]);
    }
    setIsDialogOpen(false);
  };

  const handleToggleStatus = (staffId: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Staff Management"
        subtitle="Manage staff members, roles, and availability"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <StaffFilters
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <Button onClick={handleAddStaff} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Staff
            </Button>
          </div>

          <StaffTable
            staff={filteredStaff}
            onEdit={handleEditStaff}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      <StaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        staff={editingStaff}
        onSave={handleSaveStaff}
      />
    </div>
  );
}
