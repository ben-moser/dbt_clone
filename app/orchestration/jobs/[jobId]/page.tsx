import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { RunsTable } from "@/components/deploy/runs-table"
import { jobs } from "@/lib/mock-data/jobs"
import { runs } from "@/lib/mock-data/runs"
import { environments } from "@/lib/mock-data/environments"
import { statusColor } from "@/lib/utils"

interface JobDetailPageProps {
  params: { jobId: string }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const job = jobs.find((j) => j.id === params.jobId)

  if (!job) {
    return (
      <div>
        <PageHeader title="Job not found" />
        <div className="p-6">
          <p className="text-muted-foreground">
            No job with ID &quot;{params.jobId}&quot; was found.
          </p>
        </div>
      </div>
    )
  }

  const environment = environments.find((e) => e.id === job.environmentId)
  const jobRuns = runs.filter((r) => r.jobId === job.id)

  return (
    <div>
      <PageHeader title={job.name} description={`Job ID: ${job.id}`} />
      <div className="space-y-6 p-6">
        {/* Job details card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Environment
                </p>
                <p className="mt-1 text-sm">
                  {environment?.name ?? job.environmentId}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <Badge className={`mt-1 ${statusColor(job.status)}`}>
                  {job.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Schedule</p>
                <p className="mt-1 font-mono text-sm">
                  {job.schedule || "On trigger"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Last Run Status
                </p>
                {job.lastRunStatus ? (
                  <Badge className={`mt-1 ${statusColor(job.lastRunStatus)}`}>
                    {job.lastRunStatus}
                  </Badge>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Never run</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Commands</p>
                <div className="mt-2 space-y-1">
                  {job.commands.map((cmd, i) => (
                    <pre
                      key={i}
                      className="rounded bg-muted px-3 py-2 font-mono text-xs"
                    >
                      <code>{cmd}</code>
                    </pre>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Run history for this job */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Run History</CardTitle>
            <CardDescription>
              {jobRuns.length} run{jobRuns.length !== 1 ? "s" : ""} for this job
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RunsTable runs={jobRuns} showJobName={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
