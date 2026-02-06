import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import type { Column } from "@/lib/mock-data/types"

interface ModelColumnsProps {
  columns: Column[]
}

export function ModelColumns({ columns }: ModelColumnsProps) {
  if (columns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No columns defined for this model.
      </p>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tests</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {columns.map((col) => (
            <TableRow key={col.name}>
              <TableCell className="font-mono text-sm font-medium">
                {col.name}
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {col.type}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[320px]">
                {col.description}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {col.tests.length > 0 ? (
                    col.tests.map((test) => (
                      <Badge
                        key={test}
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        {test}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">--</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
