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
import { StaffMemberWithCertifications, ROLE_CONFIG } from "@/lib/types"

interface StaffTableProps {
  staff: StaffMemberWithCertifications[]
  onEdit: (staff: StaffMemberWithCertifications) => void
  onToggleStatus: (staffId: string) => void
}

export function StaffTable({ staff, onEdit, onToggleStatus }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <div className="responsive-table-card flex flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-base font-medium text-muted-foreground">No staff members found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting filters or add a new staff member.</p>
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

  const Actions = ({ member }: { member: StaffMemberWithCertifications }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl active:scale-95">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(member)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onToggleStatus(member.id)}>
          <Power className="mr-2 h-4 w-4" /> {member.status === "active" ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {staff.map((member) => {
          const roleConfig = ROLE_CONFIG[member.role]
          const expiringCerts = member.certifications?.filter((c) => c.status === "expiring" || c.status === "expired") || []
          return (
            <div key={member.id} className="mobile-data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <h3 className="truncate text-lg font-semibold">{member.first_name} {member.last_name}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className={`${roleConfig?.bgColor} ${roleConfig?.textColor}`}>{roleConfig?.label || member.role}</Badge>
                    {getStatusBadge(member.status)}
                  </div>
                </div>
                <Actions member={member} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                {member.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{member.phone}</div>}
                <div className="flex min-w-0 items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><span className="truncate">{member.email}</span></div>
                <div className="flex flex-wrap gap-2 pt-1 text-foreground">
                  <span className="rounded-full bg-muted px-3 py-1 capitalize">{member.employment_type}</span>
                  {member.contracted_hours && <span className="rounded-full bg-muted px-3 py-1">{member.contracted_hours}h/week</span>}
                  {member.hourly_rate && <span className="rounded-full bg-muted px-3 py-1">${member.hourly_rate}/hr</span>}
                </div>
                {expiringCerts.length > 0 && <div className="mt-1 flex items-center gap-2 text-red-600"><AlertCircle className="h-4 w-4" />{expiringCerts.length} certification issue{expiringCerts.length > 1 ? "s" : ""}</div>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="responsive-table-card safe-scroll-x hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Employment</TableHead>
              <TableHead className="hidden lg:table-cell">Hours/Rate</TableHead>
              <TableHead className="hidden xl:table-cell">Certifications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[64px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => {
              const roleConfig = ROLE_CONFIG[member.role]
              const expiringCerts = member.certifications?.filter((c) => c.status === "expiring" || c.status === "expired") || []
              return (
                <TableRow key={member.id} className="transition-colors hover:bg-emerald-50/60">
                  <TableCell className="font-medium">{member.first_name} {member.last_name}</TableCell>
                  <TableCell><Badge variant="secondary" className={`${roleConfig?.bgColor} ${roleConfig?.textColor}`}>{roleConfig?.label || member.role}</Badge></TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {member.phone && <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3 text-muted-foreground" />{member.phone}</div>}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground"><Mail className="h-3 w-3" /><span className="max-w-[150px] truncate">{member.email}</span></div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden capitalize lg:table-cell">{member.employment_type}</TableCell>
                  <TableCell className="hidden lg:table-cell">{member.contracted_hours && <span>{member.contracted_hours}h/week</span>}{member.hourly_rate && <span className="block text-sm text-muted-foreground">${member.hourly_rate}/hr</span>}</TableCell>
                  <TableCell className="hidden xl:table-cell">{expiringCerts.length > 0 ? <div className="flex items-center gap-1 text-red-600"><AlertCircle className="h-4 w-4" />{expiringCerts.length} issue{expiringCerts.length > 1 ? "s" : ""}</div> : <span className="text-sm text-green-600">Valid</span>}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell><Actions member={member} /></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
