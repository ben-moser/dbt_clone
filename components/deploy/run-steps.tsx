"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { RunLogViewer } from "@/components/deploy/run-log-viewer"
import type { RunStep } from "@/lib/mock-data/types"

interface RunStepsProps {
  steps: RunStep[]
}

function statusDotColor(status: RunStep["status"]): string {
  switch (status) {
    case "success":
      return "bg-green-500"
    case "error":
      return "bg-red-500"
    case "skipped":
      return "bg-gray-400"
  }
}

export function RunSteps({ steps }: RunStepsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="rounded-lg border bg-card divide-y">
      {steps.map((step, index) => {
        const isExpanded = expandedIndex === index
        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
            >
              <ChevronRight
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${statusDotColor(
                  step.status
                )}`}
              />
              <span className="flex-1 font-mono text-sm truncate">
                {step.name}
              </span>
              {step.duration > 0 && (
                <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                  {formatDuration(step.duration)}
                </span>
              )}
            </button>
            {isExpanded && step.logs && (
              <div className="px-4 pb-3">
                <RunLogViewer logs={step.logs} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
