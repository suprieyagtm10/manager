"use client";

import { MoreHorizontal, Pencil, Power, Phone, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Staff, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types";

interface StaffTableProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onToggleStatus: (staffId: string) => void;
}

export function StaffTable({ staff, onEdit, onToggleStatus }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
        <p className="text-muted-foreground">No staff members found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or add a new staff member
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden lg:table-cell">Employment</TableHead>
            <TableHead className="hidden lg:table-cell">Preferred Shifts</TableHead>
            <TableHead className="hidden md:table-cell">Max Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => {
            const roleConfig = ROLE_CONFIG[member.role];
            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="font-medium">{member.name}</div>
                  {member.notes && (
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {member.notes}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${roleConfig.bgColor} ${roleConfig.textColor}`}
                  >
                    {roleConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">{member.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell capitalize">
                  {member.employmentType}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {member.preferredShifts.slice(0, 2).map((shift) => (
                      <Badge key={shift} variant="outline" className="text-xs">
                        {SHIFT_CONFIG[shift].label}
                      </Badge>
                    ))}
                    {member.preferredShifts.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.preferredShifts.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {member.maxWeeklyHours}h/week
                </TableCell>
                <TableCell>
                  <Badge
                    variant={member.isActive ? "default" : "secondary"}
                    className={
                      member.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(member)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(member.id)}>
                        <Power className="mr-2 h-4 w-4" />
                        {member.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
