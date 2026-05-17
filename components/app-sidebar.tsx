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
  CalendarClock,
  AlertCircle,
  Menu,
  Utensils,
  HeartPulse,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Staff", href: "/staff", icon: Users },
  { name: "Roster", href: "/roster", icon: Calendar },
  { name: "Kitchen", href: "/staff?role=FSA", icon: Utensils },
  { name: "Nurses", href: "/staff?role=RN", icon: HeartPulse },
  { name: "PCAs", href: "/staff?role=PCA", icon: UserRound },
  { name: "Leave", href: "/leave", icon: ClipboardList },
  { name: "Availability", href: "/availability", icon: Clock },
  // { name: "Working Hours", href: "/hours", icon: CalendarClock },
  // { name: "Reports", href: "/reports", icon: FileText },
];

const bottomNavigation = [
  { name: "Shift Rules", href: "/rules", icon: AlertCircle },
  // { name: "Settings", href: "/settings", icon: Settings },
];

function Brand() {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-emerald-100 px-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 shadow-md shadow-emerald-600/20">
        <Calendar className="h-5 w-5 text-white" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-base font-bold text-foreground">
          Roster Manager
        </span>
        <span className="text-xs font-medium text-emerald-700">
          Aged Care Workforce
        </span>
      </div>
    </div>
  );
}

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const renderLink = (item: (typeof navigation)[number]) => {
    const baseHref = item.href.split("?")[0];
    const isActive =
      pathname === baseHref || pathname.startsWith(baseHref + "/");
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={onNavigate}
        className="block"
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "min-h-12 w-full justify-start gap-3 rounded-2xl px-4 text-base transition-all active:scale-[0.98] md:min-h-11 md:text-sm",
            "hover:translate-x-1 hover:bg-emerald-50 hover:text-emerald-800",
            isActive &&
              "bg-emerald-100 text-emerald-950 shadow-sm font-semibold ring-1 ring-emerald-200",
          )}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          <span className="truncate">{item.name}</span>
        </Button>
      </Link>
    );
  };

  return (
    <ScrollArea className="flex-1 px-3 py-4">
      <nav className="flex flex-col gap-1.5">{navigation.map(renderLink)}</nav>
      <Separator className="my-4" />
      <nav className="flex flex-col gap-1.5">
        {bottomNavigation.map(renderLink)}
      </nav>
    </ScrollArea>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-emerald-100/80 bg-card/95 shadow-sm backdrop-blur md:sticky md:top-0 md:flex">
      <Brand />
      <SidebarLinks />
    </aside>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="mr-2 h-11 w-11 rounded-2xl md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[88vw] max-w-[340px] gap-0 border-emerald-100 bg-white p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <Brand />
        <SidebarLinks />
      </SheetContent>
    </Sheet>
  );
}
