"use client"

import { useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Terminal,
  CheckCircle2,
  BarChart3,
  Code2,
  GitFork,
  ChevronDown,
  RefreshCw,
  Loader2,
} from "lucide-react"

const mockResults = [
  { order_id: 1, customer_id: 101, amount: 58.0, status: "completed", order_date: "2024-01-15" },
  { order_id: 2, customer_id: 102, amount: 23.5, status: "completed", order_date: "2024-01-16" },
  { order_id: 3, customer_id: 103, amount: 112.0, status: "returned", order_date: "2024-01-16" },
  { order_id: 4, customer_id: 101, amount: 45.99, status: "completed", order_date: "2024-01-17" },
  { order_id: 5, customer_id: 104, amount: 87.25, status: "pending", order_date: "2024-01-18" },
]

const compiledSql = `SELECT
  orders.id AS order_id,
  orders.customer_id,
  ROUND(payments.amount / 100.0, 2) AS amount,
  orders.status,
  orders.order_date
FROM \`dbt_dev\`.\`stg_orders\` AS orders
LEFT JOIN \`dbt_dev\`.\`stg_payments\` AS payments
  ON orders.id = payments.order_id
WHERE orders.status != 'cancelled'
ORDER BY orders.order_date DESC
LIMIT 500`

const mockCommandLog = `> dbt run --select fct_orders
[0.12s] Running with dbt=1.7.4
[0.12s] Registered adapter: bigquery=1.7.4
[0.15s] Found 10 models, 6 tests, 1 macro, 0 seeds
[0.20s] Concurrency: 4 threads (target='dev')
[0.22s] 1 of 1 START sql table model dbt_dev.fct_orders ........ [RUN]
[1.84s] 1 of 1 OK created sql table model dbt_dev.fct_orders ... [CREATE TABLE (5 rows, 1.2 KiB processed) in 1.62s]
[1.85s] Finished running 1 table model in 0 hours 0 minutes and 1.73 seconds (1.73s).
[1.85s] Completed successfully
[1.85s]
[1.85s] Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1`

export function ResultsPanel() {
  const [envMenuOpen, setEnvMenuOpen] = useState(false)

  return (
    <div className="flex h-full flex-col border-t">
      <Tabs defaultValue="lineage" className="flex h-full flex-col">
        {/* Tab bar with environment controls */}
        <div className="flex h-9 items-center justify-between border-b bg-muted/30 px-1">
          {/* Left: Tabs */}
          <TabsList className="h-7 bg-transparent p-0 gap-0">
            <TabsTrigger
              value="commands"
              className="gap-1.5 rounded-none border-b-2 border-b-transparent px-3 py-1 text-xs data-[state=active]:border-b-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Terminal className="h-3 w-3" />
              Commands
            </TabsTrigger>
            <TabsTrigger
              value="code-quality"
              className="gap-1.5 rounded-none border-b-2 border-b-transparent px-3 py-1 text-xs data-[state=active]:border-b-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CheckCircle2 className="h-3 w-3" />
              Code quality
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="gap-1.5 rounded-none border-b-2 border-b-transparent px-3 py-1 text-xs data-[state=active]:border-b-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <BarChart3 className="h-3 w-3" />
              Results
            </TabsTrigger>
            <TabsTrigger
              value="compiled"
              className="gap-1.5 rounded-none border-b-2 border-b-transparent px-3 py-1 text-xs data-[state=active]:border-b-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Code2 className="h-3 w-3" />
              Compiled code
            </TabsTrigger>
            <TabsTrigger
              value="lineage"
              className="gap-1.5 rounded-none border-b-2 border-b-transparent px-3 py-1 text-xs data-[state=active]:border-b-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <GitFork className="h-3 w-3" />
              Lineage
            </TabsTrigger>
          </TabsList>

          {/* Right: Environment selector + Update Graph */}
          <div className="flex items-center gap-2 pr-2">
            <button
              className="flex items-center gap-1.5 rounded border bg-background px-2.5 py-1 text-xs text-foreground hover:bg-muted"
              onClick={() => setEnvMenuOpen(!envMenuOpen)}
            >
              <span className="text-muted-foreground">Env:</span>
              <span className="font-medium">dbt_production</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 text-xs">
              <RefreshCw className="h-3 w-3" />
              Update Graph
            </Button>
          </div>
        </div>

        {/* Tab content panels */}
        <TabsContent value="commands" className="mt-0 flex-1 overflow-auto">
          <div
            className="h-full p-3 font-mono text-xs leading-5"
            style={{ backgroundColor: "#1e1e1e", color: "#d4d4d4" }}
          >
            <pre className="whitespace-pre-wrap">{mockCommandLog}</pre>
          </div>
        </TabsContent>

        <TabsContent value="code-quality" className="mt-0 flex-1 overflow-auto">
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium text-foreground">No issues found</p>
            <p className="text-xs">
              Code quality checks passed. Your SQL follows best practices.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-0 flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 text-xs font-semibold">order_id</TableHead>
                <TableHead className="h-8 text-xs font-semibold">customer_id</TableHead>
                <TableHead className="h-8 text-xs font-semibold">amount</TableHead>
                <TableHead className="h-8 text-xs font-semibold">status</TableHead>
                <TableHead className="h-8 text-xs font-semibold">order_date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResults.map((row) => (
                <TableRow key={row.order_id}>
                  <TableCell className="py-1.5 font-mono text-xs">{row.order_id}</TableCell>
                  <TableCell className="py-1.5 font-mono text-xs">{row.customer_id}</TableCell>
                  <TableCell className="py-1.5 font-mono text-xs">{row.amount.toFixed(2)}</TableCell>
                  <TableCell className="py-1.5 font-mono text-xs">
                    <span
                      className={
                        row.status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : row.status === "returned"
                            ? "text-red-600 dark:text-red-400"
                            : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-1.5 font-mono text-xs">{row.order_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="compiled" className="mt-0 flex-1 overflow-auto">
          <div
            className="h-full p-3"
            style={{ backgroundColor: "#1e1e1e" }}
          >
            <pre
              className="font-mono text-xs leading-5"
              style={{ color: "#d4d4d4" }}
            >
              {compiledSql}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="lineage" className="mt-0 flex-1 overflow-auto">
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-sm">Lineage is loading...</p>
            <p className="text-xs text-muted-foreground/70">
              Building dependency graph for the current model
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
