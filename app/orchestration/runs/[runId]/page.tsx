import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RunSteps } from "@/components/deploy/run-steps"
import { runs } from "@/lib/mock-data/runs"
import { statusColor, formatDuration, formatTimestamp } from "@/lib/utils"

interface RunDetailPageProps {
  params: { runId: string }
}

export default function RunDetailPage({ params }: RunDetailPageProps) {
  const run = runs.find((r) => r.id === params.runId)

  if (!run) {
    return (
      <div>
        <PageHeader title="Run not found" />
        <div className="p-6">
          <p className="text-muted-foreground">
            No run with ID &quot;{params.runId}&quot; was found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={`Run #${run.id}`} />
      <div className="space-y-6 p-6">
        {/* Metadata card */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <Badge className={`mt-1 ${statusColor(run.status)}`}>
                  {run.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Job</p>
                <Link
                  href={`/orchestration/jobs/${run.jobId}`}
                  className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {run.jobName}
                </Link>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Trigger</p>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {run.trigger}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Started</p>
                <p className="mt-1 text-sm">{formatTimestamp(run.startedAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Finished</p>
                <p className="mt-1 text-sm">
                  {run.finishedAt ? formatTimestamp(run.finishedAt) : "In progress"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Duration</p>
                <p className="mt-1 text-sm">{formatDuration(run.duration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <RunSteps steps={run.steps} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
