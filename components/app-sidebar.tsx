"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutGrid,
  ShoppingBag,
  Users,
  AlignVerticalSpaceAround,
  Printer,
  WandSparkles,
  UserCog,
  Store,
  ChartNoAxesCombined,
} from "lucide-react"

import { NavMain, type NavGroup } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/context/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Menu groups with the exact icons from your design
const navGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "COMMERCE",
    items: [
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingBag,
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Templates",
        url: "/dashboard/templates",
        icon: AlignVerticalSpaceAround,
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        title: "Production",
        url: "/dashboard/production",
        icon: Printer,
      },
      {
        title: "AI Generations",
        url: "/dashboard/ai-generations",
        icon: WandSparkles,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        title: "Staff & Roles",
        url: "/dashboard/staff",
        icon: UserCog,
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: ChartNoAxesCombined,
      },
      {
        title: "Store Settings",
        url: "/dashboard/store-settings",
        icon: Store,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const activeUser = {
    name: user?.name && user.name !== "Poster Gen Admin" ? user.name : "Alexander Drake",
    email: user?.email || "admin1@gmail.com",
    avatar: user?.avatar || "",
  }

  return (
    <Sidebar variant="inset" {...props} className="border-r border-sidebar-border/80">
      <SidebarHeader className="border-b border-sidebar-border/60 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />} className="hover:bg-sidebar-accent/60">
              <div className="relative flex aspect-square size-9 items-center justify-center rounded-md bg-gradient-to-br from-zinc-900 to-black border border-primary/40 text-white shadow-sm shadow-red-950/40">
                <span className="text-lg font-semibold tracking-tight">
                  P<span className="text-primary">G</span>
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-base font-semibold tracking-wide text-foreground">
                  POSTER <span className="text-primary font-semibold">GEN</span>
                </span>
                <span className="truncate text-[10px] tracking-[0.03em] font-medium text-muted-foreground/80 uppercase">
                  Automotive Atelier
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain groups={navGroups} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 pt-2">
        <NavUser user={activeUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
