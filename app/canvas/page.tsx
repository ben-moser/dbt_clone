import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function CanvasPage() {
  return (
    <div>
      <PageHeader title="Canvas" />
      <div className="p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              Canvas visualization coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
