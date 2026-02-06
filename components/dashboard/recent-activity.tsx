import Link from "next/link"
import { CheckCircle2, XCircle, Loader2, MinusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { runs } from "@/lib/mock-data/runs"
import { jobs } from "@/lib/mock-data/jobs"
import { environments } from "@/lib/mock-data/environments"
import { formatDuration, formatTimestamp } from "@/lib/utils"
import type { Run } from "@/lib/mock-data/types"

const recentRuns = [...runs]
  .sort(
    (a, b) =>
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
  .slice(0, 10)

function StatusIcon({ status }: { status: Run["status"] }) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "running":
      return <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
    case "cancelled":
      return <MinusCircle className="h-5 w-5 text-gray-400" />
  }
}

function getEnvironmentName(jobId: string): string | null {
  const job = jobs.find((j) => j.id === jobId)
  if (!job) return null
  const env = environments.find((e) => e.id === job.environmentId)
  return env?.name ?? null
}

function triggerLabel(trigger: Run["trigger"]): string {
  switch (trigger) {
    case "scheduled":
      return "Schedule"
    case "manual":
      return "Manual"
    case "git":
      return "Pull request"
    case "api":
      return "API"
  }
}

export function RecentActivity() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <Link
          href="/orchestration/runs"
          className="text-sm font-medium text-primary hover:underline"
        >
          View run history
        </Link>
      </div>

      <div className="divide-y rounded-lg border">
        {recentRuns.map((run) => {
          const envName = getEnvironmentName(run.jobId)

          return (
            <Link
              key={run.id}
              href={`/orchestration/runs/${run.id}`}
              className="flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              {/* Left: status icon + run info */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusIcon status={run.status} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{run.jobName}</span>{" "}
                    <span className="text-muted-foreground">
                      Run #{run.id.replace("run-", "")}
                    </span>
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {triggerLabel(run.trigger)}
                    </Badge>
                    {envName && (
                      <Badge
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {envName}
                      </Badge>
                    )}
                    {run.status === "running" && (
                      <span className="text-xs text-muted-foreground">
                        Running for {formatDuration(run.duration)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: timestamp / duration */}
              <div className="shrink-0 text-right">
                <span className="text-xs text-muted-foreground">
                  {run.status === "running"
                    ? `Running for ${formatDuration(run.duration)}`
                    : formatTimestamp(run.startedAt)}
                </span>
                {run.status !== "running" && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDuration(run.duration)}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
