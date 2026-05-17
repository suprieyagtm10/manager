"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { CalendarClock, Plus, Save, Trash2, UserRound } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StaffMember, WorkingHoursEntryWithStaff, ROLE_CONFIG } from "@/lib/types"
import { toast } from "sonner"

interface WorkingHoursClientProps {
  staff: StaffMember[]
  initialEntries: WorkingHoursEntryWithStaff[]
}

type FormState = {
  staff_id: string
  work_date: string
  start_time: string
  end_time: string
  break_minutes: number
  notes: string
}

function calculateHours(start: string, end: string, breakMinutes: number) {
  const [startHour, startMinute] = start.split(":").map(Number)
  const [endHour, endMinute] = end.split(":").map(Number)
  const startTotal = startHour * 60 + startMinute
  let endTotal = endHour * 60 + endMinute
  if (endTotal <= startTotal) endTotal += 24 * 60
  return Math.max(0, (endTotal - startTotal - breakMinutes) / 60)
}

export function WorkingHoursClient({ staff, initialEntries }: WorkingHoursClientProps) {
  const supabase = createClient()
  const [entries, setEntries] = useState(initialEntries)
  const [form, setForm] = useState<FormState>({
    staff_id: staff[0]?.id || "",
    work_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "07:00",
    end_time: "15:00",
    break_minutes: 30,
    notes: "",
  })

  const previewHours = calculateHours(form.start_time, form.end_time, Number(form.break_minutes) || 0)

  const totalsByStaff = useMemo(() => {
    return staff.map((member) => {
      const total = entries
        .filter((entry) => entry.staff_id === member.id)
        .reduce((sum, entry) => sum + Number(entry.total_hours || 0), 0)
      return { member, total }
    })
  }, [entries, staff])

  const handleSave = async () => {
    if (!form.staff_id) {
      toast.error("Please select a staff member")
      return
    }

    const payload = {
      ...form,
      break_minutes: Number(form.break_minutes) || 0,
      total_hours: previewHours,
      notes: form.notes || null,
    }

    const { data, error } = await supabase
      .from("working_hours")
      .insert(payload)
      .select("*, staff_members (*)")
      .single()

    if (error) {
      toast.error("Could not save working hours. Check the SQL schema has been run.")
      return
    }

    setEntries((prev) => [data, ...prev])
    setForm((prev) => ({ ...prev, notes: "" }))
    toast.success("Working hours recorded")
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("working_hours").delete().eq("id", id)
    if (error) {
      toast.error("Could not delete this entry")
      return
    }
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    toast.success("Entry removed")
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
      <div className="grid gap-4 md:grid-cols-3">
        {totalsByStaff.slice(0, 6).map(({ member, total }) => {
          const role = ROLE_CONFIG[member.role]
          return (
            <Card key={member.id} className="interactive-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{member.first_name} {member.last_name}</p>
                    <Badge variant="secondary" className={`${role.bgColor} ${role.textColor} mt-2`}>{role.label}</Badge>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <UserRound className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-2xl font-bold">{total.toFixed(1)}h</p>
                <p className="text-sm text-muted-foreground">Recorded in current list</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5" /> Record working hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Staff member</Label>
              <Select value={form.staff_id} onValueChange={(value) => setForm((prev) => ({ ...prev, staff_id: value }))}>
                <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                <SelectContent>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>{member.first_name} {member.last_name} · {member.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.work_date} onChange={(e) => setForm((prev) => ({ ...prev, work_date: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start</Label>
                <Input type="time" value={form.start_time} onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>End</Label>
                <Input type="time" value={form.end_time} onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Break minutes</Label>
              <Input type="number" min={0} value={form.break_minutes} onChange={(e) => setForm((prev) => ({ ...prev, break_minutes: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input placeholder="Optional note" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800">
              <p className="text-sm">Calculated payable hours</p>
              <p className="text-3xl font-bold">{previewHours.toFixed(1)}h</p>
            </div>
            <Button onClick={handleSave} className="w-full gap-2 rounded-xl transition-transform hover:-translate-y-0.5">
              <Save className="h-4 w-4" /> Save hours
            </Button>
          </CardContent>
        </Card>

        <Card className="interactive-card overflow-hidden">
          <CardHeader>
            <CardTitle>Recent hour records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Break</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No hours recorded yet.</TableCell></TableRow>
                  ) : entries.map((entry) => {
                    const member = entry.staff_members || staff.find((s) => s.id === entry.staff_id)
                    return (
                      <TableRow key={entry.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{member ? `${member.first_name} ${member.last_name}` : "Unknown"}</TableCell>
                        <TableCell>{entry.work_date}</TableCell>
                        <TableCell>{entry.start_time} - {entry.end_time}</TableCell>
                        <TableCell>{entry.break_minutes}m</TableCell>
                        <TableCell><Badge>{Number(entry.total_hours).toFixed(1)}h</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)} className="hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" className="mt-4 gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Export-ready records can be added next
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
