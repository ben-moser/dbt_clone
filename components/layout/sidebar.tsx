"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Code,
  PenTool,
  BarChart3,
  Clock,
  ChevronRight,
  ChevronDown,
  Terminal,
  MessageSquare,
  HelpCircle,
  Building,
  LayoutGrid,
} from "lucide-react"
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item"
import { cn } from "@/lib/utils"

const mainNavItems = [
  { href: "/", icon: Home, label: "Account home" },
  { href: "/catalog", icon: BookOpen, label: "Catalog" },
]

const projectNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/studio", icon: Code, label: "Studio" },
  { href: "/canvas", icon: PenTool, label: "Canvas" },
  { href: "/insights", icon: BarChart3, label: "Insights" },
]

const orchestrationItems = [
  { href: "/orchestration/runs", icon: Clock, label: "Runs" },
  { href: "/orchestration/jobs", icon: Clock, label: "Jobs" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [orchestrationOpen, setOrchestrationOpen] = useState(true)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const isOrchestrationActive = pathname.startsWith("/orchestration")

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo area */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          {/* dbt logo - orange X shape */}
          <div className="flex h-7 w-7 items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 4L12 12L6 20" stroke="#FF694A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 4L12 12L18 20" stroke="#FF694A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-base font-bold text-sidebar-foreground">dbt</span>
        </div>
        <button className="rounded p-1 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground transition-colors">
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {/* Account home + Catalog */}
        <div className="space-y-0.5">
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href)}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="my-3 border-t border-sidebar-border" />

        {/* Project section */}
        <div className="mb-2 px-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-sidebar-muted">
            Project
          </p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm font-medium text-sidebar-foreground">Jaffle Shop</span>
            <ChevronRight className="h-3 w-3 text-sidebar-muted" />
          </div>
        </div>

        {/* Project nav items */}
        <div className="space-y-0.5">
          {projectNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href)}
            />
          ))}
        </div>

        {/* Orchestration expandable section */}
        <div className="mt-0.5">
          <button
            onClick={() => setOrchestrationOpen(!orchestrationOpen)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "text-sidebar-foreground/80 hover:bg-sidebar-hover",
              isOrchestrationActive && "text-sidebar-foreground"
            )}
          >
            <Clock className={cn("h-4 w-4 shrink-0", isOrchestrationActive ? "text-sidebar-foreground" : "text-sidebar-muted")} />
            <span className="flex-1 text-left">Orchestration</span>
            {orchestrationOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-sidebar-muted" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-sidebar-muted" />
            )}
          </button>
          {orchestrationOpen && (
            <div className="ml-4 space-y-0.5">
              {orchestrationItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="space-y-0.5">
          {/* Set up CLI */}
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-hover transition-colors">
            <Terminal className="h-4 w-4 shrink-0 text-sidebar-muted" />
            <span>Set up CLI</span>
          </button>

          {/* Leave feedback */}
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-hover transition-colors">
            <MessageSquare className="h-4 w-4 shrink-0 text-sidebar-muted" />
            <span>Leave feedback</span>
          </button>

          {/* Ask support assistant */}
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-hover transition-colors">
            <HelpCircle className="h-4 w-4 shrink-0 text-sidebar-muted" />
            <span>Ask support assistant</span>
          </button>

          {/* Get resources */}
          <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-hover transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 shrink-0 text-sidebar-muted" />
              <span>Get resources</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-sidebar-muted" />
          </button>

          {/* dbt Labs */}
          <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-hover transition-colors">
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 shrink-0 text-sidebar-muted" />
              <span>dbt Labs</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-sidebar-muted" />
          </button>
        </div>

        {/* Separator before user */}
        <div className="my-2 border-t border-sidebar-border" />

        {/* User area */}
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-sidebar-hover transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF694A] text-xs font-bold text-white">
            BM
          </div>
          <span className="flex-1 text-left text-sm font-medium text-sidebar-foreground">Ben Moser</span>
          <ChevronRight className="h-3.5 w-3.5 text-sidebar-muted" />
        </button>
      </div>
    </aside>
  )
}
