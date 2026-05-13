"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Settings,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Staff",
    href: "/staff",
    icon: Users,
  },
  {
    name: "Roster",
    href: "/roster",
    icon: Calendar,
  },
  {
    name: "Leave",
    href: "/leave",
    icon: ClipboardList,
  },
  {
    name: "Availability",
    href: "/availability",
    icon: Clock,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
];

const bottomNavigation = [
  {
    name: "Shift Rules",
    href: "/rules",
    icon: AlertCircle,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Roster Manager</span>
          <span className="text-xs text-muted-foreground">Aged Care</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <nav className="flex flex-col gap-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <Button variant="outline" className="w-full gap-2" size="sm">
          <RefreshCcw className="h-4 w-4" />
          Sync with Sheets
        </Button>
      </div>
    </div>
  );
}
