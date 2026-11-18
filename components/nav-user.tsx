"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ChevronsUpDown,
  BadgeCheck,
  LogOut,
} from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const displayName = mounted
    ? (user.name && user.name !== "Poster Gen Admin" ? user.name : "Alexander Drake")
    : "Alexander Drake"
  const displayEmail = mounted ? (user.email || "admin1@gmail.com") : "admin1@gmail.com"

  // User logo initial according to the 1st letter of the email
  const emailInitial = (displayEmail?.trim()?.[0] || "A").toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/80 transition-colors"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-full border border-border/80">
              {user.avatar ? <AvatarImage src={user.avatar} alt={displayName} className="rounded-full" /> : null}
              <AvatarFallback
                suppressHydrationWarning
                className="rounded-full bg-secondary text-foreground font-medium text-xs"
              >
                {emailInitial}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span
                suppressHydrationWarning
                className="truncate font-medium text-foreground text-xs"
              >
                {displayName}
              </span>
              <span
                suppressHydrationWarning
                className="truncate text-[11px] text-muted-foreground/80 font-normal"
              >
                {displayEmail}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-md border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl shadow-black/40"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full border border-border/80">
                    {user.avatar ? <AvatarImage src={user.avatar} alt={displayName} className="rounded-full" /> : null}
                    <AvatarFallback
                      suppressHydrationWarning
                      className="rounded-full bg-secondary text-foreground font-medium text-xs"
                    >
                      {emailInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span
                      suppressHydrationWarning
                      className="truncate font-medium text-foreground text-xs"
                    >
                      {displayName}
                    </span>
                    <span
                      suppressHydrationWarning
                      className="truncate text-[11px] text-muted-foreground/80 font-normal"
                    >
                      {displayEmail}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent/80 transition-colors" render={<Link href="/dashboard/settings" />}>
                <BadgeCheck className="size-4 text-primary" />
                <span className="text-sm">Account</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuItem
              className="cursor-pointer text-primary hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => logout()}
            >
              <LogOut className="size-4" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
