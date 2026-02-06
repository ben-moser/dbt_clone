import { PageHeader } from "@/components/layout/page-header"
import { RunsTable } from "@/components/deploy/runs-table"
import { runs } from "@/lib/mock-data/runs"

export default function RunsPage() {
  return (
    <div>
      <PageHeader title="Run History" />
      <div className="p-6">
        <RunsTable runs={runs} />
      </div>
    </div>
  )
}
