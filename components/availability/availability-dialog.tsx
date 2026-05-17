"use client"

import { format, parseISO } from "date-fns"
import { Calendar, Clock, User, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Availability, ROLE_CONFIG, SHIFT_CONFIG, DAYS_OF_WEEK } from "@/lib/types"

interface AvailabilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availability: Availability | null
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not set"
  const date = value instanceof Date ? value : parseISO(value)
  return format(date, "d MMMM yyyy")
}

export function AvailabilityDialog({ open, onOpenChange, availability }: AvailabilityDialogProps) {
  if (!availability) return null

  const roleConfig = availability.role ? ROLE_CONFIG[availability.role] : null
  const shiftConfig = SHIFT_CONFIG[availability.shift_type]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Availability Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${roleConfig?.bgColor ?? "bg-muted"}`}>
              <User className={`h-5 w-5 ${roleConfig?.textColor ?? "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-semibold">{availability.staffName ?? `Staff ID: ${availability.staff_id}`}</p>
              {roleConfig ? (
                <Badge variant="secondary" className={`${roleConfig.bgColor} ${roleConfig.textColor}`}>
                  {roleConfig.label}
                </Badge>
              ) : (
                <Badge variant="secondary">Availability record</Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Effective Period</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(availability.startDate ?? availability.effective_from)} - {formatDate(availability.endDate ?? availability.effective_until)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Availability</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline">{DAYS_OF_WEEK[availability.day_of_week]}</Badge>
                  <Badge variant="outline">{shiftConfig.label}</Badge>
                  <Badge variant={availability.is_available ? "secondary" : "destructive"}>
                    {availability.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
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
                  <p className="text-sm text-muted-foreground">{availability.notes}</p>
                </div>
              </div>
            </>
          )}

          <Separator />
          <p className="text-xs text-muted-foreground">
            Submitted on {formatDate(availability.submittedAt ?? availability.created_at)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
