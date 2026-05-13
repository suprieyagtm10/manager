"use client";

import { format } from "date-fns";
import { Eye, Trash2, Calendar } from "lucide-react";
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
import { Availability, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types";

interface AvailabilityTableProps {
  availabilities: Availability[];
  onView: (availability: Availability) => void;
  onDelete: (availabilityId: string) => void;
}

export function AvailabilityTable({
  availabilities,
  onView,
  onDelete,
}: AvailabilityTableProps) {
  if (availabilities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-muted-foreground">No availability submissions yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Share the employee portal link for staff to submit their availability
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="hidden md:table-cell">Available Days</TableHead>
            <TableHead className="hidden lg:table-cell">Preferred Shifts</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {availabilities.map((availability) => {
            const roleConfig = ROLE_CONFIG[availability.role];
            return (
              <TableRow key={availability.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{availability.staffName}</p>
                    <Badge
                      variant="secondary"
                      className={`${roleConfig.bgColor} ${roleConfig.textColor} text-xs`}
                    >
                      {roleConfig.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{format(availability.startDate, "d MMM")}</p>
                    <p className="text-muted-foreground">
                      to {format(availability.endDate, "d MMM")}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {availability.availableDates.length} available
                    </Badge>
                    {availability.unavailableDates.length > 0 && (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {availability.unavailableDates.length} unavailable
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {availability.preferredShifts.map((shift) => (
                      <Badge key={shift} variant="outline" className="text-xs">
                        {SHIFT_CONFIG[shift].label}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {format(availability.submittedAt, "d MMM, h:mm a")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(availability)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(availability.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
