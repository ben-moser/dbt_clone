"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  FileCode2,
  FileType,
  X,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react"

interface EditorPanelProps {
  filename: string
  content: string
}

// File path mapping for breadcrumbs
const filePathMap: Record<string, string[]> = {
  "stg_orders.sql": ["models", "staging", "stg_orders.sql"],
  "stg_customers.sql": ["models", "staging", "stg_customers.sql"],
  "stg_payments.sql": ["models", "staging", "stg_payments.sql"],
  "stg_products.sql": ["models", "staging", "stg_products.sql"],
  "int_order_payments.sql": ["models", "intermediate", "int_order_payments.sql"],
  "int_customer_orders.sql": ["models", "intermediate", "int_customer_orders.sql"],
  "fct_orders.sql": ["models", "marts", "finance", "fct_orders.sql"],
  "fct_revenue.sql": ["models", "marts", "finance", "fct_revenue.sql"],
  "dim_customers.sql": ["models", "marts", "core", "dim_customers.sql"],
  "dim_products.sql": ["models", "marts", "core", "dim_products.sql"],
  "assert_positive_revenue.sql": ["tests", "assert_positive_revenue.sql"],
  "cents_to_dollars.sql": ["macros", "cents_to_dollars.sql"],
  "dbt_project.yml": ["dbt_project.yml"],
  "packages.yml": ["packages.yml"],
}

function getFileIcon(filename: string, className: string = "h-3.5 w-3.5") {
  if (filename.endsWith(".sql")) {
    return <FileCode2 className={cn(className, "text-blue-400")} />
  }
  if (filename.endsWith(".yml") || filename.endsWith(".yaml")) {
    return <FileType className={cn(className, "text-purple-400")} />
  }
  return <FileCode2 className={cn(className, "text-muted-foreground")} />
}

// SQL syntax highlighting with Jinja support
function highlightLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = []
  let keyIndex = 0

  const stringRegex = /'[^']*'/g
  const commentRegex = /--.*$/g
  const jinjaBlockRegex = /\{%[\s\S]*?%\}/g
  const jinjaExprRegex = /\{\{[\s\S]*?\}\}/g

  // Tokenize the line into segments with types
  type Segment = { text: string; type: "comment" | "jinja" | "string" | "keyword" | "number" | "text" }
  const segments: Segment[] = []

  // First pass: find all special ranges
  type Range = { start: number; end: number; type: Segment["type"] }
  const ranges: Range[] = []

  // Comments
  let match: RegExpExecArray | null
  commentRegex.lastIndex = 0
  while ((match = commentRegex.exec(line)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length, type: "comment" })
  }

  // Strings
  stringRegex.lastIndex = 0
  while ((match = stringRegex.exec(line)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length, type: "string" })
  }

  // Jinja blocks {% %}
  jinjaBlockRegex.lastIndex = 0
  while ((match = jinjaBlockRegex.exec(line)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length, type: "jinja" })
  }

  // Jinja expressions {{ }}
  jinjaExprRegex.lastIndex = 0
  while ((match = jinjaExprRegex.exec(line)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length, type: "jinja" })
  }

  // Sort by start position and remove overlaps
  ranges.sort((a, b) => a.start - b.start)
  const filteredRanges: Range[] = []
  let lastEnd = 0
  for (const r of ranges) {
    if (r.start >= lastEnd) {
      filteredRanges.push(r)
      lastEnd = r.end
    }
  }

  // Build segments
  let pos = 0
  for (const range of filteredRanges) {
    if (pos < range.start) {
      // Text between ranges - check for keywords and numbers
      const text = line.slice(pos, range.start)
      tokenizeText(text, segments)
    }
    segments.push({ text: line.slice(range.start, range.end), type: range.type })
    pos = range.end
  }
  if (pos < line.length) {
    tokenizeText(line.slice(pos), segments)
  }

  // Convert segments to React nodes
  for (const seg of segments) {
    const key = `t-${keyIndex++}`
    switch (seg.type) {
      case "comment":
        tokens.push(
          <span key={key} style={{ color: "#6A9955" }}>
            {seg.text}
          </span>
        )
        break
      case "jinja":
        tokens.push(
          <span key={key} style={{ color: "#CE9178" }}>
            {seg.text}
          </span>
        )
        break
      case "string":
        tokens.push(
          <span key={key} style={{ color: "#CE9178" }}>
            {seg.text}
          </span>
        )
        break
      case "keyword":
        tokens.push(
          <span key={key} style={{ color: "#569CD6" }}>
            {seg.text}
          </span>
        )
        break
      case "number":
        tokens.push(
          <span key={key} style={{ color: "#B5CEA8" }}>
            {seg.text}
          </span>
        )
        break
      default:
        tokens.push(
          <span key={key} style={{ color: "#D4D4D4" }}>
            {seg.text}
          </span>
        )
    }
  }

  return tokens.length > 0 ? tokens : [<span key="empty"> </span>]
}

function tokenizeText(text: string, segments: { text: string; type: string }[]) {
  const combinedRegex = /\b(SELECT|FROM|WHERE|WITH|AS|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|AND|OR|NOT|IN|IS|NULL|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|INSERT|INTO|UPDATE|SET|DELETE|CREATE|TABLE|VIEW|INDEX|DROP|ALTER|ADD|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|CHECK|UNIQUE|VALUES|ASC|DESC|OVER|PARTITION|ROWS|RANGE|PRECEDING|FOLLOWING|UNBOUNDED|CURRENT|ROW|TRUE|FALSE|ROUND|COALESCE|COUNT|SUM|AVG|MIN|MAX|CAST|IF|IFNULL|NULLIF|IIF)\b|\b(\d+\.?\d*)\b/gi

  let lastIndex = 0
  let match: RegExpExecArray | null
  combinedRegex.lastIndex = 0

  while ((match = combinedRegex.exec(text)) !== null) {
    if (lastIndex < match.index) {
      segments.push({ text: text.slice(lastIndex, match.index), type: "text" })
    }
    if (match[1]) {
      segments.push({ text: match[0], type: "keyword" })
    } else if (match[2]) {
      segments.push({ text: match[0], type: "number" })
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), type: "text" })
  }
}

export function EditorPanel({ filename, content }: EditorPanelProps) {
  const [value, setValue] = useState(content)
  const [branchMenuOpen, setBranchMenuOpen] = useState(false)

  useEffect(() => {
    setValue(content)
  }, [content])

  const lines = value.split("\n")
  const breadcrumb = filePathMap[filename] ?? [filename]

  const highlightedLines = useMemo(() => {
    return lines.map((line) => highlightLine(line))
  }, [value])

  return (
    <div className="flex h-full flex-col">
      {/* Top bar: Branch selector + file tab + breadcrumb */}
      <div className="flex h-10 items-center border-b bg-muted/30">
        {/* Branch selector */}
        <div className="flex items-center gap-2 border-r px-3">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <button
            className="flex items-center gap-1 text-sm font-medium text-foreground"
            onClick={() => setBranchMenuOpen(!branchMenuOpen)}
          >
            main
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer hover:underline">
            Change branch
          </span>
          <Button variant="outline" size="sm" className="h-6 gap-1 px-2 text-xs">
            <Plus className="h-3 w-3" />
            Create branch
          </Button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* File tab bar + breadcrumb */}
      <div className="flex h-9 items-center border-b bg-muted/50">
        {/* Active file tab */}
        <div className="flex h-full items-center gap-1.5 border-r border-b-2 border-b-blue-500 bg-background px-3 text-sm">
          {getFileIcon(filename)}
          <span className="font-medium text-foreground">{filename}</span>
          <X className="ml-2 h-3 w-3 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-3 text-xs text-muted-foreground">
          {breadcrumb.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <span
                className={cn(
                  "hover:text-foreground cursor-pointer",
                  i === breadcrumb.length - 1 && "text-foreground font-medium"
                )}
              >
                {part}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div className="relative flex flex-1 overflow-hidden" style={{ minHeight: "300px" }}>
        {/* Line numbers + syntax highlighted display */}
        <div
          className="absolute inset-0 flex overflow-auto"
          style={{ backgroundColor: "#1e1e1e" }}
        >
          {/* Line numbers gutter */}
          <div
            className="shrink-0 select-none py-3 pr-2 text-right font-mono text-xs leading-[20px]"
            style={{ color: "#858585", width: "52px", minWidth: "52px" }}
          >
            {lines.map((_, i) => (
              <div key={i} className="px-2">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Highlighted code overlay */}
          <div
            className="pointer-events-none absolute py-3 font-mono text-sm leading-[20px] whitespace-pre"
            style={{
              left: "52px",
              paddingLeft: "12px",
              color: "#D4D4D4",
            }}
          >
            {highlightedLines.map((tokens, i) => (
              <div key={i}>{tokens}</div>
            ))}
          </div>

          {/* Editable textarea (transparent text, visible caret) */}
          <textarea
            className="flex-1 resize-none border-0 py-3 pl-3 font-mono text-sm leading-[20px] outline-none"
            style={{
              backgroundColor: "transparent",
              color: "transparent",
              caretColor: "#d4d4d4",
              tabSize: 2,
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
