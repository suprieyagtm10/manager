"use client"

import { format, parseISO } from "date-fns"
import { AlertCircle, User, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StaffMember, ShiftWithAssignment, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types"

interface AssignStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shift: ShiftWithAssignment | null
  staff: StaffMember[]
  onAssign: (staffId: string, staffName: string) => void
}

export function AssignStaffDialog({
  open,
  onOpenChange,
  shift,
  staff,
  onAssign,
}: AssignStaffDialogProps) {
  if (!shift) return null

  const shiftConfig = SHIFT_CONFIG[shift.shift_type]
  const roleConfig = ROLE_CONFIG[shift.required_role as keyof typeof ROLE_CONFIG]

  // Filter staff by role compatibility
  const matchingRoleStaff = staff.filter((s) => {
    // Allow staff of same role or higher qualified
    if (s.role === shift.required_role) return true
    // RN can cover EN and PCA shifts
    if (s.role === "RN" && (shift.required_role === "EN" || shift.required_role === "PCA")) return true
    // EN can cover PCA shifts
    if (s.role === "EN" && shift.required_role === "PCA") return true
    return false
  })

  const otherStaff = staff.filter((s) => !matchingRoleStaff.includes(s))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Staff to Shift</DialogTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{format(parseISO(shift.date), "EEE, d MMM")}</span>
            <span>-</span>
            <span>{shiftConfig?.label || shift.shift_type}</span>
            <span>
              ({shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)})
            </span>
            <Badge className={`${roleConfig?.bgColor} ${roleConfig?.textColor}`}>
              {roleConfig?.label || shift.required_role}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {matchingRoleStaff.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Qualified Staff ({matchingRoleStaff.length})
                </h3>
                {matchingRoleStaff.map((staffMember) => {
                  const staffRoleConfig = ROLE_CONFIG[staffMember.role]
                  const isExactMatch = staffMember.role === shift.required_role

                  return (
                    <div
                      key={staffMember.id}
                      className={`rounded-lg border p-3 ${
                        isExactMatch ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={isExactMatch ? "text-green-600" : "text-blue-600"}>
                            {isExactMatch ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {staffMember.first_name} {staffMember.last_name}
                              </p>
                              <Badge
                                variant="outline"
                                className={`text-xs ${staffRoleConfig?.bgColor} ${staffRoleConfig?.textColor}`}
                              >
                                {staffRoleConfig?.label || staffMember.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {staffMember.employment_type} • {staffMember.contracted_hours || 0}h/week
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() =>
                            onAssign(
                              staffMember.id,
                              `${staffMember.first_name} ${staffMember.last_name}`
                            )
                          }
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {matchingRoleStaff.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-orange-500" />
                <p className="mt-2 font-medium">No qualified staff available</p>
                <p className="text-sm text-muted-foreground">
                  No active staff members with the required qualifications.
                </p>
              </div>
            )}

            {otherStaff.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Other Staff ({otherStaff.length})
                </h3>
                {otherStaff.slice(0, 5).map((staffMember) => {
                  const staffRoleConfig = ROLE_CONFIG[staffMember.role]

                  return (
                    <div
                      key={staffMember.id}
                      className="rounded-lg border bg-gray-50 p-3 opacity-60"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-500">
                            {staffMember.first_name} {staffMember.last_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {staffRoleConfig?.label || staffMember.role} - Not qualified for this role
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Not Qualified
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
