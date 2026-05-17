import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-transparent">
      <AppSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="min-h-full animate-in fade-in-0 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
