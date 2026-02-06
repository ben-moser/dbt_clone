import type { Node, Edge } from "@xyflow/react"
import dagre from "dagre"
import { Box, Database, Camera, Sprout, BarChart3, Hexagon, Bookmark } from "lucide-react"
import type { Model } from "@/lib/mock-data/types"

// ── Constants ────────────────────────────────────────────────────────────────

export const NODE_WIDTH = 200
export const NODE_HEIGHT = 50

export const RESOURCE_TYPES = [
  { key: "model", label: "Model", color: "#FF694A", icon: Box },
  { key: "source", label: "Source", color: "#27AE60", icon: Database },
  { key: "snapshot", label: "Snapshot", color: "#9B59B6", icon: Camera },
  { key: "seed", label: "Seed", color: "#0EA5E9", icon: Sprout },
  { key: "metric", label: "Metric", color: "#F59E0B", icon: BarChart3 },
  { key: "semantic_model", label: "Semantic Model", color: "#EC4899", icon: Hexagon },
  { key: "saved_query", label: "Saved Query", color: "#6366F1", icon: Bookmark },
] as const

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getResourceType(model: Model): string {
  if (model.tags.includes("source")) return "source"
  if (model.schema === "metrics") return "metric"
  return "model"
}

export function getNodeBorderColor(resourceType: string): string {
  const rt = RESOURCE_TYPES.find((r) => r.key === resourceType)
  return rt ? rt.color : "#FF694A"
}

// ── Types ────────────────────────────────────────────────────────────────────

export type ModelNodeData = {
  label: string
  materialization: string
  resourceType: string
  selected?: boolean
}

// ── Layout ───────────────────────────────────────────────────────────────────

export function getLayoutedElements(
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
