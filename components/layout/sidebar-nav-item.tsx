"use client"

import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  active: boolean
}

export function SidebarNavItem({ href, icon: Icon, label, active }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-sidebar-foreground/80 hover:bg-sidebar-hover",
        active && "bg-sidebar-accent text-sidebar-foreground border-l-[2.5px] border-sidebar-active-border"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-sidebar-foreground" : "text-sidebar-muted")} />
      <span>{label}</span>
    </Link>
  )
}
