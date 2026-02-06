import { environments } from "@/lib/mock-data/environments"
import { Environment } from "@/lib/mock-data/types"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Server, Settings } from "lucide-react"

function envBadgeClass(type: Environment["type"]): string {
  switch (type) {
    case "development":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "staging":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "production":
      return "bg-green-100 text-green-800 border-green-200"
  }
}

export default function EnvironmentsPage() {
  return (
    <div>
      <PageHeader
        title="Environments"
        description="Manage deployment environments"
      />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {environments.map((env) => (
            <Card key={env.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{env.name}</CardTitle>
                  </div>
                  <Badge className={envBadgeClass(env.type)}>{env.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">dbt Version</span>
                    <span className="font-medium">{env.dbtVersion}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Dataset</span>
                    <span className="font-medium">{env.targetDataset}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credentials</span>
                    <span className="font-medium">{"*".repeat(12)}</span>
                  </div>
                  <Separator />
                  <Button variant="outline" className="mt-2 w-full" disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
