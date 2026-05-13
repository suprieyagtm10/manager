"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shift, StaffRole, ShiftType, SHIFT_CONFIG, ROLE_CONFIG } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  date: Date | null;
  onSave: (shift: Partial<Shift>) => void;
  onDelete?: () => void;
}

export function ShiftDialog({
  open,
  onOpenChange,
  shift,
  date,
  onSave,
  onDelete,
}: ShiftDialogProps) {
  const [formData, setFormData] = useState({
    shiftType: "morning" as ShiftType,
    roleRequired: "pca" as StaffRole,
    notes: "",
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        shiftType: shift.shiftType,
        roleRequired: shift.roleRequired,
        notes: shift.notes,
      });
    } else {
      setFormData({
        shiftType: "morning",
        roleRequired: "pca",
        notes: "",
      });
    }
  }, [shift, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shiftConfig = SHIFT_CONFIG[formData.shiftType];
    onSave({
      ...formData,
      startTime: shiftConfig.startTime,
      endTime: shiftConfig.endTime,
    });
  };

  // Filter shift types based on selected role
  const availableShiftTypes = Object.entries(SHIFT_CONFIG).filter(
    ([_, config]) => config.roles.includes(formData.roleRequired)
  );

  const displayDate = shift?.date || date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {shift ? "Edit Shift" : "Create New Shift"}
          </DialogTitle>
          {displayDate && (
            <p className="text-sm text-muted-foreground">
              {format(displayDate, "EEEE, d MMMM yyyy")}
            </p>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role Required</Label>
              <Select
                value={formData.roleRequired}
                onValueChange={(value: StaffRole) => {
                  const newRole = value;
                  // Reset shift type if it's not valid for the new role
                  const currentShiftValid = SHIFT_CONFIG[formData.shiftType].roles.includes(newRole);
                  setFormData((prev) => ({
                    ...prev,
                    roleRequired: newRole,
                    shiftType: currentShiftValid ? prev.shiftType : "morning",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shiftType">Shift Type</Label>
              <Select
                value={formData.shiftType}
                onValueChange={(value: ShiftType) =>
                  setFormData((prev) => ({ ...prev, shiftType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableShiftTypes.map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label} ({config.startTime} - {config.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any special requirements..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{shift ? "Save Changes" : "Create Shift"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
