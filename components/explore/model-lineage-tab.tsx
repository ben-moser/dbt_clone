"use client"

import { useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { cn } from "@/lib/utils"
import { models } from "@/lib/mock-data/models"
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  RESOURCE_TYPES,
  getResourceType,
  getNodeBorderColor,
  getLayoutedElements,
  type ModelNodeData,
} from "@/components/explore/lineage-utils"
import { Box } from "lucide-react"

// ── Custom Node (with highlight ring for the focal model) ────────────────────

function LineageModelNode({
  data,
}: NodeProps<Node<ModelNodeData & { isFocal?: boolean }>>) {
  const borderColor = getNodeBorderColor(data.resourceType)
  const rt = RESOURCE_TYPES.find((r) => r.key === data.resourceType)
  const Icon = rt?.icon || Box

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border bg-white shadow-sm cursor-pointer hover:shadow-md transition-all",
        data.isFocal && "ring-2 ring-blue-500 shadow-md"
      )}
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !w-1.5 !h-1.5"
      />
      <div className="flex items-center gap-2 px-3 py-2 min-w-0">
        <Icon
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: borderColor }}
        />
        <span className="text-xs font-medium truncate">{data.label}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !w-1.5 !h-1.5"
      />
    </div>
  )
}

const nodeTypes = { lineageModelNode: LineageModelNode }

// ── Transitive lineage collection ────────────────────────────────────────────

function collectLineage(modelId: string): Set<string> {
  const visited = new Set<string>()
  const modelMap = new Map(models.map((m) => [m.id, m]))

  function walkUp(id: string) {
    if (visited.has(id)) return
    visited.add(id)
    const m = modelMap.get(id)
    m?.dependsOn.forEach(walkUp)
  }

  function walkDown(id: string) {
    if (visited.has(id)) return
    visited.add(id)
    const m = modelMap.get(id)
    m?.referencedBy.forEach(walkDown)
  }

  walkUp(modelId)
  visited.delete(modelId) // reset so walkDown can add it back
  walkDown(modelId)
  return visited
}

// ── Main Component ───────────────────────────────────────────────────────────

export function ModelLineageTab({ modelId }: { modelId: string }) {
  const router = useRouter()

  const { nodes, edges } = useMemo(() => {
    const lineageIds = collectLineage(modelId)

    const rawNodes: Node<ModelNodeData & { isFocal?: boolean }>[] = []
    const rawEdges: Edge[] = []
    const edgeSet = new Set<string>()

    Array.from(lineageIds).forEach((id) => {
      const m = models.find((model) => model.id === id)
      if (!m) return

      rawNodes.push({
        id: m.id,
        type: "lineageModelNode",
        data: {
          label: m.name,
          materialization: m.materialization,
          resourceType: getResourceType(m),
          isFocal: m.id === modelId,
        },
        position: { x: 0, y: 0 },
      })

      // Add edges for dependencies within the subgraph
      m.dependsOn.forEach((depId) => {
        if (lineageIds.has(depId)) {
          const edgeKey = `${depId}->${m.id}`
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey)
            rawEdges.push({
              id: `e-${edgeKey}`,
              source: depId,
              target: m.id,
              animated: false,
              style: { stroke: "#94a3b8", strokeWidth: 1.5 },
              type: "smoothstep",
            })
          }
        }
      })
    })

    return getLayoutedElements(rawNodes, rawEdges)
  }, [modelId])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.id !== modelId) {
        router.push(`/catalog/models/${node.id}`)
      }
    },
    [modelId, router]
  )

  return (
    <div className="h-[500px] w-full rounded-lg border bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls className="!bottom-4 !left-4" />
      </ReactFlow>
    </div>
  )
}
