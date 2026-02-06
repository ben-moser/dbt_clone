import Link from "next/link"
import { Settings } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { CostInsights } from "@/components/dashboard/summary-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Jaffle Shop">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
      </PageHeader>
      <div className="space-y-8 p-6">
        <CostInsights />
        <RecentActivity />
      </div>
    </div>
  )
}
