"use client";

import { format, differenceInDays } from "date-fns";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUpcomingLeave } from "@/lib/mock-data";
import { ROLE_CONFIG, LEAVE_STATUS_CONFIG } from "@/lib/types";

export function UpcomingLeave() {
  const upcomingLeave = getUpcomingLeave().slice(0, 4);
  const today = new Date();

  if (upcomingLeave.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Upcoming Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-muted p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              No upcoming leave scheduled
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Upcoming Leave</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingLeave.map((leave) => {
          const roleConfig = ROLE_CONFIG[leave.role];
          const statusConfig = LEAVE_STATUS_CONFIG[leave.status];
          const daysUntil = differenceInDays(leave.startDate, today);
          const leaveDuration = differenceInDays(leave.endDate, leave.startDate) + 1;

          return (
            <div
              key={leave.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${roleConfig.bgColor}`}
              >
                <User className={`h-4 w-4 ${roleConfig.textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{leave.staffName}</p>
                <p className="text-xs text-muted-foreground">
                  {format(leave.startDate, "d MMM")} - {format(leave.endDate, "d MMM")}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge
                    variant="secondary"
                    className={`${statusConfig.bgColor} ${statusConfig.textColor} text-xs`}
                  >
                    {statusConfig.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {leaveDuration} {leaveDuration === 1 ? "day" : "days"}
                  </Badge>
                </div>
              </div>
              {daysUntil <= 0 ? (
                <Badge variant="destructive" className="text-xs shrink-0">
                  Active
                </Badge>
              ) : daysUntil <= 3 ? (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs shrink-0">
                  In {daysUntil}d
                </Badge>
              ) : null}
            </div>
          );
        })}
        
        <Link href="/leave">
          <Button variant="ghost" size="sm" className="w-full mt-1">
            View All Leave
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
