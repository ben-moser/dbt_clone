"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { statusDot, timeAgo } from "@/lib/utils"
import { environments } from "@/lib/mock-data/environments"
import { runs as allRuns } from "@/lib/mock-data/runs"
import type { Job } from "@/lib/mock-data/types"

interface JobsTableProps {
  jobs: Job[]
}

export function JobsTable({ jobs }: JobsTableProps) {
  const [search, setSearch] = useState("")
  const [envFilter, setEnvFilter] = useState<string>("all")

  const filtered = jobs.filter((job) => {
    const matchesSearch = job.name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesEnv =
      envFilter === "all" || job.environmentId === envFilter
    return matchesSearch && matchesEnv
  })

  const envName = (envId: string) =>
    environments.find((e) => e.id === envId)?.name ?? envId

  const envType = (envId: string) =>
    environments.find((e) => e.id === envId)?.type ?? "development"

  const latestRunTime = (jobId: string) => {
    const jobRuns = allRuns
      .filter((r) => r.jobId === jobId)
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
    return jobRuns.length > 0 ? jobRuns[0].startedAt : null
  }

  return (
    <div className="space-y-4">
      {/* Top bar: search + env filter + create button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="relative">
          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="h-10 appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All environments</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="flex-1" />

        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="mr-1.5 h-4 w-4" />
          Create job
        </Button>
      </div>

      {/* Job list */}
      <div className="rounded-lg border bg-card">
        {filtered.map((job, index) => {
          const env = envName(job.environmentId)
          const type = envType(job.environmentId)
          const lastRun = latestRunTime(job.id)

          return (
            <div
              key={job.id}
              className={`flex items-center justify-between px-5 py-4 ${
                index < filtered.length - 1 ? "border-b" : ""
              }`}
            >
              {/* Left side: name + meta */}
              <div className="min-w-0 space-y-1">
                <Link
                  href={`/orchestration/jobs/${job.id}`}
                  className="text-sm font-semibold text-foreground hover:text-primary hover:underline"
                >
                  {job.name}
                </Link>
                <div className="flex items-center gap-2 text-xs">
                  <Badge
                    variant="secondary"
                    className={`text-[11px] px-1.5 py-0 font-medium ${
                      type === "production"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : type === "staging"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {env}
                  </Badge>
                  <span className="text-muted-foreground">
                    Latest Fusion
                  </span>
                  <span className="text-muted-foreground/60">|</span>
                  <span className="text-muted-foreground/70">
                    Cost optimization disabled
                  </span>
                </div>
              </div>

              {/* Right side: last run + status */}
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-xs text-muted-foreground">
                  {lastRun ? timeAgo(lastRun) : "Never run"}
                </span>
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${statusDot(
                    job.status
                  )}`}
                  title={job.status}
                />
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No jobs found.
          </div>
        )}
      </div>
    </div>
  )
}
