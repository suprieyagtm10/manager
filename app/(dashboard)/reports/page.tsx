export const dynamic = "force-dynamic"

import { AppHeader } from "@/components/app-header"
import { getActiveStaffMembers, getShiftsWithAssignments, getLeaveRequests } from "@/lib/db"
import { ROLE_CONFIG, SHIFT_CONFIG, StaffRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, AlertTriangle, Calendar, TrendingUp } from "lucide-react"
import { format, startOfWeek, endOfWeek, parseISO } from "date-fns"

export default async function ReportsPage() {
  const [staff, shifts, leaves] = await Promise.all([
    getActiveStaffMembers(),
    getShiftsWithAssignments(),
    getLeaveRequests(),
  ])

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

  const unfilledShifts = shifts.filter((shift) => shift.status === "unfilled")
  const upcomingLeave = leaves.filter(
    (leave) =>
      leave.status === "approved" &&
      parseISO(leave.end_date) >= today
  )

  const staffHours = staff.map((member) => {
    const weeklyShifts = shifts.filter((shift) => {
      const shiftDate = parseISO(shift.date)
      const assigned = shift.shift_assignments?.some(
        (assignment) => assignment.staff_id === member.id
      )

      return assigned && shiftDate >= weekStart && shiftDate <= weekEnd
    })

    const weeklyHours = weeklyShifts.reduce((total, shift) => {
      const config = SHIFT_CONFIG[shift.shift_type]
      const startHour = Number(config.startTime.split(":")[0])
      const endHour = Number(config.endTime.split(":")[0])
      const hours = endHour > startHour ? endHour - startHour : 24 - startHour + endHour
      return total + hours
    }, 0)

    return {
      ...member,
      weeklyHours,
      shiftsThisWeek: weeklyShifts.length,
      maxHours: member.contracted_hours || 38,
    }
  })

  const roleCoverage = Object.entries(ROLE_CONFIG).map(([role, config]) => {
    const roleStaff = staff.filter((member) => member.role === role)
    const roleShifts = shifts.filter(
      (shift) => shift.required_role === role || shift.required_role === "ANY"
    )
    const filledShifts = roleShifts.filter(
      (shift) => shift.shift_assignments && shift.shift_assignments.length > 0
    )

    return {
      role,
      label: config.label,
      bgColor: config.bgColor,
      textColor: config.textColor,
      staffCount: roleStaff.length,
      totalShifts: roleShifts.length,
      filledShifts: filledShifts.length,
      coveragePercent:
        roleShifts.length > 0
          ? Math.round((filledShifts.length / roleShifts.length) * 100)
          : 100,
    }
  })

  const averageCoverage =
    roleCoverage.length > 0
      ? Math.round(
          roleCoverage.reduce((total, role) => total + role.coveragePercent, 0) /
            roleCoverage.length
        )
      : 0

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Reports" subtitle="View roster summaries and staff statistics" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{staff.length}</p>
                <p className="text-sm text-muted-foreground">Active Staff</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{unfilledShifts.length}</p>
                <p className="text-sm text-muted-foreground">Unfilled Shifts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Calendar className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingLeave.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming Leave</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{averageCoverage}%</p>
                <p className="text-sm text-muted-foreground">Avg Coverage</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Staff Hours</CardTitle>
            <CardDescription>
              {format(weekStart, "d MMM")} - {format(weekEnd, "d MMM")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Shifts</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Max Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffHours.map((member) => {
                  const roleConfig = ROLE_CONFIG[member.role]

                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${roleConfig.bgColor} ${roleConfig.textColor}`}>
                          {roleConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.shiftsThisWeek}</TableCell>
                      <TableCell>{member.weeklyHours}h</TableCell>
                      <TableCell>{member.maxHours}h</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Coverage</CardTitle>
            <CardDescription>Shift coverage by staff role</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {roleCoverage.map((role) => (
              <Card key={role.role}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge className={`${role.bgColor} ${role.textColor}`}>{role.label}</Badge>
                    <span className="text-2xl font-bold">{role.coveragePercent}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {role.filledShifts} filled / {role.totalShifts} total
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {role.staffCount} active staff
                  </p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unfilled Shifts</CardTitle>
            <CardDescription>Shifts that still need staff</CardDescription>
          </CardHeader>
          <CardContent>
            {unfilledShifts.length === 0 ? (
              <p className="text-sm text-muted-foreground">All shifts are covered.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Role Required</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unfilledShifts.map((shift) => {
                    const shiftConfig = SHIFT_CONFIG[shift.shift_type]
                    const roleConfig =
                      shift.required_role !== "ANY"
                        ? ROLE_CONFIG[shift.required_role as StaffRole]
                        : null

                    return (
                      <TableRow key={shift.id}>
                        <TableCell>{format(parseISO(shift.date), "EEE, d MMM")}</TableCell>
                        <TableCell>
                          {shiftConfig.label} ({shiftConfig.startTime} - {shiftConfig.endTime})
                        </TableCell>
                        <TableCell>
                          {roleConfig ? (
                            <Badge className={`${roleConfig.bgColor} ${roleConfig.textColor}`}>
                              {roleConfig.label}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Any Role</Badge>
                          )}
                        </TableCell>
                        <TableCell>{shift.notes || "-"}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Leave</CardTitle>
            <CardDescription>Approved current and future leave</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingLeave.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming leave.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingLeave.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>
                        {leave.staff?.first_name} {leave.staff?.last_name}
                      </TableCell>
                      <TableCell className="capitalize">{leave.leave_type}</TableCell>
                      <TableCell>
                        {format(parseISO(leave.start_date), "d MMM")} -{" "}
                        {format(parseISO(leave.end_date), "d MMM")}
                      </TableCell>
                      <TableCell>
                        <Badge>{leave.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}