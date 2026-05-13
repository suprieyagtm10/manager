"use client";

import Link from "next/link";
import {
  UserPlus,
  CalendarPlus,
  RefreshCcw,
  Send,
  Search,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    label: "Add Staff",
    icon: UserPlus,
    href: "/staff?action=add",
    color: "text-blue-600",
  },
  {
    label: "Create Shift",
    icon: CalendarPlus,
    href: "/roster?action=add",
    color: "text-green-600",
  },
  {
    label: "Find Replacement",
    icon: Search,
    href: "/roster?action=replace",
    color: "text-orange-600",
  },
  {
    label: "Mark Leave",
    icon: AlertCircle,
    href: "/leave?action=add",
    color: "text-red-600",
  },
  {
    label: "Sync Sheets",
    icon: RefreshCcw,
    href: "/settings",
    color: "text-purple-600",
  },
  {
    label: "Publish Roster",
    icon: Send,
    href: "/roster?action=publish",
    color: "text-teal-600",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto flex-col gap-2 py-4"
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
