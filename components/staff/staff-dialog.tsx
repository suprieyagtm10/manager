"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StaffMemberWithCertifications, StaffRole, EmploymentType, ROLE_CONFIG } from "@/lib/types"

interface StaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: StaffMemberWithCertifications | null
  onSave: (staff: Partial<StaffMemberWithCertifications>) => void
}

export function StaffDialog({ open, onOpenChange, staff, onSave }: StaffDialogProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "PCA" as StaffRole,
    phone: "",
    email: "",
    employment_type: "casual" as EmploymentType,
    contracted_hours: 38,
    hourly_rate: 28.5,
    status: "active" as "active" | "inactive" | "on-leave",
  })

  useEffect(() => {
    if (staff) {
      setFormData({
        first_name: staff.first_name,
        last_name: staff.last_name,
        role: staff.role,
        phone: staff.phone || "",
        email: staff.email,
        employment_type: staff.employment_type,
        contracted_hours: staff.contracted_hours || 38,
        hourly_rate: staff.hourly_rate || 28.5,
        status: staff.status,
      })
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        role: "PCA",
        phone: "",
        email: "",
        employment_type: "casual",
        contracted_hours: 38,
        hourly_rate: 28.5,
        status: "active",
      })
    }
  }, [staff, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                  placeholder="First name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: StaffRole) =>
                    setFormData((prev) => ({ ...prev, role: value }))
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
                  value={formData.employment_type}
                  onValueChange={(value: EmploymentType) =>
                    setFormData((prev) => ({ ...prev, employment_type: value }))
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
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contracted_hours">Contracted Hours/Week</Label>
                <Input
                  id="contracted_hours"
                  type="number"
                  min={0}
                  max={60}
                  value={formData.contracted_hours}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contracted_hours: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min={0}
                  step={0.5}
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hourly_rate: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            {staff && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "on-leave") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
  )
}
