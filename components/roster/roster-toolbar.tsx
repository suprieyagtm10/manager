"use client"

import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffRole, ROLE_CONFIG } from "@/lib/types"
import { ViewMode } from "@/components/roster/roster-client"

interface RosterToolbarProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  roleFilter: StaffRole | "all"
  setRoleFilter: (role: StaffRole | "all") => void
  showOnlyIssues: boolean
  setShowOnlyIssues: (show: boolean) => void
}

export function RosterToolbar({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  roleFilter,
  setRoleFilter,
  showOnlyIssues,
  setShowOnlyIssues,
}: RosterToolbarProps) {
  const navigatePrevious = () => {
    switch (viewMode) {
      case "day":
        setSelectedDate(subDays(selectedDate, 1))
        break
      case "week":
        setSelectedDate(subWeeks(selectedDate, 1))
        break
      case "month":
        setSelectedDate(subMonths(selectedDate, 1))
        break
    }
  }

  const navigateNext = () => {
    switch (viewMode) {
      case "day":
        setSelectedDate(addDays(selectedDate, 1))
        break
      case "week":
        setSelectedDate(addWeeks(selectedDate, 1))
        break
      case "month":
        setSelectedDate(addMonths(selectedDate, 1))
        break
    }
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const getDateLabel = () => {
    switch (viewMode) {
      case "day":
        return format(selectedDate, "EEEE, d MMMM yyyy")
      case "week":
        return `Week of ${format(selectedDate, "d MMMM yyyy")}`
      case "month":
        return format(selectedDate, "MMMM yyyy")
    }
  }

  return (
    <div className="border-b border-border bg-card px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>

          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{getDateLabel()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as StaffRole | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch id="issues-filter" checked={showOnlyIssues} onCheckedChange={setShowOnlyIssues} />
            <Label htmlFor="issues-filter" className="flex items-center gap-1 text-sm cursor-pointer">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Issues only
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
