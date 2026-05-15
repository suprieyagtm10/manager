"use client"

import { MoreHorizontal, Pencil, Power, Phone, Mail, AlertCircle } from "lucide-react"
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
import { StaffMemberWithCertifications, ROLE_CONFIG, CERTIFICATION_STATUS_CONFIG } from "@/lib/types"

interface StaffTableProps {
  staff: StaffMemberWithCertifications[]
  onEdit: (staff: StaffMemberWithCertifications) => void
  onToggleStatus: (staffId: string) => void
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
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-700">Active</Badge>
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-500">Inactive</Badge>
      case "on-leave":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">On Leave</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
            <TableHead className="hidden lg:table-cell">Hours/Rate</TableHead>
            <TableHead className="hidden xl:table-cell">Certifications</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => {
            const roleConfig = ROLE_CONFIG[member.role]
            const expiringCerts = member.certifications?.filter(
              (c) => c.status === "expiring" || c.status === "expired"
            ) || []

            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="font-medium">
                    {member.first_name} {member.last_name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${roleConfig?.bgColor} ${roleConfig?.textColor}`}
                  >
                    {roleConfig?.label || member.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="space-y-1">
                    {member.phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {member.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">{member.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell capitalize">
                  {member.employment_type}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {member.contracted_hours && (
                    <span>{member.contracted_hours}h/week</span>
                  )}
                  {member.hourly_rate && (
                    <span className="text-muted-foreground text-sm block">
                      ${member.hourly_rate}/hr
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {expiringCerts.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">
                        {expiringCerts.length} issue{expiringCerts.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-green-600">Valid</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(member.status)}</TableCell>
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
                        {member.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
