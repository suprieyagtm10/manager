"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Staff, StaffRole, EmploymentType, ShiftType, SHIFT_CONFIG, ROLE_CONFIG } from "@/lib/types";

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSave: (staff: Partial<Staff>) => void;
}

export function StaffDialog({ open, onOpenChange, staff, onSave }: StaffDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "pca" as StaffRole,
    phone: "",
    email: "",
    employmentType: "casual" as EmploymentType,
    preferredShifts: [] as ShiftType[],
    maxWeeklyHours: 38,
    notes: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
        email: staff.email,
        employmentType: staff.employmentType,
        preferredShifts: staff.preferredShifts,
        maxWeeklyHours: staff.maxWeeklyHours,
        notes: staff.notes,
      });
    } else {
      setFormData({
        name: "",
        role: "pca",
        phone: "",
        email: "",
        employmentType: "casual",
        preferredShifts: [],
        maxWeeklyHours: 38,
        notes: "",
      });
    }
  }, [staff, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleShift = (shift: ShiftType) => {
    setFormData((prev) => ({
      ...prev,
      preferredShifts: prev.preferredShifts.includes(shift)
        ? prev.preferredShifts.filter((s) => s !== shift)
        : [...prev.preferredShifts, shift],
    }));
  };

  // Get available shifts based on role
  const availableShifts = Object.entries(SHIFT_CONFIG).filter(
    ([_, config]) => config.roles.includes(formData.role)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: StaffRole) =>
                    setFormData((prev) => ({ ...prev, role: value, preferredShifts: [] }))
                  }
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
                <Label htmlFor="employment">Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value: EmploymentType) =>
                    setFormData((prev) => ({ ...prev, employmentType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="0412 345 678"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxHours">Maximum Weekly Hours</Label>
              <Input
                id="maxHours"
                type="number"
                min={1}
                max={60}
                value={formData.maxWeeklyHours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxWeeklyHours: parseInt(e.target.value) || 38,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Preferred Shifts</Label>
              <div className="flex flex-wrap gap-4">
                {availableShifts.map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={`shift-${key}`}
                      checked={formData.preferredShifts.includes(key as ShiftType)}
                      onCheckedChange={() => toggleShift(key as ShiftType)}
                    />
                    <Label htmlFor={`shift-${key}`} className="text-sm font-normal">
                      {config.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{staff ? "Save Changes" : "Add Staff"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
