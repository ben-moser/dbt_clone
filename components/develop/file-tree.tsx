"use client"

import { useState } from "react"
import {
  Folder,
  FolderOpen,
  FileText,
  FileCode2,
  FileType,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  MoreHorizontal,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TreeNode {
  name: string
  type: "folder" | "file"
  children?: TreeNode[]
}

const treeData: TreeNode[] = [
  {
    name: "models",
    type: "folder",
    children: [
      {
        name: "staging",
        type: "folder",
        children: [
          { name: "stg_orders.sql", type: "file" },
          { name: "stg_customers.sql", type: "file" },
          { name: "stg_payments.sql", type: "file" },
          { name: "stg_products.sql", type: "file" },
        ],
      },
      {
        name: "intermediate",
        type: "folder",
        children: [
          { name: "int_order_payments.sql", type: "file" },
          { name: "int_customer_orders.sql", type: "file" },
        ],
      },
      {
        name: "marts",
        type: "folder",
        children: [
          {
            name: "finance",
            type: "folder",
            children: [
              { name: "fct_orders.sql", type: "file" },
              { name: "fct_revenue.sql", type: "file" },
            ],
          },
          {
            name: "core",
            type: "folder",
            children: [
              { name: "dim_customers.sql", type: "file" },
              { name: "dim_products.sql", type: "file" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "tests",
    type: "folder",
    children: [{ name: "assert_positive_revenue.sql", type: "file" }],
  },
  {
    name: "macros",
    type: "folder",
    children: [{ name: "cents_to_dollars.sql", type: "file" }],
  },
  { name: "dbt_project.yml", type: "file" },
  { name: "packages.yml", type: "file" },
]

function getFileIcon(filename: string) {
  if (filename.endsWith(".sql")) {
    return <FileCode2 className="h-4 w-4 shrink-0 text-blue-400" />
  }
  if (filename.endsWith(".yml") || filename.endsWith(".yaml")) {
    return <FileType className="h-4 w-4 shrink-0 text-purple-400" />
  }
  return <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
}

interface FileTreeProps {
  onSelectFile: (filename: string) => void
  selectedFile?: string
}

function TreeItem({
  node,
  depth,
  onSelectFile,
  selectedFile,
}: {
  node: TreeNode
  depth: number
  onSelectFile: (filename: string) => void
  selectedFile?: string
}) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (node.type === "folder") {
    return (
      <div>
        <button
          className={cn(
            "flex w-full items-center gap-1.5 py-[3px] text-[13px] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e]",
            "text-left transition-colors"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          {expanded ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-amber-500" />
          )}
          <span className="truncate font-medium text-foreground/90">{node.name}</span>
        </button>
        {expanded && (
          <div>
            {node.children?.map((child) => (
              <TreeItem
                key={child.name}
                node={child}
                depth={depth + 1}
                onSelectFile={onSelectFile}
                selectedFile={selectedFile}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const isSelected = selectedFile === node.name

  return (
    <button
      className={cn(
        "flex w-full items-center gap-1.5 py-[3px] text-[13px] transition-colors",
        "text-left",
        isSelected
          ? "bg-[#d6ebff] dark:bg-[#094771] text-foreground"
          : "hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] text-foreground/80"
      )}
      style={{ paddingLeft: `${depth * 16 + 8 + 18}px` }}
      onClick={() => onSelectFile(node.name)}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  )
}

export function FileTree({ onSelectFile, selectedFile }: FileTreeProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-center border-b px-1 py-2">
          <button
            onClick={() => setCollapsed(false)}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Expand file explorer"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-9 items-center justify-between border-b bg-muted/30 px-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          File explorer
        </span>
        <div className="flex items-center gap-0.5">
          <button
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="More actions"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Collapse file explorer"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Project root */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-1.5 px-2 py-2">
          <Package className="h-4 w-4 shrink-0 text-green-500" />
          <span className="text-[13px] font-semibold text-foreground">jaffle-shop</span>
        </div>

        {/* Tree items */}
        <div className="pb-2">
          {treeData.map((node) => (
            <TreeItem
              key={node.name}
              node={node}
              depth={0}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
