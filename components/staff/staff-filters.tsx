"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StaffRole } from "@/lib/types"

interface StaffFiltersProps {
  roleFilter: StaffRole | "all"
  setRoleFilter: (value: StaffRole | "all") => void
  statusFilter: "all" | "active" | "inactive" | "on-leave"
  setStatusFilter: (value: "all" | "active" | "inactive" | "on-leave") => void
  searchQuery: string
  setSearchQuery: (value: string) => void
}

export function StaffFilters({
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}: StaffFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 pl-9"
        />
      </div>

      <Select
        value={roleFilter}
        onValueChange={(value) => setRoleFilter(value as StaffRole | "all")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="RN">Registered Nurse</SelectItem>
          <SelectItem value="EN">Enrolled Nurse</SelectItem>
          <SelectItem value="PCA">Personal Care Assistant</SelectItem>
          <SelectItem value="FSA">Food Services Assistant</SelectItem>
          <SelectItem value="CHEF">Chef</SelectItem>
          <SelectItem value="ADMIN">Administrator</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={statusFilter}
        onValueChange={(value) =>
          setStatusFilter(value as "all" | "active" | "inactive" | "on-leave")
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="on-leave">On Leave</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
