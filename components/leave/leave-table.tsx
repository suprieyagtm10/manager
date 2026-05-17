"use client"

import { format, differenceInDays, parseISO } from "date-fns"
import { MoreHorizontal, Check, X, Calendar } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LeaveRequestWithStaff, LeaveStatus, ROLE_CONFIG, LEAVE_STATUS_CONFIG } from "@/lib/types"

interface LeaveTableProps {
  leaves: LeaveRequestWithStaff[]
  onEdit: (leave: LeaveRequestWithStaff) => void
  onStatusChange: (leaveId: string, status: LeaveStatus) => void
  onDelete: (leaveId: string) => void
}

const leaveTypeLabels: Record<string, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  personal: "Personal Leave",
  unpaid: "Unpaid Leave",
  emergency: "Emergency",
}

export function LeaveTable({ leaves, onEdit, onStatusChange, onDelete }: LeaveTableProps) {
  if (leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
        <div className="rounded-full bg-muted p-3">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-muted-foreground">No leave requests found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Leave requests will appear here when staff members request time off
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead className="hidden lg:table-cell">Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => {
            const staff = leave.staff_members
            const roleConfig = ROLE_CONFIG[staff?.role || "PCA"]
            const statusConfig = LEAVE_STATUS_CONFIG[leave.status]
            const startDate = parseISO(leave.start_date)
            const endDate = parseISO(leave.end_date)
            const duration = differenceInDays(endDate, startDate) + 1

            return (
              <TableRow key={leave.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {staff?.first_name} {staff?.last_name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`${roleConfig?.bgColor} ${roleConfig?.textColor} text-xs`}
                    >
                      {roleConfig?.label || staff?.role}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {leaveTypeLabels[leave.leave_type] || leave.leave_type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{format(startDate, "d MMM yyyy")}</p>
                    <p className="text-muted-foreground">to {format(endDate, "d MMM yyyy")}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {duration} {duration === 1 ? "day" : "days"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {leave.reason || "-"}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${statusConfig.bgColor} ${statusConfig.textColor}`}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {leave.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => onStatusChange(leave.id, "approved")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onStatusChange(leave.id, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(leave)}>Edit Leave</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {leave.status !== "approved" && (
                          <DropdownMenuItem onClick={() => onStatusChange(leave.id, "approved")}>
                            Approve
                          </DropdownMenuItem>
                        )}
                        {leave.status !== "rejected" && (
                          <DropdownMenuItem onClick={() => onStatusChange(leave.id, "rejected")}>
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(leave.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
