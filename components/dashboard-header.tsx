"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface RouteMeta {
  title: string
  parent?: {
    title: string
    href: string
  }
}

const routeTitles: Record<string, RouteMeta> = {
  "/dashboard": { title: "Dashboard" },
  "/dashboard/orders": { title: "Orders" },
  "/dashboard/customers": { title: "Customers" },
  "/dashboard/templates": { title: "Templates" },
  "/dashboard/production": { title: "Production" },
  "/dashboard/ai-generations": { title: "AI Generations" },
  "/dashboard/staff": { title: "Staff & Roles" },
  "/dashboard/store-settings": { title: "Store Settings" },
  "/dashboard/reports": { title: "Reports" },
  "/dashboard/settings": { title: "Account Settings" },
}

export function DashboardHeader() {
  const pathname = usePathname()
  let current: RouteMeta | undefined = routeTitles[pathname]

  if (!current && pathname?.startsWith("/dashboard/templates/")) {
    current = {
      title: "Template Details",
      parent: { title: "Templates", href: "/dashboard/templates" },
    }
  } else if (!current && pathname?.startsWith("/dashboard/orders/")) {
    current = {
      title: "Order Details",
      parent: { title: "Orders", href: "/dashboard/orders" },
    }
  } else if (!current && pathname?.startsWith("/dashboard/customers/")) {
    current = {
      title: "Customer Details",
      parent: { title: "Customers", href: "/dashboard/customers" },
    }
  } else if (!current && pathname?.startsWith("/dashboard/ai-generations/")) {
    current = {
      title: "Job Details",
      parent: { title: "AI Generations", href: "/dashboard/ai-generations" },
    }
  } else if (!current && pathname?.startsWith("/dashboard/staff/")) {
    current = {
      title: "Staff Member",
      parent: { title: "Staff & Roles", href: "/dashboard/staff" },
    }
  } else if (!current && pathname?.startsWith("/dashboard/production/")) {
    current = {
      title: "Production Order",
      parent: { title: "Production", href: "/dashboard/production" },
    }
  }

  if (!current) {
    current = { title: "Dashboard" }
  }

  return (
    <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between border-b border-border/80 bg-background/95 backdrop-blur px-3.5 sm:px-6">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-1 hover:bg-muted text-muted-foreground hover:text-foreground shrink-0" />
        <Separator orientation="vertical" className="mr-1 sm:mr-2 data-vertical:h-4 bg-border/80 shrink-0" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            {current.parent && (
              <>
                <BreadcrumbItem className="min-w-0">
                  <Link
                    href={current.parent.href}
                    className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors truncate max-w-[100px] sm:max-w-none block"
                  >
                    {current.parent.title}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground/40 shrink-0" />
              </>
            )}

            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-none block">
                {current.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
