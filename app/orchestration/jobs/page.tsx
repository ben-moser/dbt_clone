import { PageHeader } from "@/components/layout/page-header"
import { JobsTable } from "@/components/deploy/jobs-table"
import { jobs } from "@/lib/mock-data/jobs"

export default function JobsPage() {
  return (
    <div>
      <PageHeader title="Jobs" description="Manage your dbt jobs" />
      <div className="p-6">
        <JobsTable jobs={jobs} />
      </div>
    </div>
  )
}
