import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function InsightsPage() {
  return (
    <div>
      <PageHeader title="Insights" />
      <div className="p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              Insights dashboard coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
