"use client";

import { format, isSameDay, isBefore } from "date-fns";
import { AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUnfilledShifts } from "@/lib/mock-data";
import { ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types";

export function UnfilledShifts() {
  const today = new Date();
  const unfilledShifts = getUnfilledShifts()
    .filter((s) => !isBefore(s.date, today))
    .slice(0, 5);

  if (unfilledShifts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Unfilled Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <p className="mt-4 font-medium">All shifts are filled</p>
            <p className="text-sm text-muted-foreground">
              Great job! No coverage needed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Unfilled Shifts</CardTitle>
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {unfilledShifts.length} unfilled
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {unfilledShifts.map((shift) => {
          const roleConfig = ROLE_CONFIG[shift.roleRequired];
          const shiftConfig = SHIFT_CONFIG[shift.shiftType];
          const isToday = isSameDay(shift.date, today);

          return (
            <div
              key={shift.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                shift.status === "urgent"
                  ? "border-red-200 bg-red-50"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {isToday ? "Today" : format(shift.date, "EEE")}
                  </p>
                  <p className="text-lg font-semibold">
                    {format(shift.date, "d")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {shiftConfig.label} - {roleConfig.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {shiftConfig.startTime} - {shiftConfig.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {shift.status === "urgent" && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
                <Link href={`/roster?date=${format(shift.date, "yyyy-MM-dd")}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
        
        {unfilledShifts.length > 0 && (
          <Link href="/roster">
            <Button variant="outline" className="w-full mt-2">
              View All Shifts
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
