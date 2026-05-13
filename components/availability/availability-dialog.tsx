"use client";

import { format } from "date-fns";
import { Calendar, Clock, User, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Availability, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types";

interface AvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: Availability | null;
}

export function AvailabilityDialog({
  open,
  onOpenChange,
  availability,
}: AvailabilityDialogProps) {
  if (!availability) return null;

  const roleConfig = ROLE_CONFIG[availability.role];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Availability Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${roleConfig.bgColor}`}>
              <User className={`h-5 w-5 ${roleConfig.textColor}`} />
            </div>
            <div>
              <p className="font-semibold">{availability.staffName}</p>
              <Badge
                variant="secondary"
                className={`${roleConfig.bgColor} ${roleConfig.textColor}`}
              >
                {roleConfig.label}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Period</p>
                <p className="text-sm text-muted-foreground">
                  {format(availability.startDate, "d MMMM yyyy")} -{" "}
                  {format(availability.endDate, "d MMMM yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Preferred Shifts</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {availability.preferredShifts.map((shift) => (
                    <Badge key={shift} variant="outline">
                      {SHIFT_CONFIG[shift].label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-green-700 mb-2">
                Available Dates ({availability.availableDates.length})
              </p>
              <div className="max-h-32 overflow-auto space-y-1">
                {availability.availableDates.map((date, i) => (
                  <div
                    key={i}
                    className="text-sm bg-green-50 text-green-700 rounded px-2 py-1"
                  >
                    {format(date, "EEE, d MMM")}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-red-700 mb-2">
                Unavailable Dates ({availability.unavailableDates.length})
              </p>
              <div className="max-h-32 overflow-auto space-y-1">
                {availability.unavailableDates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None specified</p>
                ) : (
                  availability.unavailableDates.map((date, i) => (
                    <div
                      key={i}
                      className="text-sm bg-red-50 text-red-700 rounded px-2 py-1"
                    >
                      {format(date, "EEE, d MMM")}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {availability.notes && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {availability.notes}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          <p className="text-xs text-muted-foreground">
            Submitted on {format(availability.submittedAt, "d MMMM yyyy 'at' h:mm a")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
