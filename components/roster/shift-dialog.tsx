"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShiftWithAssignment, StaffRole, ShiftType, SHIFT_CONFIG, ROLE_CONFIG } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface ShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shift: ShiftWithAssignment | null
  date: Date | null
  onSave: (shift: Partial<ShiftWithAssignment>) => void
  onDelete?: () => void
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
    shift_type: "morning" as ShiftType,
    required_role: "PCA" as StaffRole,
    notes: "",
  })

  useEffect(() => {
    if (shift) {
      setFormData({
        shift_type: shift.shift_type as ShiftType,
        required_role: shift.required_role as StaffRole,
        notes: shift.notes || "",
      })
    } else {
      setFormData({
        shift_type: "morning",
        required_role: "PCA",
        notes: "",
      })
    }
  }, [shift, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const shiftConfig = SHIFT_CONFIG[formData.shift_type]
    onSave({
      ...formData,
      start_time: shiftConfig.startTime,
      end_time: shiftConfig.endTime,
    })
  }

  // Filter shift types based on selected role
  const availableShiftTypes = Object.entries(SHIFT_CONFIG).filter(([key, config]) =>
    config.roles.includes(formData.required_role)
  )

  const displayDate = shift?.date ? parseISO(shift.date) : date

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{shift ? "Edit Shift" : "Create New Shift"}</DialogTitle>
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
                value={formData.required_role}
                onValueChange={(value: StaffRole) => {
                  const newRole = value
                  const currentShiftValid = SHIFT_CONFIG[formData.shift_type]?.roles?.includes(newRole)
                  setFormData((prev) => ({
                    ...prev,
                    required_role: newRole,
                    shift_type: currentShiftValid ? prev.shift_type : "morning",
                  }))
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
                value={formData.shift_type}
                onValueChange={(value: ShiftType) =>
                  setFormData((prev) => ({ ...prev, shift_type: value }))
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
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
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
              <Button type="button" variant="outline" className="min-h-11 rounded-xl" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="min-h-11 rounded-xl">{shift ? "Save Changes" : "Create Shift"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
