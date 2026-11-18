"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const routeTitles: Record<string, { section: string; title: string }> = {
  "/dashboard": { section: "Overview", title: "Dashboard" },
  "/dashboard/orders": { section: "Commerce", title: "Orders" },
  "/dashboard/customers": { section: "Commerce", title: "Customers" },
  "/dashboard/templates": { section: "Commerce", title: "Templates" },
  "/dashboard/production": { section: "Operations", title: "Production" },
  "/dashboard/ai-generations": { section: "Operations", title: "AI Generations" },
  "/dashboard/staff": { section: "Management", title: "Staff & Roles" },
  "/dashboard/store-settings": { section: "Management", title: "Store Settings" },
  "/dashboard/reports": { section: "Management", title: "Reports" },
  "/dashboard/settings": { section: "Account", title: "Account Settings" },
}

export function DashboardHeader() {
  const pathname = usePathname()
  let current = routeTitles[pathname]
  if (!current && pathname?.startsWith("/dashboard/orders/")) {
    current = { section: "Commerce", title: "Order Details" }
  } else if (!current && pathname?.startsWith("/dashboard/customers/")) {
    current = { section: "Commerce", title: "Customer Details" }
  } else if (!current && pathname?.startsWith("/dashboard/ai-generations/")) {
    current = { section: "Operations", title: "Job Details" }
  } else if (!current && pathname?.startsWith("/dashboard/staff/")) {
    current = { section: "Management", title: "Staff Member" }
  } else if (!current && pathname?.startsWith("/dashboard/production/")) {
    current = { section: "Operations", title: "Production Order" }
  }
  if (!current) {
    current = { section: "Overview", title: "Dashboard" }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hover:bg-muted text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 bg-border/80" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <span className="text-[11px] uppercase tracking-[0.03em] text-muted-foreground/70 font-medium">
                {current.section}
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block text-muted-foreground/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-foreground">
                {current.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
