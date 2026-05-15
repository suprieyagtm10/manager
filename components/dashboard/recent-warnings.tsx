"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { WarningWithRelations, WARNING_SEVERITY_CONFIG } from "@/lib/types"

interface RecentWarningsProps {
  warnings: WarningWithRelations[]
}

export function RecentWarnings({ warnings }: RecentWarningsProps) {
  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5" />
          Active Warnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {warnings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active warnings.</p>
        ) : (
          <div className="space-y-3">
            {warnings.map((warning) => {
              const severityConfig = WARNING_SEVERITY_CONFIG[warning.severity]
              const staff = warning.staff_members

              return (
                <div key={warning.id} className="p-3 rounded-lg border">
                  <div className="flex items-start gap-2">
                    {getIcon(warning.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${severityConfig.bgColor} ${severityConfig.textColor}`}
                        >
                          {severityConfig.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(warning.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{warning.message}</p>
                      {staff && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {staff.first_name} {staff.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
