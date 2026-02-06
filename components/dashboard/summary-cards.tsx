import { Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function CostInsights() {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Cost insights</h2>
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Contact your admin to upgrade your permissions to access cost
            insights data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
