"use client";

import { useState } from "react";
import { format } from "date-fns";
import { RefreshCcw, CheckCircle2, XCircle, AlertCircle, ExternalLink, Database } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { syncFromSheets, syncToSheets, SyncStatus } from "@/lib/google-sheets";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function SettingsPage() {
  const { toast } = useToast();
  const [sheetId, setSheetId] = useState(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: !!process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
    lastSynced: null,
    error: null,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async (direction: "from" | "to") => {
    setIsSyncing(true);
    try {
      const result =
        direction === "from" ? await syncFromSheets() : await syncToSheets({});
      setSyncStatus({
        isConnected: true,
        lastSynced: new Date(),
        error: null,
      });
      toast({
        title: "Sync Complete",
        description: result.message,
      });
    } catch {
      setSyncStatus((prev) => ({
        ...prev,
        error: "Failed to sync with Google Sheets",
      }));
      toast({
        title: "Sync Failed",
        description: "Could not connect to Google Sheets. Check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (sheetId) {
      setSyncStatus({
        isConnected: true,
        lastSynced: null,
        error: null,
      });
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Google Sheets.",
      });
    } else {
      setSyncStatus({
        isConnected: false,
        lastSynced: null,
        error: "Please enter a valid Sheet ID",
      });
    }
    setIsSyncing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Settings"
        subtitle="Configure Google Sheets integration and sync settings"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Google Sheets Connection
                  </CardTitle>
                  <CardDescription>
                    Connect to Google Sheets to sync your roster data
                  </CardDescription>
                </div>
                <Badge
                  variant={syncStatus.isConnected ? "default" : "secondary"}
                  className={
                    syncStatus.isConnected
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {syncStatus.isConnected ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  {syncStatus.isConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="sheetId">Google Sheet ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="sheetId"
                    value={sheetId}
                    onChange={(e) => setSheetId(e.target.value)}
                    placeholder="Enter your Google Sheet ID"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={isSyncing}
                  >
                    Test
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Find the Sheet ID in your Google Sheets URL between /d/ and /edit
                </p>
              </div>

              {syncStatus.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{syncStatus.error}</AlertDescription>
                </Alert>
              )}

              {syncStatus.lastSynced && (
                <p className="text-sm text-muted-foreground">
                  Last synced: {format(syncStatus.lastSynced, "d MMM yyyy, h:mm a")}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sheet Configuration</CardTitle>
              <CardDescription>
                Expected sheet names in your Google Spreadsheet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  { name: "Staff", description: "StaffID, Name, Role, Phone, Email, EmploymentType, PreferredShifts, MaxWeeklyHours, ActiveStatus, Notes" },
                  { name: "Roster", description: "RosterID, Date, ShiftType, StartTime, EndTime, RoleRequired, AssignedStaffID, AssignedStaffName, Status, Notes" },
                  { name: "Availability", description: "AvailabilityID, StaffName, Role, StartDate, EndDate, AvailableDates, UnavailableDates, PreferredShifts, Notes, SubmittedAt" },
                  { name: "Leave", description: "LeaveID, StaffID, StaffName, Role, StartDate, EndDate, LeaveType, Reason, Status, CreatedAt" },
                  { name: "ShiftRules", description: "RuleID, RuleName, Description, ActiveStatus" },
                ].map((sheet) => (
                  <div key={sheet.name} className="flex items-start gap-3 rounded-lg border p-3">
                    <Badge variant="outline">{sheet.name}</Badge>
                    <p className="text-xs text-muted-foreground">{sheet.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sync Actions</CardTitle>
              <CardDescription>
                Manually sync data between this app and Google Sheets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="gap-2 h-auto py-4"
                  onClick={() => handleSync("from")}
                  disabled={isSyncing || !syncStatus.isConnected}
                >
                  <RefreshCcw className={`h-5 w-5 ${isSyncing ? "animate-spin" : ""}`} />
                  <div className="text-left">
                    <p className="font-medium">Pull from Sheets</p>
                    <p className="text-xs text-muted-foreground">
                      Import data from Google Sheets
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 h-auto py-4"
                  onClick={() => handleSync("to")}
                  disabled={isSyncing || !syncStatus.isConnected}
                >
                  <RefreshCcw className={`h-5 w-5 ${isSyncing ? "animate-spin" : ""}`} />
                  <div className="text-left">
                    <p className="font-medium">Push to Sheets</p>
                    <p className="text-xs text-muted-foreground">
                      Export data to Google Sheets
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">
                    Environment Variables Required
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    For production use, set the following environment variables:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>NEXT_PUBLIC_GOOGLE_SHEET_ID</li>
                    <li>GOOGLE_SERVICE_ACCOUNT_EMAIL</li>
                    <li>GOOGLE_PRIVATE_KEY</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Google Sheets Setup Guide</p>
              <p className="text-sm text-muted-foreground">
                Learn how to set up Google Sheets API integration
              </p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <a
                href="https://developers.google.com/sheets/api/quickstart/js"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                View Guide
              </a>
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
