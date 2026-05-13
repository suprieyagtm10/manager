"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffRole } from "@/lib/types";

interface StaffFiltersProps {
  roleFilter: StaffRole | "all";
  setRoleFilter: (value: StaffRole | "all") => void;
  statusFilter: "all" | "active" | "inactive";
  setStatusFilter: (value: "all" | "active" | "inactive") => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
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
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="nurse">Nurses</SelectItem>
          <SelectItem value="pca">PCAs</SelectItem>
          <SelectItem value="kitchen">Kitchen</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={statusFilter}
        onValueChange={(value) =>
          setStatusFilter(value as "all" | "active" | "inactive")
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
