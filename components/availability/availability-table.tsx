"use client";

import { Calendar, Eye, Trash2 } from "lucide-react";
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
import { Availability, SHIFT_CONFIG, DAYS_OF_WEEK } from "@/lib/types";

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
        <p className="mt-4 text-muted-foreground">
          No availability submissions yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff ID</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Effective From</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {availabilities.map((availability) => (
            <TableRow key={availability.id}>
              <TableCell>{availability.staff_id}</TableCell>
              <TableCell>{DAYS_OF_WEEK[availability.day_of_week]}</TableCell>
              <TableCell>
                {SHIFT_CONFIG[
                  availability.shift_type as keyof typeof SHIFT_CONFIG
                ]?.label ??
                  availability.shift_type ??
                  "Unknown"}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {availability.is_available ? "Available" : "Unavailable"}
                </Badge>
              </TableCell>
              <TableCell>{availability.effective_from}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
