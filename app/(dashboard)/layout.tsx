import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-transparent">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="min-h-full animate-in fade-in-0 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
