"use client"

import Link from "next/link"
import {
  FileText,
  Columns3,
  GitBranch,
  ArrowRight,
  User,
  Package,
  Database,
  Table2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ModelColumns } from "@/components/explore/model-columns"
import type { Model } from "@/lib/mock-data/types"

// ── Constants ───────────────────────────────────────────────────────────────

const materializationBadgeColor: Record<string, string> = {
  table: "bg-blue-100 text-blue-800 border-blue-200",
  view: "bg-purple-100 text-purple-800 border-purple-200",
  incremental: "bg-amber-100 text-amber-800 border-amber-200",
  ephemeral: "bg-gray-100 text-gray-600 border-gray-200",
}

// ── Detail Row Helper ────────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

interface ModelDetailTabsProps {
  model: Model
  dependsOnModels: { id: string; name: string }[]
  referencedByModels: { id: string; name: string }[]
}

export function ModelDetailTabs({
  model,
  dependsOnModels,
  referencedByModels,
}: ModelDetailTabsProps) {
  return (
    <div>
      {/* Model header with health dot */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full shrink-0",
            model.testsFailing === 0 ? "bg-green-500" : "bg-red-500"
          )}
        />
        <h2 className="text-lg font-semibold">{model.name}</h2>
        <Badge
          variant="outline"
          className={cn(
            "text-xs ml-1",
            materializationBadgeColor[model.materialization]
          )}
        >
          {model.materialization}
        </Badge>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <span>dbt Labs</span>
        <span>/</span>
        <span>PROD</span>
        <span>/</span>
        <span>Jaffle Shop</span>
        <span>/</span>
        <span className="text-foreground font-medium">{model.name}</span>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general" className="gap-1.5">
            <FileText className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="columns" className="gap-1.5">
            <Columns3 className="h-4 w-4" />
            Columns
          </TabsTrigger>
          <TabsTrigger value="relationships" className="gap-1.5">
            <GitBranch className="h-4 w-4" />
            Relationships
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-1 pt-4">
          {/* Description */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Description
            </h3>
            <p className="text-sm leading-relaxed">{model.description}</p>
          </div>

          <Separator />

          {/* Metadata fields */}
          <div className="space-y-0">
            <DetailRow
              icon={User}
              label="Owner"
              value={
                <span className="text-sm">
                  {model.tags.includes("finance")
                    ? "Finance Team"
                    : model.tags.includes("product")
                    ? "Product Team"
                    : "Analytics Engineering"}
                </span>
              }
            />
            <DetailRow
              icon={Package}
              label="Package"
              value="jaffle_shop"
            />
            <DetailRow
              icon={Table2}
              label="Schema"
              value={model.schema}
            />
            <DetailRow
              icon={Database}
              label="Database"
              value={model.database}
            />
          </div>

          <Separator className="my-2" />

          {/* Tags */}
          <div className="py-2.5">
            <p className="text-xs text-muted-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {model.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-2" />

          {/* Materialization */}
          <div className="py-2.5">
            <p className="text-xs text-muted-foreground mb-2">
              Materialization
            </p>
            <Badge
              variant="outline"
              className={cn(
                "text-sm",
                materializationBadgeColor[model.materialization]
              )}
            >
              {model.materialization}
            </Badge>
          </div>
        </TabsContent>

        {/* Columns Tab */}
        <TabsContent value="columns" className="pt-4">
          <ModelColumns columns={model.columns} />
        </TabsContent>

        {/* Relationships Tab */}
        <TabsContent value="relationships" className="space-y-6 pt-4">
          {/* Depends on */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-180" />
              Depends on
              <span className="text-xs font-normal text-muted-foreground">
                ({dependsOnModels.length})
              </span>
            </h3>
            {dependsOnModels.length > 0 ? (
              <div className="space-y-1">
                {dependsOnModels.map((dep) => (
                  <Link
                    key={dep.id}
                    href={`/catalog/models/${dep.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-1 h-4 rounded-full bg-purple-400 shrink-0" />
                    <span className="text-primary group-hover:underline underline-offset-4">
                      {dep.name}
                    </span>
                    <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground pl-3">
                No upstream dependencies
              </p>
            )}
          </div>

          <Separator />

          {/* Referenced by */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              Referenced by
              <span className="text-xs font-normal text-muted-foreground">
                ({referencedByModels.length})
              </span>
            </h3>
            {referencedByModels.length > 0 ? (
              <div className="space-y-1">
                {referencedByModels.map((ref) => (
                  <Link
                    key={ref.id}
                    href={`/catalog/models/${ref.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-1 h-4 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-primary group-hover:underline underline-offset-4">
                      {ref.name}
                    </span>
                    <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground pl-3">
                No downstream references
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
