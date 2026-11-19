"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"

export interface NavSubItem {
  title: string
  url: string
}

export interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }> | React.ReactNode
  isActive?: boolean
  badge?: string | number
  items?: NavSubItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

interface NavMainProps {
  groups: NavGroup[]
}

function renderIcon(icon: NavItem["icon"], isActive: boolean) {
  if (!icon) return null
  if (React.isValidElement(icon)) {
    return icon
  }
  const IconComp = icon as React.ComponentType<{ className?: string }>
  return (
    <IconComp
      className={`size-4 transition-colors duration-150 ${
        isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"
      }`}
    />
  )
}

export function NavMain({ groups }: NavMainProps) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title} className="py-2">
          <SidebarGroupLabel className="text-[10px] font-medium tracking-[0.03em] text-muted-foreground/60 uppercase px-3">
            {group.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const hasChildren = Boolean(item.items && item.items.length > 0)
                const isCurrentActive =
                  pathname === item.url ||
                  (item.url !== "/dashboard" && pathname.startsWith(item.url))

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={isCurrentActive}
                      render={<SidebarMenuItem />}
                    >
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isCurrentActive}
                        className={`transition-all duration-150 rounded-md ${
                          isCurrentActive
                            ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                        }`}
                        render={<Link href={item.url} onClick={handleLinkClick} />}
                      >
                        {renderIcon(item.icon, isCurrentActive)}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuAction className="aria-expanded:rotate-90 text-muted-foreground hover:text-foreground">
                            <ChevronRight className="size-4" />
                            <span className="sr-only">Toggle {item.title}</span>
                          </SidebarMenuAction>
                        }
                      />
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-sidebar-border/60">
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton render={<Link href={subItem.url} onClick={handleLinkClick} />}>
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isCurrentActive}
                      className={`relative transition-all duration-150 rounded-md px-3 ${
                        isCurrentActive
                          ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-primary"
                          : "text-muted-foreground/90 hover:text-foreground hover:bg-sidebar-accent/60"
                      }`}
                      render={<Link href={item.url} onClick={handleLinkClick} />}
                    >
                      {renderIcon(item.icon, isCurrentActive)}
                      <span className="truncate">{item.title}</span>
                      {item.badge ? (
                        <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary border border-primary/25">
                          {item.badge}
                        </span>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
