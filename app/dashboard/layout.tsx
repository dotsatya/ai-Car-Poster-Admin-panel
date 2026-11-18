import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <React.Suspense fallback={<div className="w-64 bg-sidebar" />}>
          <AppSidebar />
        </React.Suspense>
        <SidebarInset>
          <React.Suspense fallback={<header className="h-16 border-b border-border/80 bg-background/95 px-6" />}>
            <DashboardHeader />
          </React.Suspense>
          <main className="flex flex-1 flex-col gap-6 p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
