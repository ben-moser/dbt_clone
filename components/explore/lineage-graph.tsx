"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import dagre from "dagre"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { models } from "@/lib/mock-data/models"
import { lineageEdges } from "@/lib/mock-data/lineage"
import { ModelColumns } from "@/components/explore/model-columns"
import type { Model } from "@/lib/mock-data/types"
import {
  X,
  Box,
  Database,
  Camera,
  Sprout,
  BarChart3,
  Hexagon,
  Bookmark,
  ArrowRight,
  FileText,
  Columns3,
  GitBranch,
  User,
  Package,
  Table2,
} from "lucide-react"

// ── Constants ────────────────────────────────────────────────────────────────

const NODE_WIDTH = 200
const NODE_HEIGHT = 50

// Resource type configuration with colors matching dbt Cloud
const RESOURCE_TYPES = [
  { key: "model", label: "Model", color: "#FF694A", icon: Box },
  { key: "source", label: "Source", color: "#27AE60", icon: Database },
  { key: "snapshot", label: "Snapshot", color: "#9B59B6", icon: Camera },
  { key: "seed", label: "Seed", color: "#0EA5E9", icon: Sprout },
  { key: "metric", label: "Metric", color: "#F59E0B", icon: BarChart3 },
  { key: "semantic_model", label: "Semantic Model", color: "#EC4899", icon: Hexagon },
  { key: "saved_query", label: "Saved Query", color: "#6366F1", icon: Bookmark },
] as const

// Map model tags/schema to a resource type for display
function getResourceType(model: Model): string {
  if (model.tags.includes("source")) return "source"
  if (model.schema === "metrics") return "metric"
  return "model"
}

function getNodeBorderColor(resourceType: string): string {
  const rt = RESOURCE_TYPES.find((r) => r.key === resourceType)
  return rt ? rt.color : "#FF694A"
}

// ── Custom Node Component ────────────────────────────────────────────────────

type ModelNodeData = {
  label: string
  materialization: string
  resourceType: string
  selected?: boolean
}

function ModelNode({ data }: NodeProps<Node<ModelNodeData>>) {
  const borderColor = getNodeBorderColor(data.resourceType)
  const rt = RESOURCE_TYPES.find((r) => r.key === data.resourceType)
  const Icon = rt?.icon || Box

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border bg-white shadow-sm cursor-pointer hover:shadow-md transition-all",
        data.selected && "ring-2 ring-blue-400 shadow-md"
      )}
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-1.5 !h-1.5" />
      <div className="flex items-center gap-2 px-3 py-2 min-w-0">
        <Icon
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: borderColor }}
        />
        <span className="text-xs font-medium truncate">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-1.5 !h-1.5" />
    </div>
  )
}

const nodeTypes = { modelNode: ModelNode }

// ── Layout with dagre ────────────────────────────────────────────────────────

function getLayoutedElements(
  nodes: Node<ModelNodeData>[],
  edges: Edge[]
): { nodes: Node<ModelNodeData>[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 120 })

  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }

  for (const edge of edges) {
    dagreGraph.setEdge(edge.source, edge.target)
  }

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
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
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className="text-xs">{value}</div>
      </div>
    </div>
  )
}

// ── Right Side Detail Panel ──────────────────────────────────────────────────

function NodeDetailPanel({
  model,
  onClose,
}: {
  model: Model
  onClose: () => void
}) {
  // Resolve relationships
  const dependsOnModels = model.dependsOn
    .map((depId) => {
      const dep = models.find((m) => m.id === depId)
      return dep ? { id: dep.id, name: dep.name } : null
    })
    .filter(Boolean) as { id: string; name: string }[]

  const referencedByModels = model.referencedBy
    .map((refId) => {
      const ref = models.find((m) => m.id === refId)
      return ref ? { id: ref.id, name: ref.name } : null
    })
    .filter(Boolean) as { id: string; name: string }[]

  return (
    <div className="w-80 border-l bg-white flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              model.testsFailing === 0 ? "bg-green-500" : "bg-red-500"
            )}
          />
          <span className="text-sm font-semibold truncate">{model.name}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 text-muted-foreground shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Description */}
      <div className="px-4 py-3 border-b">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {model.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="justify-start px-4 shrink-0">
            <TabsTrigger value="general" className="text-xs gap-1 px-2">
              <FileText className="h-3 w-3" />
              General
            </TabsTrigger>
            <TabsTrigger value="columns" className="text-xs gap-1 px-2">
              <Columns3 className="h-3 w-3" />
              Columns
            </TabsTrigger>
            <TabsTrigger value="relationships" className="text-xs gap-1 px-2">
              <GitBranch className="h-3 w-3" />
              Relationships
            </TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-0">
              <DetailRow
                icon={User}
                label="Owner"
                value={
                  model.tags.includes("finance")
                    ? "Finance Team"
                    : model.tags.includes("product")
                    ? "Product Team"
                    : "Analytics Engineering"
                }
              />
              <DetailRow icon={Package} label="Package" value="jaffle_shop" />
              <DetailRow icon={Table2} label="Schema" value={model.schema} />
              <DetailRow icon={Database} label="Database" value={model.database} />
            </div>
            <Separator className="my-2" />
            <div className="py-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                Tags
              </p>
              <div className="flex flex-wrap gap-1">
                {model.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="my-2" />
            <Link
              href={`/catalog/models/${model.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium py-2"
            >
              View full details
              <ArrowRight className="h-3 w-3" />
            </Link>
          </TabsContent>

          {/* Columns */}
          <TabsContent value="columns" className="flex-1 overflow-y-auto px-4 py-2">
            <ModelColumns columns={model.columns} />
          </TabsContent>

          {/* Relationships */}
          <TabsContent value="relationships" className="flex-1 overflow-y-auto px-4 py-2">
            {/* Depends on */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-muted-foreground rotate-180" />
                Depends on ({dependsOnModels.length})
              </h4>
              {dependsOnModels.length > 0 ? (
                <div className="space-y-1">
                  {dependsOnModels.map((dep) => (
                    <Link
                      key={dep.id}
                      href={`/catalog/models/${dep.id}`}
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-4 py-1"
                    >
                      <div className="w-1 h-3 rounded-full bg-purple-400 shrink-0" />
                      {dep.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">None</p>
              )}
            </div>
            <Separator />
            {/* Referenced by */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                Referenced by ({referencedByModels.length})
              </h4>
              {referencedByModels.length > 0 ? (
                <div className="space-y-1">
                  {referencedByModels.map((ref) => (
                    <Link
                      key={ref.id}
                      href={`/catalog/models/${ref.id}`}
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-4 py-1"
                    >
                      <div className="w-1 h-3 rounded-full bg-blue-400 shrink-0" />
                      {ref.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">None</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ── Bottom Filter Bar ────────────────────────────────────────────────────────

function BottomFilterBar({
  enabledTypes,
  onToggle,
}: {
  enabledTypes: Set<string>
  onToggle: (key: string) => void
}) {
  return (
    <div className="border-t bg-white px-4 py-2.5 flex items-center gap-4 shrink-0">
      <span className="text-xs font-medium text-muted-foreground mr-2">
        Resource Type
      </span>
      {RESOURCE_TYPES.map((rt) => {
        const Icon = rt.icon
        const isEnabled = enabledTypes.has(rt.key)
        return (
          <button
            key={rt.key}
            onClick={() => onToggle(rt.key)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
              isEnabled
                ? "border-gray-300 bg-white text-foreground shadow-sm"
                : "border-transparent bg-transparent text-muted-foreground opacity-50 hover:opacity-75"
            )}
          >
            <Icon
              className="h-3 w-3"
              style={{ color: isEnabled ? rt.color : undefined }}
            />
            {rt.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export function LineageGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(
    () => new Set(["model", "source", "metric"])
  )

  const handleToggle = useCallback((key: string) => {
    setEnabledTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const selectedModel = useMemo(
    () => (selectedNodeId ? models.find((m) => m.id === selectedNodeId) : null),
    [selectedNodeId]
  )

  const { nodes, edges } = useMemo(() => {
    // Filter models by enabled resource types
    const filteredModels = models.filter((m) => {
      const rt = getResourceType(m)
      return enabledTypes.has(rt)
    })

    const filteredIds = new Set(filteredModels.map((m) => m.id))

    const rawNodes: Node<ModelNodeData>[] = filteredModels.map((model) => ({
      id: model.id,
      type: "modelNode",
      data: {
        label: model.name,
        materialization: model.materialization,
        resourceType: getResourceType(model),
        selected: model.id === selectedNodeId,
      },
      position: { x: 0, y: 0 },
    }))

    const rawEdges: Edge[] = lineageEdges
      .filter((edge) => filteredIds.has(edge.source) && filteredIds.has(edge.target))
      .map((edge, index) => ({
        id: `e-${index}`,
        source: edge.source,
        target: edge.target,
        animated: false,
        style: { stroke: "#94a3b8", strokeWidth: 1.5 },
        type: "smoothstep",
      }))

    return getLayoutedElements(rawNodes, rawEdges)
  }, [enabledTypes, selectedNodeId])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id))
    },
    []
  )

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
      <div className="flex flex-1 min-h-0">
        {/* DAG area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            minZoom={0.2}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e2e8f0" gap={20} />
            <Controls className="!bottom-4 !left-4" />
            <MiniMap
              nodeStrokeWidth={2}
              nodeColor={(node) => {
                const data = node.data as ModelNodeData
                return getNodeBorderColor(data.resourceType)
              }}
              zoomable
              pannable
              className="!bottom-4 !right-4"
            />
          </ReactFlow>
        </div>

        {/* Right detail panel */}
        {selectedModel && (
          <NodeDetailPanel
            model={selectedModel}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      {/* Bottom filter bar */}
      <BottomFilterBar enabledTypes={enabledTypes} onToggle={handleToggle} />
    </div>
  )
}
