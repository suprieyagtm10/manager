"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, AlertTriangle, Clock } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalStaff: number
    activeStaff: number
    todayShiftsCount: number
    todayFilledShifts: number
    unfilledShifts: number
    pendingLeave: number
    unresolvedWarnings: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Active Staff",
      value: stats.activeStaff,
      subtitle: `${stats.totalStaff} total`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Today's Shifts",
      value: `${stats.todayFilledShifts}/${stats.todayShiftsCount}`,
      subtitle: "Filled",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Unfilled Shifts",
      value: stats.unfilledShifts,
      subtitle: "This week",
      icon: Clock,
      color: stats.unfilledShifts > 0 ? "text-red-600" : "text-gray-600",
      bgColor: stats.unfilledShifts > 0 ? "bg-red-100" : "bg-gray-100",
    },
    {
      title: "Active Warnings",
      value: stats.unresolvedWarnings,
      subtitle: "Need attention",
      icon: AlertTriangle,
      color: stats.unresolvedWarnings > 0 ? "text-yellow-600" : "text-gray-600",
      bgColor: stats.unresolvedWarnings > 0 ? "bg-yellow-100" : "bg-gray-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
