import { PageHeader } from "@/components/layout/page-header"
import { LineageGraph } from "@/components/explore/lineage-graph"

export default function LineagePage() {
  return (
    <div>
      <PageHeader
        title="Lineage"
        description="Model dependency graph"
      />
      <div className="p-6">
        <LineageGraph />
      </div>
    </div>
  )
}
