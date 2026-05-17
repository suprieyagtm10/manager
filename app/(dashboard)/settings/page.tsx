import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Database, ShieldCheck, Users, CalendarDays, Info } from "lucide-react"

const requiredTables = [
  { name: "facilities", description: "Facility details used by staff and shifts." },
  { name: "staff_members", description: "Nurses, PCAs/AINs, admins, employment type, hours and status." },
  { name: "shifts", description: "Roster shifts, required role, dates, times and fill status." },
  { name: "shift_assignments", description: "Which staff member is assigned to each shift." },
  { name: "leave_requests", description: "Annual, sick, personal, unpaid and emergency leave records." },
  { name: "availability", description: "Staff availability by day and shift type." },
  { name: "certifications", description: "Staff certificates and expiry tracking." },
  { name: "warnings", description: "Roster compliance, understaffing and overtime warnings." },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Settings"
        subtitle="Database, authentication and application setup"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Supabase Database
                  </CardTitle>
                  <CardDescription>
                    The app stores roster, staff, leave and availability data in Supabase.
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Session protected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Run <strong>supabase/schema.sql</strong> in your Supabase SQL Editor, then add your Supabase URL and anon key to <strong>.env.local</strong>.
                </AlertDescription>
              </Alert>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Users className="h-4 w-4" />
                    Staff management
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add, edit and deactivate staff members directly from the app.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <CalendarDays className="h-4 w-4" />
                    Roster operations
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create shifts, assign staff, remove assignments and manage leave.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                These tables are required for the application to work correctly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {requiredTables.map((table) => (
                  <div key={table.name} className="flex items-start gap-3 rounded-lg border p-3">
                    <Badge variant="outline">{table.name}</Badge>
                    <p className="text-xs text-muted-foreground">{table.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Create a <code>.env.local</code> file in the project root.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
              </pre>
            </CardContent>
          </Card>

          <Separator />

          <p className="text-sm text-muted-foreground">
            Supabase is the single source of truth for app data and authentication sessions.
          </p>
        </div>
      </div>
    </div>
  )
}
