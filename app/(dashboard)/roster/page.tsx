"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { RosterCalendar } from "@/components/roster/roster-calendar";
import { RosterToolbar } from "@/components/roster/roster-toolbar";
import { ShiftDialog } from "@/components/roster/shift-dialog";
import { AssignStaffDialog } from "@/components/roster/assign-staff-dialog";
import { Shift, StaffRole } from "@/lib/types";
import { mockShifts, mockStaff } from "@/lib/mock-data";

export type ViewMode = "day" | "week" | "month";

export default function RosterPage() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [newShiftDate, setNewShiftDate] = useState<Date | null>(null);

  const handleAddShift = (date: Date) => {
    setNewShiftDate(date);
    setSelectedShift(null);
    setIsShiftDialogOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setNewShiftDate(null);
    setIsShiftDialogOpen(true);
  };

  const handleAssignStaff = (shift: Shift) => {
    setSelectedShift(shift);
    setIsAssignDialogOpen(true);
  };

  const handleSaveShift = (shiftData: Partial<Shift>) => {
    if (selectedShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === selectedShift.id ? { ...s, ...shiftData } : s
        )
      );
    } else if (newShiftDate) {
      const newShift: Shift = {
        id: `shift-${Date.now()}`,
        date: newShiftDate,
        shiftType: shiftData.shiftType || "morning",
        startTime: shiftData.startTime || "07:00",
        endTime: shiftData.endTime || "15:00",
        roleRequired: shiftData.roleRequired || "pca",
        assignedStaffId: null,
        assignedStaffName: null,
        status: "unfilled",
        notes: shiftData.notes || "",
      };
      setShifts((prev) => [...prev, newShift]);
    }
    setIsShiftDialogOpen(false);
  };

  const handleStaffAssigned = (staffId: string, staffName: string) => {
    if (selectedShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === selectedShift.id
            ? {
                ...s,
                assignedStaffId: staffId,
                assignedStaffName: staffName,
                status: "filled",
              }
            : s
        )
      );
    }
    setIsAssignDialogOpen(false);
  };

  const handleRemoveStaff = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              assignedStaffId: null,
              assignedStaffName: null,
              status: "unfilled",
            }
          : s
      )
    );
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    setIsShiftDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Roster Calendar"
        subtitle="View and manage staff schedules"
      />
      <div className="flex-1 overflow-hidden flex flex-col">
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
        staff={mockStaff.filter((s) => s.isActive)}
        onAssign={handleStaffAssigned}
      />
    </div>
  );
}
