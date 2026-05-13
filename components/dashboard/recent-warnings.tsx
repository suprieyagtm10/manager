"use client";

import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStaff, mockShifts } from "@/lib/mock-data";
import { validateRoster } from "@/lib/staff-matcher";

export function RecentWarnings() {
  const warnings = validateRoster(mockShifts, mockStaff).slice(0, 5);

  if (warnings.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Roster Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <Info className="h-5 w-5 text-green-600" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              No issues detected
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Roster Warnings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {warnings.map((warning, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 rounded-lg p-3 ${
              warning.severity === "error"
                ? "bg-red-50"
                : "bg-yellow-50"
            }`}
          >
            {warning.severity === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
            )}
            <p className={`text-sm ${
              warning.severity === "error" ? "text-red-700" : "text-yellow-700"
            }`}>
              {warning.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
