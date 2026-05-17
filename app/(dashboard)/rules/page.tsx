import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const rules = [
  {
    name: "No Double Booking",
    description: "Staff cannot be assigned to more than one shift at the same time.",
    status: "Active",
  },
  {
    name: "Night to Morning Gap",
    description: "Avoid assigning staff to a morning shift straight after a night shift.",
    status: "Active",
  },
  {
    name: "Weekly Hour Limit",
    description: "Staff should not exceed their contracted weekly hours.",
    status: "Active",
  },
  {
    name: "Role Matching",
    description: "Staff should only be assigned to suitable roles.",
    status: "Active",
  },
  {
    name: "Leave Check",
    description: "Staff on approved leave should not be assigned to shifts.",
    status: "Active",
  },
]

export default function RulesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        title="Roster Rules"
        subtitle="View rostering rules and compliance checks"
      />

      <div className="flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {rules.map((rule) => (
            <Card key={rule.name}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                  <Badge variant="secondary">{rule.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {rule.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}