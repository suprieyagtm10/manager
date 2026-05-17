"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { AvailabilityTable } from "@/components/availability/availability-table";
import { AvailabilityDialog } from "@/components/availability/availability-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Clock, Users, Calendar } from "lucide-react";
import { Availability } from "@/lib/types";
import { mockAvailability, mockStaff } from "@/lib/mock-data";
import Link from "next/link";

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>(mockAvailability);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null);

  const handleView = (availability: Availability) => {
    setEditingAvailability(availability);
    setIsDialogOpen(true);
  };

  const handleDelete = (availabilityId: string) => {
    setAvailabilities((prev) => prev.filter((a) => a.id !== availabilityId));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        title="Availability Portal"
        subtitle="View and manage staff availability submissions"
      />
      <div className="flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{availabilities.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Submissions received
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {mockStaff.filter((s) => s.isActive).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active staff</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Employee Portal
                    </h3>
                    <p className="text-sm text-blue-700">
                      Share link for staff to submit availability
                    </p>
                  </div>
                  <Link href="/portal">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open Portal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Staff availability submissions for upcoming roster periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityTable
                availabilities={availabilities}
                onView={handleView}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AvailabilityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        availability={editingAvailability}
      />
    </div>
  );
}
