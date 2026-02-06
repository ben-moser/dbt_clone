"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  ChevronRight,
  ChevronDown,
  Box,
  Database,
  TestTube,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Model } from "@/lib/mock-data/types"

// ── Constants ───────────────────────────────────────────────────────────────

const MATERIALIZATION_OPTIONS = [
  { value: "all", label: "All" },
  { value: "table", label: "Table" },
  { value: "view", label: "View" },
  { value: "incremental", label: "Incremental" },
  { value: "ephemeral", label: "Ephemeral" },
] as const

type MaterializationFilter = (typeof MATERIALIZATION_OPTIONS)[number]["value"]

const typeIconColor: Record<string, string> = {
  table: "text-blue-500",
  view: "text-purple-500",
  incremental: "text-amber-500",
  ephemeral: "text-gray-400",
}

// ── Helper: derive modeling layer from schema ────────────────────────────────

function getModelingLayer(model: Model): string {
  if (model.schema === "raw") return "Source"
  if (model.schema === "staging") return "Staging"
  if (model.schema === "intermediate") return "Intermediate"
  if (model.schema === "marts") return "Marts"
  if (model.schema === "metrics") return "Metrics"
  return "Other"
}

const layerBadgeColor: Record<string, string> = {
  Source: "bg-green-50 text-green-700 border-green-200",
  Staging: "bg-sky-50 text-sky-700 border-sky-200",
  Intermediate: "bg-gray-50 text-gray-600 border-gray-200",
  Marts: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Metrics: "bg-orange-50 text-orange-700 border-orange-200",
  Other: "bg-gray-50 text-gray-600 border-gray-200",
}

// ── Helper: format relative time ─────────────────────────────────────────────

function getRelativeTime(index: number): string {
  const options = [
    "2 hours ago",
    "5 hours ago",
    "1 day ago",
    "2 days ago",
    "3 days ago",
    "1 week ago",
  ]
  return options[index % options.length]
}

function getRowCount(model: Model): string {
  const base = (model.name.length * 1337 + model.columns.length * 4217) % 900000 + 1000
  if (base > 100000) return `${(base / 1000).toFixed(1)}K`
  return base.toLocaleString()
}

// ── Asset type counts for left panel ─────────────────────────────────────────

interface AssetCounts {
  model: number
  source: number
  test: number
  total: number
}

function computeAssetCounts(models: Model[]): AssetCounts {
  const sources = models.filter((m) => m.tags.includes("source")).length
  const modelCount = models.length - sources
  const testCount = models.reduce(
    (acc, m) => acc + m.testsPassing + m.testsFailing,
    0
  )
  return {
    model: modelCount,
    source: sources,
    test: testCount,
    total: models.length,
  }
}

// ── Left Panel ───────────────────────────────────────────────────────────────

function ProjectTreePanel({
  models,
  activeAsset,
  onAssetClick,
}: {
  models: Model[]
  activeAsset: string
  onAssetClick: (asset: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const counts = useMemo(() => computeAssetCounts(models), [models])

  const assetTypes = [
    { key: "model", label: "Model", count: counts.model, icon: Box },
    { key: "source", label: "Source", count: counts.source, icon: Database },
    { key: "test", label: "Test", count: counts.test, icon: TestTube },
    { key: "exposure", label: "Exposure", count: 2, icon: Eye },
  ]

  return (
    <div className="w-64 shrink-0 border-r bg-gray-50/50 overflow-y-auto">
      <div className="p-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Projects
        </p>
        {/* Jaffle Shop project */}
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm font-medium"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <Database className="h-3.5 w-3.5 text-green-600" />
            Jaffle Shop
          </button>
          {expanded && (
            <div className="ml-3 mt-0.5 space-y-0.5">
              {assetTypes.map((asset) => {
                const Icon = asset.icon
                const isActive = activeAsset === asset.key
                return (
                  <button
                    key={asset.key}
                    onClick={() => onAssetClick(asset.key)}
                    className={cn(
                      "flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {asset.label}
                    </span>
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        isActive ? "text-blue-600" : "text-muted-foreground"
                      )}
                    >
                      {asset.count}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Other projects (collapsed placeholders) */}
        <div className="mt-2 space-y-0.5">
          {["Marketing Analytics", "Finance Core"].map((name) => (
            <button
              key={name}
              className="flex items-center gap-1.5 w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm text-muted-foreground"
            >
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <Database className="h-3.5 w-3.5 text-muted-foreground" />
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Dropdown Select ──────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

interface ModelsTableProps {
  models: Model[]
}

export function ModelsTable({ models }: ModelsTableProps) {
  const [search, setSearch] = useState("")
  const [materializationFilter, setMaterializationFilter] =
    useState<MaterializationFilter>("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [activeAsset, setActiveAsset] = useState("model")

  // Collect unique tags for filter dropdown
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    models.forEach((m) => m.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [models])

  const tagOptions = [
    { value: "all", label: "All" },
    ...allTags.map((t) => ({ value: t, label: t })),
  ]

  const filtered = useMemo(() => {
    return models.filter((model) => {
      const matchesSearch = model.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesMaterialization =
        materializationFilter === "all" ||
        model.materialization === materializationFilter
      const matchesTag =
        tagFilter === "all" || model.tags.includes(tagFilter)
      const matchesAsset =
        activeAsset === "model"
          ? !model.tags.includes("source")
          : activeAsset === "source"
          ? model.tags.includes("source")
          : true
      return matchesSearch && matchesMaterialization && matchesTag && matchesAsset
    })
  }, [models, search, materializationFilter, tagFilter, activeAsset])

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left panel: Project tree */}
      <ProjectTreePanel
        models={models}
        activeAsset={activeAsset}
        onAssetClick={setActiveAsset}
      />

      {/* Right panel: Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global search bar */}
        <div className="border-b px-6 py-3">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for assets across your account"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Breadcrumb + Title */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <span>dbt Labs</span>
            <ChevronRight className="h-3 w-3" />
            <span>PROD</span>
            <ChevronRight className="h-3 w-3" />
            <span>Jaffle Shop</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium capitalize">
              {activeAsset === "model" ? "Models" : activeAsset === "source" ? "Sources" : "All"}
            </span>
          </div>
          <h1 className="text-xl font-semibold capitalize">
            {activeAsset === "model" ? "Models" : activeAsset === "source" ? "Sources" : activeAsset + "s"}
          </h1>
        </div>

        {/* Filter row */}
        <div className="px-6 py-2 flex items-center gap-4 border-b">
          <FilterSelect
            label="Materialization"
            value={materializationFilter}
            options={MATERIALIZATION_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            onChange={(v) =>
              setMaterializationFilter(v as MaterializationFilter)
            }
          />
          <FilterSelect
            label="Tags"
            value={tagFilter}
            options={tagOptions}
            onChange={setTagFilter}
          />
          <div className="flex-1" />
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
            All Account Models
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-3">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold w-10">Type</TableHead>
                  <TableHead className="font-semibold">Modeling layer</TableHead>
                  <TableHead className="font-semibold">Health</TableHead>
                  <TableHead className="font-semibold">Tags</TableHead>
                  <TableHead className="font-semibold">Last updated</TableHead>
                  <TableHead className="font-semibold text-right">Rows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No models found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((model, index) => {
                    const layer = getModelingLayer(model)
                    const isHealthy = model.testsFailing === 0
                    return (
                      <TableRow
                        key={model.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Name with colored type indicator */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-1 h-6 rounded-full shrink-0",
                                model.materialization === "table"
                                  ? "bg-blue-400"
                                  : model.materialization === "view"
                                  ? "bg-purple-400"
                                  : model.materialization === "incremental"
                                  ? "bg-amber-400"
                                  : "bg-gray-300"
                              )}
                            />
                            <Link
                              href={`/catalog/models/${model.id}`}
                              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                              {model.name}
                            </Link>
                          </div>
                        </TableCell>

                        {/* Type icon */}
                        <TableCell>
                          <Box
                            className={cn(
                              "h-4 w-4",
                              typeIconColor[model.materialization] ||
                                "text-gray-400"
                            )}
                          />
                        </TableCell>

                        {/* Modeling layer badge */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              layerBadgeColor[layer] || layerBadgeColor.Other
                            )}
                          >
                            {layer}
                          </Badge>
                        </TableCell>

                        {/* Health status */}
                        <TableCell>
                          {isHealthy ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-green-700">
                                Passing
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-xs text-red-700">
                                {model.testsFailing} failing
                              </span>
                            </div>
                          )}
                        </TableCell>

                        {/* Tags */}
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {model.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {model.tags.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{model.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Last updated */}
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {getRelativeTime(index)}
                          </div>
                        </TableCell>

                        {/* Row count */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground tabular-nums">
                            <Hash className="h-3 w-3" />
                            {getRowCount(model)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Loaded {filtered.length} of {models.length}
          </p>
        </div>
      </div>
    </div>
  )
}
