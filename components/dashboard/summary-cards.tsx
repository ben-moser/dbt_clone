"use client"

import { useMemo, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend,
  ResponsiveContainer,
  ComposedChart,
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

type ChartView = "savings" | "byJob"

function ByJobTooltip({ active, payload, label }: any) {
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

function SavingsTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  const actualEntry = payload.find((p: any) => p.dataKey === "actualTotal")
  const unoptEntry = payload.find((p: any) => p.dataKey === "unoptimizedTotal")

  const actual = actualEntry?.value ?? 0
  const unoptimized = unoptEntry?.value ?? 0
  const saved = unoptimized - actual
  const pct = unoptimized > 0 ? (saved / unoptimized) * 100 : 0

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md min-w-[220px]">
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">Actual cost</span>
        <span className="font-medium">${actual.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">Without optimization</span>
        <span className="font-medium">${unoptimized.toFixed(2)}</span>
      </div>
      <div className="mt-2 border-t pt-2 flex items-center justify-between gap-4 text-sm font-semibold text-green-600">
        <span>Saved by dbt</span>
        <span>${saved.toFixed(2)} ({pct.toFixed(0)}%)</span>
      </div>
    </div>
  )
}

export function CostInsights() {
  const [view, setView] = useState<ChartView>("savings")

  const chartData = useMemo(() => {
    return dailyCosts.map((d) => {
      const actualTotal = d.productionDaily + d.hourlyIncremental + d.stagingRefresh
      const unoptimizedTotal =
        d.productionDailyUnoptimized + d.hourlyIncrementalUnoptimized + d.stagingRefresh
      const savings = unoptimizedTotal - actualTotal
      return {
        date: d.date,
        actualTotal: Math.round(actualTotal * 100) / 100,
        savings: Math.round(savings * 100) / 100,
        unoptimizedTotal: Math.round(unoptimizedTotal * 100) / 100,
      }
    })
  }, [])

  const { monthTotal, monthUnoptimized, monthSavings, savingsPct, vsLastMonth } = useMemo(() => {
    const total = chartData.reduce((sum, d) => sum + d.actualTotal, 0)
    const unopt = chartData.reduce((sum, d) => sum + d.unoptimizedTotal, 0)
    const saved = unopt - total
    return {
      monthTotal: total,
      monthUnoptimized: unopt,
      monthSavings: saved,
      savingsPct: unopt > 0 ? (saved / unopt) * 100 : 0,
      vsLastMonth: 12.3,
    }
  }, [chartData])

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Cost insights</h2>

      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              ${monthTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">This month (optimized)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-muted-foreground">
              ${monthUnoptimized.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Without dbt</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${monthSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-green-600/80 dark:text-green-400/80">
              Saved by dbt ({savingsPct.toFixed(0)}%)
            </p>
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
          <div className="mb-3 flex gap-1">
            <button
              onClick={() => setView("savings")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                view === "savings"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Savings
            </button>
            <button
              onClick={() => setView("byJob")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                view === "byJob"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              By job
            </button>
          </div>

          {view === "savings" ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                <Tooltip content={<SavingsTooltip />} />
                <Area
                  type="monotone"
                  dataKey="actualTotal"
                  stackId="1"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                  name="Actual cost"
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stackId="1"
                  stroke="#22c55e"
                  strokeDasharray="4 3"
                  fill="#22c55e"
                  fillOpacity={0.15}
                  name="Savings"
                />
                <Line
                  type="monotone"
                  dataKey="unoptimizedTotal"
                  stroke="#ef4444"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                  dot={false}
                  name="Without optimization"
                />
                <Legend iconType="circle" iconSize={8} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
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
                <Tooltip content={<ByJobTooltip />} />
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
