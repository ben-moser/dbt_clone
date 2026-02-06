"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { dailyCosts } from "@/lib/mock-data/costs"

const JOB_COLORS = {
  productionDaily: "#6366f1",
  hourlyIncremental: "#22d3ee",
  stagingRefresh: "#f59e0b",
} as const

const JOB_LABELS: Record<string, string> = {
  productionDaily: "Production Daily",
  hourlyIncremental: "Hourly Incremental",
  stagingRefresh: "Staging Refresh",
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  const total = payload.reduce(
    (sum: number, entry: any) => sum + (entry.value ?? 0),
    0
  )

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-2 text-sm font-medium">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{JOB_LABELS[entry.dataKey]}</span>
          </div>
          <span className="font-medium">${entry.value.toFixed(2)}</span>
        </div>
      ))}
      <div className="mt-2 border-t pt-2 text-sm font-semibold">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  )
}

export function CostInsights() {
  const { monthTotal, dailyAvg, vsLastMonth } = useMemo(() => {
    const total = dailyCosts.reduce(
      (sum, d) => sum + d.productionDaily + d.hourlyIncremental + d.stagingRefresh,
      0
    )
    return {
      monthTotal: total,
      dailyAvg: total / dailyCosts.length,
      vsLastMonth: 12.3,
    }
  }, [])

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Cost insights</h2>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">${monthTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">${dailyAvg.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Daily average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5">
              {vsLastMonth >= 0 ? (
                <TrendingUp className="h-5 w-5 text-red-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-500" />
              )}
              <p className="text-2xl font-bold">{vsLastMonth >= 0 ? "+" : ""}{vsLastMonth}%</p>
            </div>
            <p className="text-sm text-muted-foreground">vs. last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyCosts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) => JOB_LABELS[value] ?? value}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="stagingRefresh"
                stackId="1"
                stroke={JOB_COLORS.stagingRefresh}
                fill={JOB_COLORS.stagingRefresh}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="productionDaily"
                stackId="1"
                stroke={JOB_COLORS.productionDaily}
                fill={JOB_COLORS.productionDaily}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="hourlyIncremental"
                stackId="1"
                stroke={JOB_COLORS.hourlyIncremental}
                fill={JOB_COLORS.hourlyIncremental}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
