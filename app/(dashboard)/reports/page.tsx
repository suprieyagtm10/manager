"use client";

import { useState } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { Download, Users, Clock, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStaff, mockShifts, mockLeave, getUnfilledShifts, getUpcomingLeave } from "@/lib/mock-data";
import { ROLE_CONFIG, SHIFT_CONFIG, Shift } from "@/lib/types";

function getShiftHours(shiftType: string): number {
  switch (shiftType) {
    case "morning": return 8;
    case "kitchen-afternoon": return 4;
    case "evening": return 8;
    case "night": return 8;
    default: return 8;
  }
}

function calculateWeeklyHours(staffId: string, shifts: Shift[]): number {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  return shifts
    .filter(
      (s) =>
        s.assignedStaffId === staffId &&
        s.date >= weekStart &&
        s.date <= weekEnd
    )
    .reduce((total, s) => total + getShiftHours(s.shiftType), 0);
}

export default function ReportsPage() {
  const today = new Date();
  const unfilledShifts = getUnfilledShifts();
  const upcomingLeave = getUpcomingLeave();
  const activeStaff = mockStaff.filter((s) => s.isActive);

  const staffHours = activeStaff.map((staff) => ({
    ...staff,
    weeklyHours: calculateWeeklyHours(staff.id, mockShifts),
    shiftsThisWeek: mockShifts.filter(
      (s) =>
        s.assignedStaffId === staff.id &&
        s.date >= startOfWeek(today, { weekStartsOn: 1 }) &&
        s.date <= endOfWeek(today, { weekStartsOn: 1 })
    ).length,
  }));

  const roleCoverage = Object.entries(ROLE_CONFIG).map(([role, config]) => {
    const roleStaff = activeStaff.filter((s) => s.role === role);
    const roleShifts = mockShifts.filter((s) => s.roleRequired === role);
    const filledShifts = roleShifts.filter((s) => s.assignedStaffId);
    
    return {
      role,
      label: config.label,
      bgColor: config.bgColor,
      textColor: config.textColor,
      staffCount: roleStaff.length,
      totalShifts: roleShifts.length,
      filledShifts: filledShifts.length,
      coveragePercent: roleShifts.length > 0
        ? Math.round((filledShifts.length / roleShifts.length) * 100)
        : 100,
    };
  });

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Reports"
        subtitle="View roster summaries and staff statistics"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeStaff.length}</p>
                    <p className="text-sm text-muted-foreground">Active Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{unfilledShifts.length}</p>
                    <p className="text-sm text-muted-foreground">Unfilled Shifts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-red-100 p-3">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingLeave.length}</p>
                    <p className="text-sm text-muted-foreground">On Leave</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        roleCoverage.reduce((acc, r) => acc + r.coveragePercent, 0) /
                          roleCoverage.length
                      )}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Coverage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="hours" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="hours">Weekly Hours</TabsTrigger>
                <TabsTrigger value="coverage">Role Coverage</TabsTrigger>
                <TabsTrigger value="unfilled">Unfilled Shifts</TabsTrigger>
                <TabsTrigger value="leave">Staff on Leave</TabsTrigger>
              </TabsList>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <TabsContent value="hours">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Staff Hours</CardTitle>
                  <CardDescription>
                    Hours worked this week ({format(startOfWeek(today, { weekStartsOn: 1 }), "d MMM")} - {format(endOfWeek(today, { weekStartsOn: 1 }), "d MMM")})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Shifts This Week</TableHead>
                        <TableHead>Hours Worked</TableHead>
                        <TableHead>Max Hours</TableHead>
                        <TableHead>Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffHours
                        .sort((a, b) => b.weeklyHours - a.weeklyHours)
                        .map((staff) => {
                          const roleConfig = ROLE_CONFIG[staff.role];
                          const utilization = Math.round(
                            (staff.weeklyHours / staff.maxWeeklyHours) * 100
                          );
                          return (
                            <TableRow key={staff.id}>
                              <TableCell className="font-medium">
                                {staff.name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={`${roleConfig.bgColor} ${roleConfig.textColor}`}
                                >
                                  {roleConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell>{staff.shiftsThisWeek}</TableCell>
                              <TableCell>{staff.weeklyHours}h</TableCell>
                              <TableCell>{staff.maxWeeklyHours}h</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-24 rounded-full bg-gray-100">
                                    <div
                                      className={`h-2 rounded-full ${
                                        utilization > 100
                                          ? "bg-red-500"
                                          : utilization > 80
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${Math.min(utilization, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">{utilization}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coverage">
              <Card>
                <CardHeader>
                  <CardTitle>Role Coverage Summary</CardTitle>
                  <CardDescription>
                    Shift coverage by staff role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {roleCoverage.map((role) => (
                      <Card key={role.role}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Badge
                              variant="secondary"
                              className={`${role.bgColor} ${role.textColor}`}
                            >
                              {role.label}
                            </Badge>
                            <span className="text-2xl font-bold">
                              {role.coveragePercent}%
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full rounded-full bg-gray-100">
                              <div
                                className={`h-2 rounded-full ${
                                  role.coveragePercent < 80
                                    ? "bg-red-500"
                                    : role.coveragePercent < 95
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${role.coveragePercent}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{role.filledShifts} filled</span>
                              <span>{role.totalShifts} total</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {role.staffCount} staff members
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unfilled">
              <Card>
                <CardHeader>
                  <CardTitle>Unfilled Shifts</CardTitle>
                  <CardDescription>
                    Shifts that need coverage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {unfilledShifts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium">All shifts are covered</p>
                      <p className="text-sm text-muted-foreground">
                        Great work! No unfilled shifts at the moment.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Shift</TableHead>
                          <TableHead>Role Required</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unfilledShifts.map((shift) => {
                          const roleConfig = ROLE_CONFIG[shift.roleRequired];
                          const shiftConfig = SHIFT_CONFIG[shift.shiftType];
                          return (
                            <TableRow key={shift.id}>
                              <TableCell>
                                {format(shift.date, "EEE, d MMM")}
                              </TableCell>
                              <TableCell>
                                {shiftConfig.label}
                                <span className="text-muted-foreground ml-1">
                                  ({shiftConfig.startTime} - {shiftConfig.endTime})
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={`${roleConfig.bgColor} ${roleConfig.textColor}`}
                                >
                                  {roleConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={shift.status === "urgent" ? "destructive" : "secondary"}
                                >
                                  {shift.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {shift.notes || "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leave">
              <Card>
                <CardHeader>
                  <CardTitle>Staff on Leave</CardTitle>
                  <CardDescription>
                    Current and upcoming leave
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingLeave.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="font-medium">No staff on leave</p>
                      <p className="text-sm text-muted-foreground">
                        All staff members are currently available.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff Member</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Leave Period</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingLeave.map((leave) => {
                          const roleConfig = ROLE_CONFIG[leave.role];
                          return (
                            <TableRow key={leave.id}>
                              <TableCell className="font-medium">
                                {leave.staffName}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={`${roleConfig.bgColor} ${roleConfig.textColor}`}
                                >
                                  {roleConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(leave.startDate, "d MMM")} -{" "}
                                {format(leave.endDate, "d MMM")}
                              </TableCell>
                              <TableCell className="capitalize">
                                {leave.leaveType}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    leave.status === "emergency"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {leave.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
