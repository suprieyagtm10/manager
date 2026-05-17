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

export function AvailabilityTable({ availabilities, onView, onDelete }: AvailabilityTableProps) {
  if (availabilities.length === 0) {
    return (
      <div className="responsive-table-card flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="rounded-full bg-muted p-3"><Calendar className="h-6 w-6 text-muted-foreground" /></div>
        <p className="mt-4 text-muted-foreground">No availability submissions yet</p>
      </div>
    );
  }

  const shiftLabel = (availability: Availability) =>
    SHIFT_CONFIG[availability.shift_type as keyof typeof SHIFT_CONFIG]?.label ?? availability.shift_type ?? "Unknown";

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {availabilities.map((availability) => (
          <div key={availability.id} className="mobile-data-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Staff ID</p>
                <p className="truncate font-semibold">{availability.staff_id}</p>
              </div>
              <Badge variant="outline" className={availability.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                {availability.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-muted-foreground">Day</p><p className="font-medium">{DAYS_OF_WEEK[availability.day_of_week]}</p></div>
              <div><p className="text-muted-foreground">Shift</p><p className="font-medium">{shiftLabel(availability)}</p></div>
              <div className="col-span-2"><p className="text-muted-foreground">Effective from</p><p className="font-medium">{availability.effective_from}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="min-h-11 rounded-xl" onClick={() => onView(availability)}><Eye className="mr-2 h-4 w-4" />View</Button>
              <Button variant="outline" className="min-h-11 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(availability.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="responsive-table-card safe-scroll-x hidden md:block">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Staff ID</TableHead><TableHead>Day</TableHead><TableHead>Shift</TableHead><TableHead>Status</TableHead><TableHead>Effective From</TableHead><TableHead className="w-[100px]">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {availabilities.map((availability) => (
              <TableRow key={availability.id} className="hover:bg-emerald-50/60">
                <TableCell>{availability.staff_id}</TableCell>
                <TableCell>{DAYS_OF_WEEK[availability.day_of_week]}</TableCell>
                <TableCell>{shiftLabel(availability)}</TableCell>
                <TableCell><Badge variant="outline">{availability.is_available ? "Available" : "Unavailable"}</Badge></TableCell>
                <TableCell>{availability.effective_from}</TableCell>
                <TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => onView(availability)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(availability.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
