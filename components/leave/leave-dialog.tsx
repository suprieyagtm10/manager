"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon, AlertTriangle } from "lucide-react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LeaveRequestWithStaff, LeaveType, StaffMember, ROLE_CONFIG } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LeaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leave: LeaveRequestWithStaff | null
  staff: StaffMember[]
  isEmergency: boolean
  onSave: (leave: Partial<LeaveRequestWithStaff>) => void
}

const leaveTypes: { value: LeaveType; label: string }[] = [
  { value: "annual", label: "Annual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
  { value: "emergency", label: "Emergency" },
]

export function LeaveDialog({
  open,
  onOpenChange,
  leave,
  staff,
  isEmergency,
  onSave,
}: LeaveDialogProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<string>("")
  const [leaveType, setLeaveType] = useState<LeaveType>("annual")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (leave) {
      setSelectedStaffId(leave.staff_id)
      setLeaveType(leave.leave_type as LeaveType)
      setStartDate(parseISO(leave.start_date))
      setEndDate(parseISO(leave.end_date))
      setReason(leave.reason || "")
    } else {
      setSelectedStaffId("")
      setLeaveType(isEmergency ? "emergency" : "annual")
      setStartDate(isEmergency ? new Date() : undefined)
      setEndDate(undefined)
      setReason("")
    }
  }, [leave, open, isEmergency])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaffId || !startDate || !endDate) return

    onSave({
      staff_id: selectedStaffId,
      leave_type: leaveType,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      reason,
      status: leave?.status || (isEmergency ? "approved" : "pending"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEmergency && <AlertTriangle className="h-5 w-5 text-red-500" />}
            {leave ? "Edit Leave" : isEmergency ? "Emergency Leave" : "Add Leave Request"}
          </DialogTitle>
        </DialogHeader>

        {isEmergency && !leave && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Emergency leave will be immediately approved and affected shifts will be marked as
              unfilled.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((member) => {
                    const roleConfig = ROLE_CONFIG[member.role]
                    return (
                      <SelectItem key={member.id} value={member.id}>
                        <span className="flex items-center gap-2">
                          {member.first_name} {member.last_name}
                          <span className={`text-xs ${roleConfig?.textColor}`}>
                            ({roleConfig?.label || member.role})
                          </span>
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select
                value={leaveType}
                onValueChange={(value: LeaveType) => setLeaveType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "d MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "d MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => (startDate ? date < startDate : false)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason / Notes</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for leave..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedStaffId || !startDate || !endDate}
              className={isEmergency ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {leave ? "Save Changes" : isEmergency ? "Submit Emergency Leave" : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
