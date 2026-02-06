"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { statusDot, statusColor, formatDuration, timeAgo } from "@/lib/utils"
import type { Run } from "@/lib/mock-data/types"

const STATUS_FILTERS = ["all", "success", "error", "running", "cancelled"] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

interface RunsTableProps {
  runs: Run[]
  showJobName?: boolean
}

export function RunsTable({ runs, showJobName = true }: RunsTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const sorted = [...runs].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )

  const filtered =
    statusFilter === "all"
      ? sorted
      : sorted.filter((r) => r.status === statusFilter)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
            className="capitalize"
          >
            {s}
          </Button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Status</TableHead>
            <TableHead>Run ID</TableHead>
            {showJobName && <TableHead>Job Name</TableHead>}
            <TableHead>Trigger</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Started At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((run) => (
            <TableRow key={run.id}>
              <TableCell>
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot(run.status)}`}
                  title={run.status}
                />
              </TableCell>
              <TableCell>
                <Link
                  href={`/orchestration/runs/${run.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  #{run.id}
                </Link>
              </TableCell>
              {showJobName && (
                <TableCell className="text-muted-foreground">
                  {run.jobName}
                </TableCell>
              )}
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {run.trigger}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDuration(run.duration)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {timeAgo(run.startedAt)}
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={showJobName ? 6 : 5}
                className="text-center text-muted-foreground py-8"
              >
                No runs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
