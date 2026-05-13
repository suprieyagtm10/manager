"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { LeaveTable } from "@/components/leave/leave-table";
import { LeaveDialog } from "@/components/leave/leave-dialog";
import { LeaveFilters } from "@/components/leave/leave-filters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, AlertTriangle } from "lucide-react";
import { Leave, LeaveStatus, StaffRole } from "@/lib/types";
import { mockLeave, mockStaff } from "@/lib/mock-data";

export default function LeavePage() {
  const [leaves, setLeaves] = useState<Leave[]>(mockLeave);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");

  const pendingLeaves = leaves.filter((l) => l.status === "pending");
  const approvedLeaves = leaves.filter((l) => l.status === "approved" || l.status === "emergency");
  const rejectedLeaves = leaves.filter((l) => l.status === "rejected");

  const filteredLeaves = leaves.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (roleFilter !== "all" && l.role !== roleFilter) return false;
    return true;
  });

  const handleAddLeave = (emergency: boolean = false) => {
    setEditingLeave(null);
    setIsEmergencyMode(emergency);
    setIsDialogOpen(true);
  };

  const handleEditLeave = (leave: Leave) => {
    setEditingLeave(leave);
    setIsEmergencyMode(leave.status === "emergency");
    setIsDialogOpen(true);
  };

  const handleSaveLeave = (leaveData: Partial<Leave>) => {
    if (editingLeave) {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === editingLeave.id ? { ...l, ...leaveData } : l
        )
      );
    } else {
      const newLeave: Leave = {
        id: `l${Date.now()}`,
        staffId: leaveData.staffId || "",
        staffName: leaveData.staffName || "",
        role: leaveData.role || "pca",
        startDate: leaveData.startDate || new Date(),
        endDate: leaveData.endDate || new Date(),
        leaveType: leaveData.leaveType || "annual",
        reason: leaveData.reason || "",
        status: isEmergencyMode ? "emergency" : "pending",
        createdAt: new Date(),
      };
      setLeaves((prev) => [...prev, newLeave]);
    }
    setIsDialogOpen(false);
  };

  const handleStatusChange = (leaveId: string, status: LeaveStatus) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId ? { ...l, status } : l
      )
    );
  };

  const handleDelete = (leaveId: string) => {
    setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Leave Management"
        subtitle="Manage staff leave requests and emergency absences"
      />
      <div className="flex-1 overflow-auto p-6">
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
              <TabsTrigger value="all">
                All ({leaves.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingLeaves.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedLeaves.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedLeaves.length})
              </TabsTrigger>
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
                leaves={pendingLeaves.filter((l) => roleFilter === "all" || l.role === roleFilter)}
                onEdit={handleEditLeave}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="approved">
              <LeaveTable
                leaves={approvedLeaves.filter((l) => roleFilter === "all" || l.role === roleFilter)}
                onEdit={handleEditLeave}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="rejected">
              <LeaveTable
                leaves={rejectedLeaves.filter((l) => roleFilter === "all" || l.role === roleFilter)}
                onEdit={handleEditLeave}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <LeaveDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        leave={editingLeave}
        staff={mockStaff.filter((s) => s.isActive)}
        isEmergency={isEmergencyMode}
        onSave={handleSaveLeave}
      />
    </div>
  );
}
