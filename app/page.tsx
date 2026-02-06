import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

export default function AccountHomePage() {
  return (
    <div>
      <PageHeader title="Account Home" />
      <div className="space-y-6 p-6">
        {/* Greeting */}
        <h2 className="text-xl font-semibold">Welcome!</h2>

        {/* All production projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All production projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Last run</TableHead>
                  <TableHead>Models</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <Link
                      href="/dashboard"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Jaffle Shop
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200" variant="outline">
                      Fusion
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">23m ago</TableCell>
                  <TableCell className="text-muted-foreground">15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* All model builds placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All model builds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Model build overview coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
