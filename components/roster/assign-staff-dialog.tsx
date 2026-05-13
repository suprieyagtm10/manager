"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, AlertCircle, XCircle, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Staff, Shift, ROLE_CONFIG, SHIFT_CONFIG, SuggestionRank } from "@/lib/types";
import { getStaffSuggestions } from "@/lib/staff-matcher";

interface AssignStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  staff: Staff[];
  onAssign: (staffId: string, staffName: string) => void;
}

const rankConfig: Record<SuggestionRank, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  "best-match": {
    label: "Best Match",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
  available: {
    label: "Available",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
  },
  "not-suitable": {
    label: "Not Suitable",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
};

export function AssignStaffDialog({
  open,
  onOpenChange,
  shift,
  staff,
  onAssign,
}: AssignStaffDialogProps) {
  const suggestions = useMemo(() => {
    if (!shift) return [];
    return getStaffSuggestions(staff, shift);
  }, [shift, staff]);

  const suitableSuggestions = suggestions.filter((s) => s.rank !== "not-suitable");
  const unsuitableSuggestions = suggestions.filter((s) => s.rank === "not-suitable");

  if (!shift) return null;

  const shiftConfig = SHIFT_CONFIG[shift.shiftType];
  const roleConfig = ROLE_CONFIG[shift.roleRequired];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Staff to Shift</DialogTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{format(shift.date, "EEE, d MMM")}</span>
            <span>-</span>
            <span>{shiftConfig.label}</span>
            <span>({shiftConfig.startTime} - {shiftConfig.endTime})</span>
            <Badge className={`${roleConfig.bgColor} ${roleConfig.textColor}`}>
              {roleConfig.label}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {suitableSuggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Recommended ({suitableSuggestions.length})
                </h3>
                {suitableSuggestions.map((suggestion) => {
                  const config = rankConfig[suggestion.rank];
                  const Icon = config.icon;

                  return (
                    <div
                      key={suggestion.staff.id}
                      className={`rounded-lg border p-3 ${config.bgColor}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${config.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{suggestion.staff.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {suggestion.weeklyHoursAssigned}h / {suggestion.staff.maxWeeklyHours}h this week
                            </p>
                            {suggestion.warnings.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {suggestion.warnings.map((warning, i) => (
                                  <p key={i} className="text-xs text-yellow-700 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {warning}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onAssign(suggestion.staff.id, suggestion.staff.name)}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {suitableSuggestions.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-orange-500" />
                <p className="mt-2 font-medium">No suitable staff available</p>
                <p className="text-sm text-muted-foreground">
                  All staff members have conflicts or restrictions for this shift.
                </p>
              </div>
            )}

            {unsuitableSuggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Not Available ({unsuitableSuggestions.length})
                </h3>
                {unsuitableSuggestions.slice(0, 5).map((suggestion) => (
                  <div
                    key={suggestion.staff.id}
                    className="rounded-lg border bg-gray-50 p-3 opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-500">
                          {suggestion.staff.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {suggestion.warnings[0]}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Not Suitable
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
