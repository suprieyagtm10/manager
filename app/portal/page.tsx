"use client";

import { useState } from "react";
import { format, addDays, addWeeks, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { Calendar, Check, X, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffRole, ShiftType, ROLE_CONFIG, SHIFT_CONFIG } from "@/lib/types";
import { cn } from "@/lib/utils";

type DateSelection = "available" | "unavailable" | null;

export default function EmployeePortalPage() {
  const [step, setStep] = useState<"info" | "dates" | "success">("info");
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole | "">("");
  const [periodWeeks, setPeriodWeeks] = useState(2);
  const [preferredShifts, setPreferredShifts] = useState<ShiftType[]>([]);
  const [notes, setNotes] = useState("");
  const [dateSelections, setDateSelections] = useState<Record<string, DateSelection>>({});

  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 });
  const endDate = addWeeks(startDate, periodWeeks);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const toggleShift = (shift: ShiftType) => {
    setPreferredShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  };

  const toggleDateSelection = (date: Date, type: DateSelection) => {
    const key = format(date, "yyyy-MM-dd");
    setDateSelections((prev) => ({
      ...prev,
      [key]: prev[key] === type ? null : type,
    }));
  };

  const getDateSelection = (date: Date): DateSelection => {
    const key = format(date, "yyyy-MM-dd");
    return dateSelections[key] || null;
  };

  const availableShifts = role
    ? Object.entries(SHIFT_CONFIG).filter(([_, config]) =>
        config.roles.includes(role)
      )
    : [];

  const availableCount = Object.values(dateSelections).filter((v) => v === "available").length;
  const unavailableCount = Object.values(dateSelections).filter((v) => v === "unavailable").length;

  const handleSubmit = () => {
    // In production, this would submit to the API/Google Sheets
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Availability Submitted</h2>
            <p className="text-muted-foreground mb-6">
              Thank you, {name}! Your availability for the next {periodWeeks} weeks has been submitted successfully.
            </p>
            <Button onClick={() => {
              setStep("info");
              setName("");
              setRole("");
              setDateSelections({});
              setPreferredShifts([]);
              setNotes("");
            }}>
              Submit Another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 mb-4">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Staff Availability Portal</h1>
          <p className="text-muted-foreground mt-1">
            Submit your availability for the upcoming roster period
          </p>
        </div>

        {step === "info" && (
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Your Role</Label>
                <Select value={role} onValueChange={(v: StaffRole) => setRole(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="period">Availability Period</Label>
                <Select
                  value={periodWeeks.toString()}
                  onValueChange={(v) => setPeriodWeeks(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Week</SelectItem>
                    <SelectItem value="2">2 Weeks</SelectItem>
                    <SelectItem value="3">3 Weeks</SelectItem>
                    <SelectItem value="4">4 Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role && (
                <div className="grid gap-2">
                  <Label>Preferred Shifts</Label>
                  <div className="flex flex-wrap gap-3">
                    {availableShifts.map(([key, config]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Checkbox
                          id={`shift-${key}`}
                          checked={preferredShifts.includes(key as ShiftType)}
                          onCheckedChange={() => toggleShift(key as ShiftType)}
                        />
                        <Label
                          htmlFor={`shift-${key}`}
                          className="text-sm font-normal flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {config.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => setStep("dates")}
                disabled={!name || !role}
              >
                Continue to Select Dates
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "dates" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Select Your Availability</CardTitle>
                    <CardDescription>
                      Tap dates to mark them as available or unavailable
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Check className="h-3 w-3 mr-1" />
                      {availableCount} available
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      <X className="h-3 w-3 mr-1" />
                      {unavailableCount} unavailable
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500" />
                    <span>Unavailable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-dashed" />
                    <span>Not selected</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const selection = getDateSelection(day);
                    const isToday = isSameDay(day, today);

                    return (
                      <div key={day.toISOString()} className="aspect-square">
                        <button
                          className={cn(
                            "w-full h-full rounded-lg flex flex-col items-center justify-center text-sm transition-colors",
                            selection === "available" && "bg-green-500 text-white",
                            selection === "unavailable" && "bg-red-500 text-white",
                            !selection && "border-2 border-dashed hover:bg-accent",
                            isToday && !selection && "border-blue-300"
                          )}
                          onClick={() => {
                            if (selection === null) {
                              toggleDateSelection(day, "available");
                            } else if (selection === "available") {
                              toggleDateSelection(day, "unavailable");
                            } else {
                              toggleDateSelection(day, null);
                            }
                          }}
                        >
                          <span className="font-medium">{format(day, "d")}</span>
                          <span className="text-xs opacity-70">
                            {format(day, "MMM")}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information about your availability..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 gap-2"
                disabled={availableCount === 0}
              >
                <Send className="h-4 w-4" />
                Submit Availability
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
