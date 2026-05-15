"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LeaveStatus, StaffRole, ROLE_CONFIG } from "@/lib/types"

interface LeaveFiltersProps {
  statusFilter: LeaveStatus | "all"
  setStatusFilter: (value: LeaveStatus | "all") => void
  roleFilter: StaffRole | "all"
  setRoleFilter: (value: StaffRole | "all") => void
}

export function LeaveFilters({
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
}: LeaveFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as LeaveStatus | "all")}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={roleFilter}
        onValueChange={(value) => setRoleFilter(value as StaffRole | "all")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {Object.entries(ROLE_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
