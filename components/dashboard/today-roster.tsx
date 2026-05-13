"use client";

import { format } from "date-fns";
import { Clock, User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getShiftsByDate } from "@/lib/mock-data";
import { ROLE_CONFIG, SHIFT_CONFIG, STATUS_CONFIG } from "@/lib/types";

export function TodayRoster() {
  const today = new Date();
  const todayShifts = getShiftsByDate(today);

  const shiftsByType = {
    morning: todayShifts.filter((s) => s.shiftType === "morning"),
    "kitchen-afternoon": todayShifts.filter((s) => s.shiftType === "kitchen-afternoon"),
    evening: todayShifts.filter((s) => s.shiftType === "evening"),
    night: todayShifts.filter((s) => s.shiftType === "night"),
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Today&apos;s Roster</CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(today, "EEEE, d MMMM")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(shiftsByType).map(([type, shifts]) => {
          if (shifts.length === 0) return null;
          const config = SHIFT_CONFIG[type as keyof typeof SHIFT_CONFIG];

          return (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{config.label}</span>
                <span className="text-sm text-muted-foreground">
                  {config.startTime} - {config.endTime}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {shifts.map((shift) => {
                  const roleConfig = ROLE_CONFIG[shift.roleRequired];
                  const statusConfig = STATUS_CONFIG[shift.status];
                  const isFilled = shift.status === "filled";

                  return (
                    <div
                      key={shift.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        !isFilled ? "border-orange-200 bg-orange-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${roleConfig.bgColor}`}
                        >
                          <User className={`h-4 w-4 ${roleConfig.textColor}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {isFilled ? shift.assignedStaffName : "Unfilled"}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`${roleConfig.bgColor} ${roleConfig.textColor} text-xs`}
                          >
                            {roleConfig.label}
                          </Badge>
                        </div>
                      </div>
                      {!isFilled && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
